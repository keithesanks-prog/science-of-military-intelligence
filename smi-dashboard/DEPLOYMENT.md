# Deploying the SMI Dashboard

To make this dashboard accessible to your entire team, the easiest way is to use **Vercel**.

## Step 1: Push to GitHub
1. Initialize a git repository in the `smi-dashboard` folder.
2. Create a new repository on [GitHub](https://github.com).
3. Push your code to the GitHub repository.

## Step 2: Connect to Vercel
1. Go to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your `smi-dashboard` repository.
4. Click **Deploy**.

## Step 3: Shared State (Optional)
The current app uses `localStorage`, meaning edits are saved to each person's browser individually. To have a **shared real-time database**:
1. Sign up for [Supabase](https://supabase.com).
2. Create a project and a table for `episodes`, `contacts`, etc.
3. Replace the `useSMIState` hook logic with Supabase fetch/upsert calls.
4. Add your Supabase URL and Key to Vercel environment variables.

Your dashboard will then be live at `https://your-project-name.vercel.app`.
