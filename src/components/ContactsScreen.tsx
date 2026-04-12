import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Shield, Pill, Edit2, Trash2, X, Phone } from 'lucide-react';
import { Contact } from '../types';

interface ContactsScreenProps {
  contacts: Contact[];
  onAdd: (contact: Omit<Contact, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({ contacts, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'sos' | 'medical'>('sos');

  const handleSave = () => {
    if (name && phone) {
      onAdd({ name, phone, type });
      setName('');
      setPhone('');
      setShowAdd(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 pt-4 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emergency Contacts</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-sos-yellow text-sos-dark px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-1 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>ADD</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-24">
        {contacts.length === 0 ? (
          <div className="text-center py-20 text-sos-grey italic">No contacts added yet.</div>
        ) : (
          contacts.map(contact => (
            <motion.div 
              layout
              key={contact.id}
              className="glass p-4 rounded-2xl flex items-center justify-between border-l-4 border-sos-yellow"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  contact.type === 'sos' ? 'bg-sos-red/10 text-sos-red' : 'bg-sos-green/10 text-sos-green'
                }`}>
                  {contact.type === 'sos' ? <Shield size={20} /> : <Pill size={20} />}
                </div>
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-xs text-sos-grey">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={`tel:${contact.phone}`}
                  className="w-10 h-10 bg-sos-red/10 rounded-full flex items-center justify-center text-sos-red active:scale-90 transition-all"
                >
                  <Phone size={18} />
                </a>
                <button 
                  onClick={() => onDelete(contact.id)}
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-sos-grey hover:text-sos-danger transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-sos-dark/80 backdrop-blur-sm p-0 sm:p-6">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md glass rounded-t-[32px] sm:rounded-[32px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Contact</h3>
                <button onClick={() => setShowAdd(false)} className="text-sos-grey"><X size={24} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-sos-grey uppercase ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Dr. Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-sos-yellow transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-sos-grey uppercase ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-sos-yellow transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-sos-grey uppercase ml-1">Contact Type</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setType('sos')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                        type === 'sos' ? 'bg-sos-red border-sos-red text-white' : 'bg-white/5 border-white/10 text-sos-grey'
                      }`}
                    >
                      SOS ALERT
                    </button>
                    <button 
                      onClick={() => setType('medical')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                        type === 'medical' ? 'bg-sos-green border-sos-green text-white' : 'bg-white/5 border-white/10 text-sos-grey'
                      }`}
                    >
                      MEDICAL
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-sos-green text-sos-dark py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  SAVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
