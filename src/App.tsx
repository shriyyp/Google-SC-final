/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertTriangle, ArrowLeft, Send, Loader2, MessageSquare, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Tab, Contact, Medication } from './types';
import { Navigation } from './components/Navigation';
import { SOSScreen } from './components/SOSScreen';
import { MedicalScreen } from './components/MedicalScreen';
import { ContactsScreen } from './components/ContactsScreen';
import { MapScreen } from './components/MapScreen';
import { HelpScreen } from './components/HelpScreen';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('sos');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isSOSSent, setIsSOSSent] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('guardian_contacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));

    const savedMeds = localStorage.getItem('guardian_meds');
    if (savedMeds) setMedications(JSON.parse(savedMeds));

    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('guardian_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('guardian_meds', JSON.stringify(medications));
  }, [medications]);

  const handleSOS = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsGettingLocation(false);
          setIsSOSSent(true);
        },
        () => {
          setIsGettingLocation(false);
          setIsSOSSent(true);
        }
      );
    } else {
      setIsGettingLocation(false);
      setIsSOSSent(true);
    }
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    setContacts([...contacts, { ...contact, id: Date.now().toString() }]);
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const addMedication = (med: Omit<Medication, 'id' | 'taken'>) => {
    setMedications([...medications, { ...med, id: Date.now().toString(), taken: false }]);
  };

  const takeMedication = (id: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, taken: true } : m));
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-sos-dark relative overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'sos' && (
            <motion.div key="sos" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="h-full">
              <SOSScreen onSOS={handleSOS} isGettingLocation={isGettingLocation} isSOSSent={isSOSSent} setIsSOSSent={setIsSOSSent} location={location} />
            </motion.div>
          )}
          {activeTab === 'medical' && (
            <motion.div key="medical" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="h-full">
              <MedicalScreen medications={medications} onTakeMed={takeMedication} onAddMed={addMedication} />
            </motion.div>
          )}
          {activeTab === 'contacts' && (
            <motion.div key="contacts" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="h-full">
              <ContactsScreen contacts={contacts} onAdd={addContact} onDelete={deleteContact} />
            </motion.div>
          )}
          {activeTab === 'map' && (
            <motion.div key="map" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="h-full">
              <MapScreen />
            </motion.div>
          )}
          {activeTab === 'help' && (
            <motion.div key="help" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="h-full">
              <HelpScreen onOpenAI={() => setShowAIAssistant(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence>
        {showAIAssistant && <AIAssistantModal onClose={() => setShowAIAssistant(false)} />}
      </AnimatePresence>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="h-screen w-screen bg-sos-dark flex flex-col items-center justify-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative">
        <div className="w-32 h-32 bg-sos-red rounded-full flex items-center justify-center sos-pulse">
          <Shield size={64} className="text-white" />
        </div>
      </motion.div>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-4xl font-bold tracking-widest text-white">GUARDIAN</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1 }} className="mt-2 text-sos-grey uppercase tracking-widest text-xs">Safety & Medical Emergency Tool</motion.p>
    </div>
  );
}

function AIAssistantModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! I'm your Guardian AI Assistant. How can I help you stay safe today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are an emergency safety assistant for an app called GUARDIAN. Provide concise, practical safety advice. If the user is in immediate danger, tell them to press the SOS button or call emergency services immediately. Keep responses under 100 words."
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to service. Please stay safe." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-sos-dark">
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="text-sos-grey"><ArrowLeft size={24} /></button>
          <div>
            <h3 className="font-bold">Safety Assistant</h3>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-sos-green rounded-full" />
              <span className="text-[10px] text-sos-grey uppercase font-bold">Online</span>
            </div>
          </div>
        </div>
        <div className="w-10 h-10 bg-sos-yellow/10 rounded-full flex items-center justify-center text-sos-yellow">
          <MessageSquare size={20} />
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-sos-red text-white rounded-tr-none' : 'glass text-white/90 rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="glass p-4 rounded-2xl animate-pulse"><Loader2 className="animate-spin text-sos-yellow" /></div></div>}
      </div>
      <div className="p-6 border-t border-white/10">
        <div className="relative">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask for safety advice..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:border-sos-yellow transition-colors" />
          <button onClick={handleSend} disabled={!input.trim() || loading} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sos-yellow text-sos-dark rounded-xl flex items-center justify-center disabled:opacity-50"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
