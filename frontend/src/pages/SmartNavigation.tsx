import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Map, Navigation, Compass, Activity, Volume2, 
  HelpCircle, ChevronRight, Check, Accessibility, Shield, Users
} from 'lucide-react';

interface RouteStats {
  walkingTime: number;
  crowdFactor: 'Low' | 'Medium' | 'High';
  alternateTime: number;
  escalatorsCount: number;
  elevatorsAvailable: boolean;
}

export const SmartNavigation: React.FC = () => {
  const [start, setStart] = useState('gate-b');
  const [destination, setDestination] = useState('section-104');
  const [routeType, setRouteType] = useState<'fastest' | 'accessible' | 'safe' | 'vip'>('fastest');
  
  const [voicePlaying, setVoicePlaying] = useState(false);

  // Simple coordinate map of points for SVG pathing
  const nodes: Record<string, { x: number; y: number; label: string }> = {
    'gate-a': { x: 250, y: 70, label: 'Gate A (North Entrance)' },
    'gate-b': { x: 430, y: 250, label: 'Gate B (East Entrance)' },
    'gate-c': { x: 250, y: 430, label: 'Gate C (South Entrance)' },
    'gate-d': { x: 70, y: 250, label: 'Gate D (West Entrance)' },
    'section-101': { x: 250, y: 150, label: 'Section 101' },
    'section-104': { x: 350, y: 250, label: 'Section 104' },
    'section-108': { x: 250, y: 350, label: 'Section 108' },
    'section-112': { x: 150, y: 250, label: 'Section 112' },
  };

  const getStats = (): RouteStats => {
    switch (routeType) {
      case 'accessible':
        return { walkingTime: 5, crowdFactor: 'Low', alternateTime: 7, escalatorsCount: 0, elevatorsAvailable: true };
      case 'safe':
        return { walkingTime: 4, crowdFactor: 'Low', alternateTime: 6, escalatorsCount: 1, elevatorsAvailable: false };
      case 'vip':
        return { walkingTime: 2, crowdFactor: 'Low', alternateTime: 4, escalatorsCount: 2, elevatorsAvailable: true };
      case 'fastest':
      default:
        return { walkingTime: 3, crowdFactor: 'Medium', alternateTime: 5, escalatorsCount: 2, elevatorsAvailable: true };
    }
  };

  const getPathD = () => {
    const startNode = nodes[start] || nodes['gate-b'];
    const destNode = nodes[destination] || nodes['section-104'];

    if (routeType === 'accessible') {
      // Step-free routing (curved layout to avoid stairs)
      return `M ${startNode.x} ${startNode.y} Q 250 250 ${destNode.x} ${destNode.y}`;
    }

    if (routeType === 'safe') {
      // Safer path (avoiding high-congestion corridors)
      return `M ${startNode.x} ${startNode.y} C 200 200, 300 300, ${destNode.x} ${destNode.y}`;
    }

    // Default or fastest path (direct line)
    return `M ${startNode.x} ${startNode.y} L ${destNode.x} ${destNode.y}`;
  };

  const handleVoiceTrigger = () => {
    setVoicePlaying(true);
    const text = `ArenaMind Navigation instructions active. From ${nodes[start]?.label || 'Start'}, proceed straight for 50 meters, take the Elevator on your right to Tier 1, then proceed to Section ${destination.split('-')[1]}.`;
    
    // Web Speech API fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoicePlaying(false), 4000);
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Navigation className="w-8 h-8 text-neonBlue animate-pulse" />
          <span>Smart Stadium Pathfinder</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Select entry gates and seating destinations. Our AI routing engine calculates traffic densities, wheelchair routes, and crowd congestion live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONTROLLER FORM */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard glowColor="blue">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
              <Compass className="w-5 h-5 text-neonBlue" />
              <span>Route Parameters</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* START SELECT */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Start Location</label>
                <select
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full bg-[#0D0D13] border border-white/10 rounded-xl py-2.5 px-3.5 text-white"
                >
                  <option value="gate-a">Gate A (North Entrance)</option>
                  <option value="gate-b">Gate B (East Entrance)</option>
                  <option value="gate-c">Gate C (South Entrance)</option>
                  <option value="gate-d">Gate D (West Entrance)</option>
                </select>
              </div>

              {/* DESTINATION SELECT */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#0D0D13] border border-white/10 rounded-xl py-2.5 px-3.5 text-white"
                >
                  <option value="section-101">Section 101 (North Stand)</option>
                  <option value="section-104">Section 104 (East Stand)</option>
                  <option value="section-108">Section 108 (South Stand)</option>
                  <option value="section-112">Section 112 (West Stand)</option>
                </select>
              </div>

              {/* FILTER BUTTONS */}
              <div className="space-y-2 pt-2">
                <label className="block text-gray-400 font-bold uppercase tracking-wider">Routing Filters</label>
                
                <button
                  onClick={() => setRouteType('fastest')}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl border text-left font-medium ${routeType === 'fastest' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
                >
                  <span>Fastest Route</span>
                  {routeType === 'fastest' && <Check className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setRouteType('accessible')}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl border text-left font-medium ${routeType === 'accessible' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4" />
                    <span>Wheelchair Accessible</span>
                  </span>
                  {routeType === 'accessible' && <Check className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setRouteType('safe')}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl border text-left font-medium ${routeType === 'safe' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Safest / Least Crowded</span>
                  </span>
                  {routeType === 'safe' && <Check className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setRouteType('vip')}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl border text-left font-medium ${routeType === 'vip' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
                >
                  <span>VIP Lounge Route</span>
                  {routeType === 'vip' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </GlassCard>

          {/* TELEMETRY RESULTS */}
          <GlassCard>
            <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Path Telemetrics</h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Walking Time:</span>
                <span className="text-white font-mono font-bold">{stats.walkingTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Crowd Congestion:</span>
                <span className={`font-bold ${stats.crowdFactor === 'Low' ? 'text-emeraldGreen' : 'text-amber-400'}`}>{stats.crowdFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Alternative Path Time:</span>
                <span className="text-gray-500 font-mono">{stats.alternateTime} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Escalators En Route:</span>
                <span className="text-white font-mono">{stats.escalatorsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Step-free / Elevator Available:</span>
                <span className={`font-bold ${stats.elevatorsAvailable ? 'text-emeraldGreen' : 'text-gray-500'}`}>{stats.elevatorsAvailable ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: MAP CONTAINER */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#0D0D13]/20 min-h-[460px]">
            {/* grid grid design */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>

            {/* MAP LAYOUT */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* STADIUM SVG DIAGRAM */}
              <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,242,254,0.1)]">
                {/* Outer Ring */}
                <circle cx="250" cy="250" r="180" className="fill-none stroke-white/5 stroke-2" />
                {/* Middle Ring */}
                <circle cx="250" cy="250" r="140" className="fill-none stroke-white/5 stroke-2" />
                {/* Pitch Area */}
                <rect x="180" y="190" width="140" height="120" rx="6" className="fill-white/5 stroke-white/10 stroke-2" />

                {/* Draw Node Markers */}
                {Object.entries(nodes).map(([key, node]) => {
                  const isActive = start === key || destination === key;
                  return (
                    <g key={key}>
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isActive ? 8 : 4.5} 
                        className={`transition-all duration-300 ${isActive ? 'fill-neonBlue stroke-neonBlue/50 stroke-4 animate-pulse' : 'fill-white/20 hover:fill-neonBlue/60 cursor-pointer'}`} 
                      />
                      <text 
                        x={node.x} 
                        y={node.y - 12} 
                        textAnchor="middle" 
                        className={`text-[8px] font-bold pointer-events-none ${isActive ? 'fill-neonBlue' : 'fill-gray-500'}`}
                      >
                        {key.toUpperCase()}
                      </text>
                    </g>
                  );
                })}

                {/* ROUTE Animated PATH LINE */}
                <path
                  d={getPathD()}
                  fill="none"
                  className="stroke-neonBlue stroke-[3px] stroke-linecap-round animate-gradient-shift"
                  strokeDasharray="8 4"
                  style={{ animation: 'dash 30s linear infinite' }}
                />
              </svg>
            </div>

            {/* VOICE PLAY / PAUSE BUTTON */}
            <div className="absolute bottom-6 right-6">
              <button 
                onClick={handleVoiceTrigger}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl border text-xs font-bold transition-all shadow-md active:scale-95
                  ${voicePlaying 
                    ? 'bg-emeraldGreen/10 border-emeraldGreen text-emeraldGreen animate-pulse shadow-emeraldGreen/20' 
                    : 'bg-[#0D0D13]/90 border-white/10 text-white hover:border-neonBlue/40'}`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{voicePlaying ? 'Speaker Active...' : 'Play Voice Directions'}</span>
              </button>
            </div>
          </GlassCard>

          {/* ROAD LOG */}
          <GlassCard className="py-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Pathing Directions</h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neonBlue/10 text-neonBlue flex items-center justify-center font-bold text-[10px]">1</span>
                <p>Start path from <span className="font-bold text-white">{nodes[start]?.label || start}</span>.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neonBlue/10 text-neonBlue flex items-center justify-center font-bold text-[10px]">2</span>
                <p>Walk {routeType === 'accessible' ? 'along the escalator ramp corridor' : 'directly up the staircase'} to Level 1 Lobby.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neonBlue/10 text-neonBlue flex items-center justify-center font-bold text-[10px]">3</span>
                <p>Pass Section 103 restrooms (low queue wait time). Destination <span className="font-bold text-white">{nodes[destination]?.label || destination}</span> is straight ahead.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default SmartNavigation;
