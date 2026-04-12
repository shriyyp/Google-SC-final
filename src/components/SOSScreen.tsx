import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, MapPin } from 'lucide-react';

interface SOSScreenProps {
  onSOS: () => void;
  isGettingLocation: boolean;
  isSOSSent: boolean;
  setIsSOSSent: (val: boolean) => void;
  location: { lat: number; lng: number } | null;
}

export const SOSScreen: React.FC<SOSScreenProps> = ({ 
  onSOS, 
  isGettingLocation, 
  isSOSSent, 
  setIsSOSSent,
  location 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Emergency Alert</h2>
        <p className="text-sos-grey">Tap the button to send SOS</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSOS}
        disabled={isGettingLocation}
        className={`w-52 h-52 rounded-full flex flex-col items-center justify-center relative z-10 
          bg-gradient-to-br from-sos-red to-sos-dark-red sos-glow border-4 border-sos-yellow/20
          ${isGettingLocation ? 'opacity-50' : 'sos-pulse'}`}
      >
        {isGettingLocation ? (
          <Loader2 size={48} className="animate-spin text-white mb-2" />
        ) : (
          <span className="text-5xl font-bold text-white">SOS</span>
        )}
        <span className="text-xs font-medium text-white/80 mt-2 uppercase tracking-widest">
          {isGettingLocation ? 'Locating...' : 'Press in Danger'}
        </span>
      </motion.button>

      <div className="w-full space-y-4 px-4">
        <div className="glass p-5 rounded-2xl border-l-4 border-sos-yellow flex items-center space-x-4">
          <div className="w-10 h-10 bg-sos-yellow/10 rounded-full flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ${isSOSSent ? 'bg-sos-red' : 'bg-sos-yellow'} animate-pulse`} />
          </div>
          <div>
            <p className="text-sm font-semibold">Status: {isSOSSent ? 'Alert Sent' : 'Ready'}</p>
            <p className="text-xs text-sos-grey">System is armed and active</p>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-sos-green/10 rounded-full flex items-center justify-center">
              <MapPin size={20} className={location ? 'text-sos-green' : 'text-sos-yellow'} />
            </div>
            <div>
              <p className="text-sm font-semibold">GPS: {location ? 'Active' : 'Waiting'}</p>
              <p className="text-xs text-sos-grey">
                {location ? 'Location acquired' : 'Acquiring signal...'}
              </p>
            </div>
          </div>
          {location && <div className="w-2 h-2 bg-sos-green rounded-full animate-pulse" />}
        </div>
      </div>

      <AnimatePresence>
        {isSOSSent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-sos-dark/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-xs glass border-2 border-sos-red rounded-[32px] p-8 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 bg-sos-yellow rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-sos-dark" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">SOS SENT!</h3>
                <p className="text-sos-grey text-sm">Help is on the way. Your contacts have been notified.</p>
              </div>
              
              {location && (
                <div className="bg-white/5 rounded-xl p-3 w-full">
                  <p className="text-[10px] text-sos-grey uppercase font-bold mb-1 tracking-wider">Coordinates</p>
                  <p className="text-xs font-mono text-sos-blue">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              )}

              <button 
                onClick={() => setIsSOSSent(false)}
                className="w-full bg-sos-red text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform shadow-lg shadow-sos-red/20"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
