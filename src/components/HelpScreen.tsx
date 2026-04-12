import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Shield, ChevronDown, ChevronUp, MessageSquare, AlertTriangle, Activity, Droplets } from 'lucide-react';
import { EmergencyNumber } from '../types';

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { name: 'POLICE', number: '100', description: 'Immediate police assistance', color: 'red' },
  { name: 'FIRE', number: '101', description: 'Fire emergency services', color: 'red' },
  { name: 'AMBULANCE', number: '102', description: 'Medical emergency services', color: 'red' },
  { name: 'WOMEN HELPLINE', number: '1091', description: 'Women safety and assistance', color: 'red' },
  { name: 'CHILD HELPLINE', number: '1098', description: 'Child protection services', color: 'red' },
  { name: 'MEDICAL EMERGENCY', number: '108', description: 'Emergency medical response', color: 'green' },
];

const SAFETY_TIPS = [
  "Stay calm and try to find a safe location.",
  "Keep your phone's location services enabled.",
  "Inform contacts about your travel plans.",
  "Avoid isolated areas during late hours.",
  "Trust your instincts—if it feels wrong, it is."
];

export const HelpScreen: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const firstAid = [
    { id: 'cpr', title: 'CPR Instructions', icon: <Activity className="text-sos-red" />, color: 'border-sos-red', content: "1. Push hard and fast in the center of the chest. 2. 100-120 compressions per minute. 3. Allow chest to recoil completely." },
    { id: 'choking', title: 'Choking First Aid', icon: <AlertTriangle className="text-sos-yellow" />, color: 'border-sos-yellow', content: "1. Give 5 back blows. 2. Give 5 abdominal thrusts (Heimlich maneuver). 3. Repeat until object is forced out." },
    { id: 'bleeding', title: 'Bleeding Control', icon: <Droplets className="text-sos-green" />, color: 'border-sos-green', content: "1. Apply direct pressure with a clean cloth. 2. Maintain pressure until bleeding stops. 3. If severe, apply a tourniquet above the wound." },
  ];

  return (
    <div className="flex flex-col h-full space-y-8 pt-4 px-4 pb-24 overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Emergency Help</h2>
        <div className="grid grid-cols-1 gap-3">
          {EMERGENCY_NUMBERS.map(item => (
            <a 
              key={item.number}
              href={`tel:${item.number}`}
              className={`glass p-4 rounded-2xl border-l-4 flex items-center justify-between group active:scale-95 transition-all ${
                item.color === 'red' ? 'border-sos-red' : 'border-sos-green'
              }`}
            >
              <div>
                <p className={`text-[10px] font-bold tracking-wider uppercase ${
                  item.color === 'red' ? 'text-sos-red' : 'text-sos-green'
                }`}>{item.name}</p>
                <p className="text-xl font-bold">{item.number}</p>
                <p className="text-[10px] text-sos-grey">{item.description}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                item.color === 'red' ? 'bg-sos-red/10 text-sos-red group-hover:bg-sos-red group-hover:text-white' : 'bg-sos-green/10 text-sos-green group-hover:bg-sos-green group-hover:text-white'
              }`}>
                <Phone size={20} />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center space-x-2">
          <Shield size={20} className="text-sos-yellow" />
          <span>Safety Tips</span>
        </h3>
        <div className="glass p-5 rounded-[32px] space-y-3 border border-sos-yellow/20">
          {SAFETY_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-sos-yellow rounded-full mt-2 shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">First Aid Guide</h3>
        <div className="space-y-3">
          {firstAid.map(item => (
            <div key={item.id} className={`glass rounded-2xl overflow-hidden border-l-4 ${item.color}`}>
              <button 
                onClick={() => setExpandedSection(expandedSection === item.id ? null : item.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-bold text-sm">{item.title}</span>
                </div>
                {expandedSection === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence>
                {expandedSection === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-xs text-sos-grey leading-relaxed pt-2 border-t border-white/5">
                      {item.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onOpenAI}
        className="w-full bg-sos-yellow text-sos-dark py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-sos-yellow/20 active:scale-[0.98] transition-all"
      >
        <MessageSquare size={20} />
        <span>🤖 ASK AI ASSISTANT</span>
      </button>
    </div>
  );
};
