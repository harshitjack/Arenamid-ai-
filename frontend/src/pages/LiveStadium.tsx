import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Eye, Users, Clock, Utensils, ShieldAlert, Navigation, Info, 
  MapPin, CheckCircle, HelpCircle, Activity
} from 'lucide-react';

interface SectorInfo {
  id: string;
  name: string;
  occupancy: number;
  avgWaitRestroom: number;
  avgWaitFood: number;
  foodStalls: string[];
  restrooms: string[];
  medicalRooms: string[];
  emergencyExits: string[];
  walkingTimeToGate: number;
}

export const LiveStadium: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorInfo | null>({
    id: 'sec-104',
    name: 'Section 104 (East Stand Tier 1)',
    occupancy: 82,
    avgWaitRestroom: 6,
    avgWaitFood: 11,
    foodStalls: ['Copa Grill (2m walk)', 'Stadium Dogs (1m walk)'],
    restrooms: ['Restroom Block E1 (Opposite Section 104)'],
    medicalRooms: ['First Aid Post 2 (Gate B Outer Concourse)'],
    emergencyExits: ['Gate B Escalator East', 'South Concourse Exit'],
    walkingTimeToGate: 3
  });

  const sectors: SectorInfo[] = [
    {
      id: 'sec-101',
      name: 'Section 101 (North Stand General)',
      occupancy: 38,
      avgWaitRestroom: 2,
      avgWaitFood: 4,
      foodStalls: ['Green Field Bistro (1m walk)'],
      restrooms: ['Restroom Block N1'],
      medicalRooms: ['Medical Hub 1 (Gate A)'],
      emergencyExits: ['Gate A Exit'],
      walkingTimeToGate: 2
    },
    {
      id: 'sec-104',
      name: 'Section 104 (East Stand Tier 1)',
      occupancy: 82,
      avgWaitRestroom: 6,
      avgWaitFood: 11,
      foodStalls: ['Copa Grill (2m walk)', 'Stadium Dogs (1m walk)'],
      restrooms: ['Restroom Block E1 (Opposite Section 104)'],
      medicalRooms: ['First Aid Post 2 (Gate B Outer Concourse)'],
      emergencyExits: ['Gate B Escalator East', 'South Concourse Exit'],
      walkingTimeToGate: 3
    },
    {
      id: 'sec-108',
      name: 'Section 108 (South Stand Ultras)',
      occupancy: 94,
      avgWaitRestroom: 12,
      avgWaitFood: 18,
      foodStalls: ['Stadium Dogs (2m walk)', 'Kicker Coffee (1m walk)'],
      restrooms: ['Restroom Block S2'],
      medicalRooms: ['First Aid Post 3 (Gate C)'],
      emergencyExits: ['Gate C Tunnel'],
      walkingTimeToGate: 6
    },
    {
      id: 'sec-112',
      name: 'Section 112 (West Stand Tier 2)',
      occupancy: 64,
      avgWaitRestroom: 5,
      avgWaitFood: 8,
      foodStalls: ['Fit Athlete Salads (1m walk)'],
      restrooms: ['Restroom Block W1'],
      medicalRooms: ['First Aid Post 4 (Gate D)'],
      emergencyExits: ['Gate D Elevators'],
      walkingTimeToGate: 4
    },
    {
      id: 'sec-vip',
      name: 'VIP Skybox Lounge (Tier 3 Center)',
      occupancy: 45,
      avgWaitRestroom: 1,
      avgWaitFood: 2,
      foodStalls: ['VIP Caviar Bar (In-Suite)', 'Copa Premium Lounge'],
      restrooms: ['Private VIP Restroom (Zone 1)'],
      medicalRooms: ['Private Care Unit (Elevator 3)'],
      emergencyExits: ['VIP Dedicated Exit Elevators'],
      walkingTimeToGate: 1
    }
  ];

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 40) return 'fill-emeraldGreen/30 stroke-emeraldGreen hover:fill-emeraldGreen/50';
    if (occupancy < 65) return 'fill-amber-400/30 stroke-amber-400 hover:fill-amber-400/50';
    if (occupancy < 85) return 'fill-orange-500/30 stroke-orange-500 hover:fill-orange-500/50';
    return 'fill-red-500/30 stroke-red-500 hover:fill-red-500/50';
  };

  const getOccupancyBadgeColor = (occupancy: number) => {
    if (occupancy < 40) return 'bg-emeraldGreen/10 text-emeraldGreen border-emeraldGreen/20';
    if (occupancy < 65) return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
    if (occupancy < 85) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="space-y-8">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Eye className="w-8 h-8 text-neonBlue" />
            <span>Stadium Digital Twin</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time telemetric mapping of seating tiers, congestion heatmaps, and facility accessibility.</p>
        </div>

        {/* COLOR KEY */}
        <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-xs">
          <span className="font-semibold text-gray-400">Occupancy Levels:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emeraldGreen/30 border border-emeraldGreen"></span>
            <span>&lt;40% (Low)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400/30 border border-amber-400"></span>
            <span>40-65% (Mid)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500"></span>
            <span>65-85% (High)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500"></span>
            <span>&gt;85% (Critical)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INTERACTIVE SVG MAP */}
        <div className="lg:col-span-7">
          <GlassCard className="relative overflow-hidden flex flex-col items-center justify-center p-8 bg-[#0D0D13]/20 border-white/5 min-h-[480px]">
            {/* Hologram Overlay grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none"></div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-neonBlue animate-pulse" />
              <span>Interactive Telemetry Pitch Matrix</span>
            </h3>

            {/* STADIUM INTERACTIVE SVG MAP */}
            <svg viewBox="0 0 500 500" className="w-full max-w-[420px] filter drop-shadow-[0_0_20px_rgba(0,242,254,0.15)]">
              {/* Pitch Field */}
              <rect x="180" y="190" width="140" height="120" rx="6" className="fill-emeraldGreen/10 stroke-emeraldGreen/30 stroke-2" />
              <line x1="250" y1="190" x2="250" y2="310" className="stroke-emeraldGreen/25 stroke-2" />
              <circle cx="250" cy="250" r="24" className="fill-none stroke-emeraldGreen/25 stroke-2" />

              {/* NORTH STANDS (Section 101) */}
              <path 
                d="M 120 120 Q 250 80 380 120 L 350 160 Q 250 130 150 160 Z" 
                onClick={() => setSelectedSector(sectors[0])}
                className={`cursor-pointer transition-all duration-300 stroke-2 ${getOccupancyColor(sectors[0].occupancy)}`}
              />
              <text x="250" y="112" textAnchor="middle" className="fill-gray-300 text-[10px] font-bold pointer-events-none">SEC 101</text>

              {/* SOUTH STANDS (Section 108) */}
              <path 
                d="M 120 380 Q 250 420 380 380 L 350 340 Q 250 370 150 340 Z" 
                onClick={() => setSelectedSector(sectors[2])}
                className={`cursor-pointer transition-all duration-300 stroke-2 ${getOccupancyColor(sectors[2].occupancy)}`}
              />
              <text x="250" y="394" textAnchor="middle" className="fill-gray-300 text-[10px] font-bold pointer-events-none">SEC 108</text>

              {/* EAST STANDS (Section 104) */}
              <path 
                d="M 380 120 Q 420 250 380 380 L 340 350 Q 370 250 340 150 Z" 
                onClick={() => setSelectedSector(sectors[1])}
                className={`cursor-pointer transition-all duration-300 stroke-2 ${getOccupancyColor(sectors[1].occupancy)}`}
              />
              <text x="382" y="254" textAnchor="middle" className="fill-gray-300 text-[10px] font-bold pointer-events-none transform rotate-90 origin-[382px_254px]">SEC 104</text>

              {/* WEST STANDS (Section 112) */}
              <path 
                d="M 120 120 Q 80 250 120 380 L 160 350 Q 130 250 160 150 Z" 
                onClick={() => setSelectedSector(sectors[3])}
                className={`cursor-pointer transition-all duration-300 stroke-2 ${getOccupancyColor(sectors[3].occupancy)}`}
              />
              <text x="116" y="254" textAnchor="middle" className="fill-gray-300 text-[10px] font-bold pointer-events-none transform -rotate-90 origin-[116px_254px]">SEC 112</text>

              {/* VIP BOXES (Inner Ring) */}
              <rect 
                x="158" y="168" width="184" height="164" rx="42" 
                onClick={() => setSelectedSector(sectors[4])}
                className={`cursor-pointer fill-none stroke-2 transition-all duration-300 ${getOccupancyColor(sectors[4].occupancy)}`} 
              />
              <text x="250" y="184" textAnchor="middle" className="fill-gray-300 text-[10px] font-bold pointer-events-none">VIP SKYBOX</text>
            </svg>

            <p className="text-[10px] text-gray-500 mt-6 text-center italic">
              Note: Click on any colored sector segment inside the stadium ring to load real-time telemetry datasets.
            </p>
          </GlassCard>
        </div>

        {/* DETAIL PANEL */}
        <div className="lg:col-span-5">
          {selectedSector ? (
            <GlassCard glowColor="blue" className="space-y-6">
              {/* HEADER INFORMATION */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedSector.name}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-neonBlue" />
                    <span className="text-xs text-gray-400">Grid Sect: {selectedSector.id}</span>
                  </div>
                </div>

                <div className={`border rounded-lg px-2.5 py-1 text-center ${getOccupancyBadgeColor(selectedSector.occupancy)}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Density</p>
                  <p className="text-base font-extrabold font-mono mt-0.5">{selectedSector.occupancy}%</p>
                </div>
              </div>

              {/* AMENITIES WAIT TIMES */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="w-4 h-4 text-neonBlue" />
                    <span>Toilets Queue</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-white mt-1 font-mono">{selectedSector.avgWaitRestroom} min</h4>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Average delay</p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Utensils className="w-4 h-4 text-emeraldGreen" />
                    <span>Food Stall Queue</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-white mt-1 font-mono">{selectedSector.avgWaitFood} min</h4>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Average delay</p>
                </div>
              </div>

              {/* FACILITY ARRAYS LIST */}
              <div className="space-y-4 text-xs">
                {/* FOOD STALLS */}
                <div className="space-y-1.5">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Nearby Food Venues</p>
                  {selectedSector.foodStalls.map((stall, i) => (
                    <div key={i} className="flex items-center gap-2 text-white bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neonBlue"></span>
                      <span>{stall}</span>
                    </div>
                  ))}
                </div>

                {/* RESTROOMS */}
                <div className="space-y-1.5">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Restrooms Available</p>
                  {selectedSector.restrooms.map((toilet, i) => (
                    <div key={i} className="flex items-center gap-2 text-white bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emeraldGreen"></span>
                      <span>{toilet}</span>
                    </div>
                  ))}
                </div>

                {/* MEDICAL */}
                <div className="space-y-1.5">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">First Aid Centers</p>
                  {selectedSector.medicalRooms.map((med, i) => (
                    <div key={i} className="flex items-center gap-2 text-white bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      <span>{med}</span>
                    </div>
                  ))}
                </div>

                {/* SAFETY EXITS */}
                <div className="space-y-1.5">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Emergency Exits</p>
                  {selectedSector.emergencyExits.map((exit, i) => (
                    <div key={i} className="flex items-center gap-2 text-white bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span>{exit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TRANSIT SPEED INFORMATION */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neonBlue animate-pulse" />
                  <span className="text-gray-400">Transit Walking Time to Gate:</span>
                </div>
                <span className="font-bold text-white font-mono bg-white/5 px-2.5 py-1 rounded">{selectedSector.walkingTimeToGate} minutes</span>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
              <Info className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-sm text-gray-400 font-bold">No Seating Section Selected</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">Click on any section colored block in the digital twin map to view details.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
export default LiveStadium;
