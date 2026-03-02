import React, { useState } from 'react';
import { Contact } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Search,
    Mail,
    Phone,
    FileText,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    Clock,
    MessageSquare,
    ChevronDown,
    ExternalLink
} from 'lucide-react';

interface OutreachProps {
    contacts: Contact[];
    onUpdateContacts: (contacts: Contact[]) => void;
}

const Outreach: React.FC<OutreachProps> = ({ contacts, onUpdateContacts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const addContact = () => {
        const newContact: Contact = {
            id: Date.now().toString(),
            name: 'New Contact',
            role: 'Role/Title',
            email: '',
            phone: '',
            notes: '',
            status: 'Pending'
        };
        onUpdateContacts([newContact, ...contacts]);
        setEditingId(newContact.id);
    };

    const updateContact = (id: string, updates: Partial<Contact>) => {
        onUpdateContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteContact = (id: string) => {
        if (confirm('Delete this contact?')) {
            onUpdateContacts(contacts.filter(c => c.id !== id));
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case 'In Discussion': return <MessageSquare className="w-4 h-4 text-blue-400" />;
            case 'Confirmed': return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* HUD Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black font-['Outfit'] tracking-tighter text-white mb-2 flex items-center gap-4">
                        Outreach CRM
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <span className="text-xs font-mono text-blue-400">{contacts.length} Records</span>
                        </div>
                    </h2>
                    <p className="text-gray-500 font-medium italic">Intel & Relationship Management</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter Intel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                    <button
                        onClick={addContact}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Record
                    </button>
                </div>
            </header>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredContacts.map((contact) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={contact.id}
                            className={`glass-card p-1 relative group ${editingId === contact.id ? 'border-blue-500/50 ring-1 ring-blue-500/20' : ''}`}
                        >
                            <div className="p-8">
                                {/* Status & Options */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="relative">
                                        <select
                                            value={contact.status}
                                            onChange={(e) => updateContact(contact.id, { status: e.target.value as any })}
                                            className="appearance-none bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-300 pr-10 focus:outline-none focus:border-blue-500/50"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="In Discussion">In Discussion</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                                    </div>
                                    <button
                                        onClick={() => deleteContact(contact.id)}
                                        className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Primary Info */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <input
                                                value={contact.name}
                                                onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                                                onFocus={() => setEditingId(contact.id)}
                                                className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none border-b border-transparent focus:border-blue-500/30 py-1"
                                                placeholder="Assign Name..."
                                            />
                                            <input
                                                value={contact.role}
                                                onChange={(e) => updateContact(contact.id, { role: e.target.value })}
                                                className="w-full bg-transparent text-sm text-blue-400 font-medium focus:outline-none"
                                                placeholder="Title / Context..."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 group/field">
                                                <Mail className="w-4 h-4 text-gray-500 group-focus-within/field:text-blue-400" />
                                                <input
                                                    value={contact.email || ''}
                                                    onChange={(e) => updateContact(contact.id, { email: e.target.value })}
                                                    className="flex-grow bg-transparent text-xs text-gray-400 focus:outline-none font-mono"
                                                    placeholder="Email Address"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 group/field">
                                                <Phone className="w-4 h-4 text-gray-500 group-focus-within/field:text-blue-400" />
                                                <input
                                                    value={contact.phone || ''}
                                                    onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                                                    className="flex-grow bg-transparent text-xs text-gray-400 focus:outline-none font-mono"
                                                    placeholder="Phone Number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes & Intel */}
                                    <div className="bg-white/5 rounded-3xl p-6 relative border border-white/5 group/notes">
                                        <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                            <FileText className="w-3 h-3" />
                                            Field Notes
                                        </div>
                                        <textarea
                                            value={contact.notes || ''}
                                            onChange={(e) => updateContact(contact.id, { notes: e.target.value })}
                                            className="w-full h-24 bg-transparent text-xs text-gray-300 leading-relaxed focus:outline-none resize-none custom-scrollbar"
                                            placeholder="Enter relationship intel, specific requirements, or meeting history..."
                                        />
                                        <div className="absolute top-4 right-4 text-[10px] text-gray-600 opacity-0 group-hover/notes:opacity-100 transition-opacity">
                                            AUTO-SAVE ACTIVE
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions Footer */}
                                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                                    <button className="flex-grow bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                        <ExternalLink className="w-3 h-3" />
                                        Archive Intel
                                    </button>
                                    <button className="flex-grow bg-blue-500/10 hover:bg-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                        <MessageSquare className="w-3 h-3" />
                                        Log Contact
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredContacts.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No matching intel records found in current frequency.</p>
                </div>
            )}
        </div>
    );
};

export default Outreach;
