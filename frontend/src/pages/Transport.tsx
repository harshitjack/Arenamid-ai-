import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Bus, Train, Car, Navigation, Users, Clock, Info, 
  HelpCircle, ArrowUpRight, TrendingUp, AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

export const Transport: React.FC = () => {
  // Chart datasets
  const congestionData = [
    { name: '15 Min Ago', Metro: 78, Bus: 42, Taxi: 65 },
    { name: 'Kick-off', Metro: 92, Bus: 58, Taxi: 80 },
    { name: 'Half Time', Metro: 35, Bus: 20, Taxi: 45 },
    { name: 'Min 75', Metro: 60, Bus: 35, Taxi: 50 },
    { name: 'Full Time', Metro: 98, Bus: 88, Taxi: 92 },
    { name: '+30 Mins', Metro: 85, Bus: 60, Taxi: 70 },
  ];

  const waitTimes = [
    { name: 'Metro (Green Line)', Time: 4, fill: '#00F2FE' },
    { name: 'Metro (Blue Line)', Time: 8, fill: '#4FACFE' },
    { name: 'Bus Shuttle 2', Time: 12, fill: '#00FF87' },
    { name: 'Taxi / Rideshare', Time: 22, fill: '#FF9F43' },
    { name: 'Parking Lot A egress', Time: 18, fill: '#7F00FF' },
  ];

  const recommendations = [
    { 
      type: 'Metro', 
      title: 'Metro Line 1 (Green)', 
      desc: 'High frequency active (every 3 mins). Best Exit Gate is Gate C (East Corridor walk - 5 mins). No delays reported.',
      status: 'Fastest', 
      color: 'text-neonBlue', 
      bg: 'bg-neonBlue/10',
      icon: Train
    },
    { 
      type: 'Bus', 
      title: 'Stadium Bus Shuttle 2', 
      desc: 'Moderate congestion (12 mins wait). Runs to downtown center hubs. Exit via Gate B North Corridor.',
      status: 'Steady', 
      color: 'text-emeraldGreen', 
      bg: 'bg-emeraldGreen/10',
      icon: Bus
    },
    { 
      type: 'Taxi', 
      title: 'Rideshare Zone B (Uber/Lyft)', 
      desc: 'Heavy traffic delays (approx 22 mins wait time). Exit via Gate D West to reach Taxi pickup loop.',
      status: 'Delayed', 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/10',
      icon: Car
    }
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Bus className="w-8 h-8 text-neonBlue" />
          <span>Transit Routing & Traffic Center</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Monitor stadium transit lanes. Our AI models predict metro occupancy surges, parking lot exit bottlenecks, and direct you to the fastest egress route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: TELEMETRY STATS & RECOMMENDATIONS */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard glowColor="blue">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neonBlue" />
              <span>AI Egress Recommendations</span>
            </h3>

            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl text-xs">
                  <div className={`w-10 h-10 rounded-xl ${rec.bg} flex items-center justify-center ${rec.color} shrink-0`}>
                    <rec.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        rec.status === 'Fastest' ? 'bg-emeraldGreen/10 border-emeraldGreen/20 text-emeraldGreen' :
                        rec.status === 'Steady' ? 'bg-neonBlue/10 border-neonBlue/20 text-neonBlue' :
                        'bg-amber-400/10 border-amber-400/20 text-amber-400'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-[11px]">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* QUICK EXIT WARNING */}
          <GlassCard className="py-4">
            <div className="flex gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <h5 className="font-bold text-white">Full-Time Egress Advisory</h5>
                <p className="leading-relaxed mt-1 text-gray-400 text-[11px]">
                  Vanguard transit studies expect a 40% passenger density increase near the Metro Station immediately following the final whistle. Leaving 10 minutes early or utilizing the Bus Shuttle Zone near Gate B is recommended to bypass queues.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: RECHARTS TRAFFIC PLOTS */}
        <div className="lg:col-span-6 space-y-6">
          {/* AREA CHART - DENSITY OVER TIME */}
          <GlassCard glowColor="green">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Predicted Passenger Congestion Index (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={congestionData}>
                  <defs>
                    <linearGradient id="colorMetro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00F2FE" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF87" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00FF87" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <Area type="monotone" dataKey="Metro" stroke="#00F2FE" fillOpacity={1} fill="url(#colorMetro)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Bus" stroke="#00FF87" fillOpacity={1} fill="url(#colorBus)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* BAR CHART - WAIT TIMES */}
          <GlassCard>
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Current Average Transit Wait Times (Mins)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waitTimes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <Bar dataKey="Time" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default Transport;
