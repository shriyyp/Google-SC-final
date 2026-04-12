import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Hospital, Pill, Shield, AlertTriangle } from 'lucide-react';

export const MapScreen: React.FC = () => {
  const nearbyServices = [
    { name: 'City General Hospital', type: 'hospital', distance: '1.2 km', address: '123 Emergency Lane', color: 'text-sos-red' },
    { name: 'HealthFirst Pharmacy', type: 'pharmacy', distance: '0.5 km', address: '45 Wellness St', color: 'text-sos-green' },
    { name: 'Central Police Station', type: 'police', distance: '2.8 km', address: '88 Safety Blvd', color: 'text-sos-blue' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 pt-4 px-4 overflow-hidden">
      <h2 className="text-2xl font-bold">Nearby Emergency Services</h2>

      {/* Map Placeholder */}
      <div className="relative w-full h-64 bg-sos-card rounded-[32px] overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover bg-center opacity-40 grayscale" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 bg-sos-blue/20 rounded-full animate-ping absolute -inset-0" />
            <div className="w-12 h-12 bg-sos-blue rounded-full border-4 border-white flex items-center justify-center relative z-10">
              <MapPin size={24} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Map Pins */}
        <div className="absolute top-10 left-20 text-sos-red"><MapPin size={32} /></div>
        <div className="absolute bottom-20 right-20 text-sos-green"><MapPin size={32} /></div>
        <div className="absolute top-1/2 right-10 text-sos-blue"><MapPin size={32} /></div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-sos-yellow/90 backdrop-blur-md text-sos-dark px-4 py-2 rounded-xl flex items-center space-x-2 text-[10px] font-bold">
            <AlertTriangle size={14} />
            <span>OFFLINE MODE: MAP WORKS OFFLINE IF DOWNLOADED</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-24">
        {nearbyServices.map((service, i) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={service.name}
            className="glass p-4 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${service.color}`}>
                {service.type === 'hospital' ? <Hospital size={24} /> : 
                 service.type === 'pharmacy' ? <Pill size={24} /> : <Shield size={24} />}
              </div>
              <div>
                <p className="font-bold">{service.name}</p>
                <p className="text-[10px] text-sos-grey uppercase font-bold tracking-wider">{service.distance} • {service.address}</p>
              </div>
            </div>
            <button className="bg-sos-red text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 active:scale-95 transition-all">
              <Navigation size={14} />
              <span>DIRECTIONS</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
