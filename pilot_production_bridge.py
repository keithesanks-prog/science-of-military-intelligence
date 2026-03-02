import os
import requests
import json
import time
import google.generativeai as genai
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
import re
import subprocess

# config/setup
load_dotenv()
EL_CLIENT = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
LTX_API_KEY = os.getenv("LTX_API_KEY") 
LTX_BASE_URL = "https://api.ltx.studio/v1" # Or official LTX-2 endpoint

# Gemini Config (Imagen 3)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
IMAGEN_MODEL = "imagen-3.0-generate-001" 

def generate_anchor_image(prompt, filename):
    """Generates the Master 2D Technical Illustration using Gemini."""
    print(f"Gemini Illustrating: {prompt[:50]}...")
    model = genai.GenerativeModel(IMAGEN_MODEL)
    response = model.generate_content(f"Technical 2D Realistic Cartoon Illustration: {prompt}")
    img_path = f"Episode_1/Assets/Anchors/{filename}"
    return img_path

import re

def generate_voiceover(text, filename, voice_id=os.getenv("VOICE_ID")):
    """Generates audio using cloned voice. Strips speaker tags first."""
    # Strip any "Narrator:", "Voiceover:", or "[Name]:" tags
    clean_text = re.sub(r'^[A-Za-z0-9\s]+:\s*', '', text)
    clean_text = re.sub(r'\[.*?\]\s*', '', clean_text)
    
    print(f"Narrating: {clean_text[:50]}...")
    audio = EL_CLIENT.generate(text=clean_text, voice=voice_id, model="eleven_multilingual_v2")
    with open(f"Episode_1/Audio/{filename}", "wb") as f:
        f.write(audio)
    print(f"Voiceover saved to {filename}")

def get_audio_duration(file_path):
    """Uses ffprobe to get the exact duration of the audio file."""
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", file_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(result.stdout.strip())

def sync_video_to_audio(video_path, audio_path, output_path):
    """Dynamically stretches/shrinks video to match audio length and merges them."""
    audio_dur = get_audio_duration(audio_path)
    # Get video dur (assuming LTX-2 standard 4s if not measurable)
    video_dur = 4.0 
    
    speed_factor = video_dur / audio_dur
    
    # FFmpeg command: Adjust video speed and merge audio
    # setpts filter handles the temporal stretching
    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-i", audio_path,
        "-filter:v", f"setpts={1/speed_factor}*PTS",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-shortest",
        output_path
    ]
    print(f"Syncing: {video_dur}s video -> {audio_dur}s audio (Speed Factor: {speed_factor:.2f})")
    subprocess.run(cmd, capture_output=True)

def generate_ltx_video(prompt, start_img, end_img, filename):
    """Sends Keyframe Pair to LTX-2 API for production-quality animation."""
    print(f"Animating via LTX-2: {prompt[:50]}...")
    headers = {"Authorization": f"Bearer {LTX_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "prompt": prompt,
        "keyframes": [
            {"frame": 0, "image": start_img},
            {"frame": 120, "image": end_img} # Assuming 30fps, 4s clip
        ],
        "style": "2D Animation / Technical Illustration",
        "aspect_ratio": "16:9"
    }
    
    response = requests.post(f"{LTX_BASE_URL}/generations", headers=headers, json=payload)
    if response.status_code == 201:
        gen_id = response.json()['id']
        print(f"LTX Job Started: {gen_id}")
        return gen_id
    else:
        print(f"LTX Error: {response.text}")
        return None

def wait_for_ltx_completion(gen_id, filename, max_wait_sec=600):
    """Polls LTX API until the video is ready, then downloads it."""
    headers = {"Authorization": f"Bearer {LTX_API_KEY}"}
    start_time = time.time()
    
    while time.time() - start_time < max_wait_sec:
        response = requests.get(f"{LTX_BASE_URL}/generations/{gen_id}", headers=headers)
        if response.status_code == 200:
            data = response.json()
            status = data.get("status")
            if status == "completed":
                video_url = data.get("video_url")
                print(f"Video {gen_id} completed! Downloading to {filename}...")
                video_data = requests.get(video_url).content
                with open(f"Episode_1/Visuals/{filename}", "wb") as f:
                    f.write(video_data)
                return True
            elif status == "failed":
                print(f"LTX Error for {gen_id}: {data.get('error')}")
                return False
        
        print(f"Waiting for LTX {gen_id} (Status: {status})...")
        time.sleep(20)
    
    print(f"Timeout waiting for LTX {gen_id}")
    return False

def process_stitch_list(json_path):
    """The master loop: Runs through our Visual Stitch List and generates everything."""
    with open(json_path, 'r') as f:
        config = json.load(f)
    
    for segment in config['segments']:
        print(f"\n--- Processing: {segment['name']} ---")
        
        # 1. Generate Voiceover
        generate_voiceover(segment['script'], f"{segment['id']}_voice.mp3")
        
        # 2. Generate Gemini Keyframes (requires local key)
        start_img = generate_anchor_image(segment['prompt_a'], f"{segment['id']}_start.png")
        end_img = generate_anchor_image(segment['prompt_b'], f"{segment['id']}_end.png")
        
        # 3. Trigger LTX Animation
        video_filename = f"{segment['id']}_raw_video.mp4"
        gen_id = generate_ltx_video(segment['animation_desc'], start_img, end_img, video_filename)
        
        if gen_id:
            if wait_for_ltx_completion(gen_id, video_filename):
                # 4. Final Sync & Stitch
                audio_path = f"Episode_1/Audio/{segment['id']}_voice.mp3"
                video_path = f"Episode_1/Visuals/{video_filename}"
                final_path = f"Episode_1/Production/{segment['id']}_final.mp4"
                
                sync_video_to_audio(video_path, audio_path, final_path)
                print(f"--- Segment Complete: {final_path} ---")

# Example structure for the stitch list (JSON)
# process_stitch_list("Episode_1_v1.json")
