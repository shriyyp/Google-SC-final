import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Search, MessageSquare, Plus, Check, Camera, Upload, Send, Loader2, AlertCircle } from 'lucide-react';
import { Medication, MedicalSubTab } from '../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface MedicalScreenProps {
  medications: Medication[];
  onTakeMed: (id: string) => void;
  onAddMed: (med: Omit<Medication, 'id' | 'taken'>) => void;
}

export const MedicalScreen: React.FC<MedicalScreenProps> = ({ medications, onTakeMed, onAddMed }) => {
  const [subTab, setSubTab] = useState<MedicalSubTab>('meds');

  return (
    <div className="flex flex-col h-full space-y-6 pt-4">
      {/* Sub-tab Navigation */}
      <div className="flex bg-sos-card p-1 rounded-2xl mx-4">
        <button
          onClick={() => setSubTab('meds')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            subTab === 'meds' ? 'bg-sos-green text-sos-dark' : 'text-sos-grey'
          }`}
        >
          <Pill size={16} />
          <span>MY MEDS</span>
        </button>
        <button
          onClick={() => setSubTab('scanner')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            subTab === 'scanner' ? 'bg-sos-green text-sos-dark' : 'text-sos-grey'
          }`}
        >
          <Search size={16} />
          <span>SCANNER</span>
        </button>
        <button
          onClick={() => setSubTab('ai')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            subTab === 'ai' ? 'bg-sos-green text-sos-dark' : 'text-sos-grey'
          }`}
        >
          <MessageSquare size={16} />
          <span>AI DOCTOR</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {subTab === 'meds' && <MedicationsList key="meds" meds={medications} onTake={onTakeMed} />}
          {subTab === 'scanner' && <PillScanner key="scanner" onAdd={onAddMed} />}
          {subTab === 'ai' && <AIDoctor key="ai" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MedicationsList: React.FC<{ meds: Medication[]; onTake: (id: string) => void }> = ({ meds, onTake }) => {
  const takenCount = meds.filter(m => m.taken).length;
  const percentage = meds.length > 0 ? Math.round((takenCount / meds.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Adherence Score */}
      <div className="glass p-6 rounded-[32px] flex items-center justify-between border-l-4 border-sos-green">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Daily Adherence</h3>
          <p className="text-sm text-sos-grey">You've taken {takenCount} of {meds.length} today</p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle 
              cx="32" cy="32" r="28" fill="transparent" stroke="#10B981" strokeWidth="6" 
              strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * percentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-xs font-bold">{percentage}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {meds.length === 0 ? (
          <div className="text-center py-10 text-sos-grey italic">No medications added yet.</div>
        ) : (
          meds.map(med => (
            <div 
              key={med.id} 
              className={`glass p-4 rounded-2xl border-l-4 transition-all ${
                med.taken ? 'border-sos-green' : med.missed ? 'border-sos-danger' : 'border-sos-yellow'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{med.name}</h4>
                  <div className="flex space-x-3 text-xs mt-1">
                    <span className="text-sos-grey">{med.dosage}</span>
                    <span className="text-sos-yellow font-medium">{med.time}</span>
                  </div>
                </div>
                <button
                  disabled={med.taken}
                  onClick={() => onTake(med.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    med.taken 
                      ? 'bg-sos-green/20 text-sos-green' 
                      : 'bg-sos-green text-sos-dark active:scale-95'
                  }`}
                >
                  {med.taken ? '✓ TAKEN' : 'TAKE'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Voice Check-in */}
      <button className="w-full bg-sos-green/10 border border-sos-green/30 p-4 rounded-2xl flex items-center justify-center space-x-3 text-sos-green font-bold active:scale-95 transition-all">
        <div className="w-10 h-10 bg-sos-green rounded-full flex items-center justify-center text-sos-dark medical-glow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <span>VOICE CHECK-IN</span>
      </button>
    </motion.div>
  );
};

const PillScanner: React.FC<{ onAdd: (med: Omit<Medication, 'id' | 'taken'>) => void }> = ({ onAdd }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    setScanning(true);
    // Simulate scan
    setTimeout(() => {
      setResult({
        name: 'Metformin',
        generic: 'Metformin Hydrochloride',
        dosage: '500mg',
        time: '8:00 AM',
        uses: 'Used for type 2 diabetes management.',
        warnings: 'Take with food to reduce stomach upset.'
      });
      setScanning(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {!result ? (
        <div className="glass p-8 rounded-[32px] flex flex-col items-center space-y-6 text-center">
          <div className="w-24 h-24 bg-sos-green/10 rounded-full flex items-center justify-center text-sos-green">
            <Camera size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Identify Your Pill</h3>
            <p className="text-sm text-sos-grey">Take a photo or upload an image of your medication to get instant details.</p>
          </div>
          <div className="w-full space-y-3">
            <button 
              onClick={handleScan}
              disabled={scanning}
              className="w-full bg-sos-green text-sos-dark py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {scanning ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
              <span>{scanning ? 'SCANNING...' : 'SCAN PILL'}</span>
            </button>
            <button className="w-full bg-sos-card border border-sos-yellow/30 text-sos-yellow py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all">
              <Upload size={20} />
              <span>UPLOAD PHOTO</span>
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <div className="glass p-6 rounded-[32px] border-2 border-sos-green space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{result.name}</h3>
                <p className="text-sm text-sos-grey">{result.generic}</p>
              </div>
              <div className="bg-sos-green/20 text-sos-green px-3 py-1 rounded-lg text-xs font-bold">
                {result.dosage}
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-sos-grey tracking-wider">Uses</p>
                <p className="text-sm">{result.uses}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-sos-yellow tracking-wider">Dosage Strength</p>
                <p className="text-sm">{result.dosage}</p>
              </div>
              <div className="bg-sos-danger/10 p-3 rounded-xl border border-sos-danger/20">
                <p className="text-[10px] uppercase font-bold text-sos-danger tracking-wider">Warnings</p>
                <p className="text-xs">{result.warnings}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                onAdd({ name: result.name, dosage: result.dosage, time: result.time });
                setResult(null);
              }}
              className="w-full bg-sos-green text-sos-dark py-4 rounded-2xl font-bold active:scale-95 transition-all"
            >
              ADD TO MY MEDICATIONS
            </button>
            <button onClick={() => setResult(null)} className="w-full text-sos-grey text-xs font-bold">SCAN ANOTHER</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const AIDoctor: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, emergency?: boolean }[]>([
    { role: 'ai', text: "Hello, I'm your Guardian AI Doctor. Please describe your symptoms. (Note: I am an AI, not a replacement for professional medical advice.)" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const emergencyKeywords = ['chest pain', 'bleeding', 'difficulty breathing', 'seizure', 'stroke', 'unconscious'];
    const isEmergency = emergencyKeywords.some(k => userMsg.toLowerCase().includes(k));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are a medical assistant AI. Provide helpful, concise medical advice. ALWAYS include a disclaimer that you are an AI. If the user mentions severe symptoms (chest pain, heavy bleeding, difficulty breathing, etc.), explicitly tell them to call emergency services (102) immediately. Keep responses under 80 words."
        }
      });
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: response.text || "I'm sorry, I couldn't process that.",
        emergency: isEmergency
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to service. If this is an emergency, call 102." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-[60vh] space-y-4"
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' ? 'bg-sos-card text-white rounded-tr-none' : 
              msg.emergency ? 'bg-sos-danger text-white rounded-tl-none border-2 border-white animate-pulse' :
              'bg-sos-green/10 text-white/90 border border-sos-green/20 rounded-tl-none'
            }`}>
              {msg.emergency && <div className="flex items-center space-x-2 mb-2 font-bold"><AlertCircle size={18} /><span>EMERGENCY DETECTED</span></div>}
              <p className="text-sm leading-relaxed">{msg.text}</p>
              {msg.emergency && (
                <a href="tel:102" className="mt-4 block w-full bg-white text-sos-danger py-2 rounded-xl text-center font-bold">CALL 102 NOW</a>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-sos-green/10 p-4 rounded-2xl animate-pulse"><Loader2 className="animate-spin text-sos-green" /></div></div>}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {['Chest pain?', 'Fever?', 'Side effects?'].map(q => (
          <button key={q} onClick={() => handleSend(q)} className="text-[10px] font-bold bg-sos-card border border-white/10 px-3 py-1.5 rounded-full text-sos-grey hover:text-white transition-colors">{q}</button>
        ))}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Describe symptoms..."
          className="w-full bg-sos-card border border-white/10 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:border-sos-green transition-all"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sos-green text-sos-dark rounded-xl flex items-center justify-center disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};
