import React from 'react';
import { Tab } from '../types';
import { Shield, Pill, Users, Map as MapIcon, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab; icon: any; label: string; color: string }[] = [
    { id: 'sos', icon: Shield, label: 'SOS', color: 'text-sos-red' },
    { id: 'medical', icon: Pill, label: 'Medical', color: 'text-sos-green' },
    { id: 'contacts', icon: Users, label: 'Contacts', color: 'text-sos-yellow' },
    { id: 'map', icon: MapIcon, label: 'Map', color: 'text-sos-blue' },
    { id: 'help', icon: Info, label: 'Help', color: 'text-white' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-sos-card border-t-2 border-sos-red px-4 py-3 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 flex-1 ${
              isActive ? tab.color : 'text-sos-grey'
            }`}
          >
            <div className="relative">
              <Icon size={24} />
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sos-yellow rounded-full"
                />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
