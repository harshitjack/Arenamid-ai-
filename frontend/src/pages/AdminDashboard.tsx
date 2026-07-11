import React from 'react';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/GlassCard';
import { 
  LayoutDashboard, TrendingUp, Users, DollarSign, Leaf, 
  Flag, Volume2, Globe, ShieldAlert, Cpu, HeartHandshake
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  PieChart, Pie, Cell 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { liveData, activeAlerts } = useSocket();

  // Operational datasets
  const financialData = [
    { name: 'Jan', Tickets: 42000, Revenue: 2.1 },
    { name: 'Feb', Tickets: 51000, Revenue: 2.8 },
    { name: 'Mar', Tickets: 64000, Revenue: 3.5 },
    { name: 'Apr', Tickets: 78000, Revenue: 4.8 },
    { name: 'May', Tickets: 92000, Revenue: 5.9 },
    { name: 'Jun (Cup)', Tickets: 104000, Revenue: 7.2 },
  ];

  const transportShare = [
    { name: 'Metro Transit', value: 58, color: '#00F2FE' },
    { name: 'Bus Shuttle', value: 22, color: '#00FF87' },
    { name: 'Taxi / Rides', value: 12, color: '#FF9F43' },
    { name: 'Walking/Other', value: 8, color: '#7F00FF' },
  ];

  const languageDistribution = [
    { name: 'English', count: 64 },
    { name: 'Spanish', count: 22 },
    { name: 'French', count: 8 },
    { name: 'German', count: 6 },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-neonBlue" />
          <span>Central Operations Console</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          FIFA Stadium operations, financial telemetry, real-time logistics mapping, and active safety dispatching metrics.
        </p>
      </div>

      {/* CORE ADMIN NUMERICAL telemetry GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="py-4 border-l-4 border-l-neonBlue">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tickets Distributed</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">72,430</h3>
            </div>
            <Users className="w-5 h-5 text-neonBlue" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">94% general seating capacity</p>
        </GlassCard>

        <GlassCard className="py-4 border-l-4 border-l-emeraldGreen">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gross Concessions Revenue</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">$7.21 M</h3>
            </div>
            <DollarSign className="w-5 h-5 text-emeraldGreen" />
          </div>
          <p className="text-[10px] text-emeraldGreen mt-2 font-semibold">+18.4% above projections</p>
        </GlassCard>

        <GlassCard className="py-4 border-l-4 border-l-stadiumPurple">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Carbon Footprint Saved</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">12.4 Tons</h3>
            </div>
            <Leaf className="w-5 h-5 text-emeraldGreen" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">CO2 offset via green transit lines</p>
        </GlassCard>

        <GlassCard className="py-4 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Field Responders</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">42 / 50</h3>
            </div>
            <HeartHandshake className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">Volunteers deployed on tiers</p>
        </GlassCard>
      </section>

      {/* RECHARTS PLOT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* REVENUE GROWTH PLOT */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard glowColor="blue">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Cumulative Match Operations Revenue vs Tickets</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF87" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00FF87" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#00FF87" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* LOWER ANALYTICS: LANGUAGES & COGNITIVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LANGAUGE BAR CHART */}
            <GlassCard>
              <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Copilot Language Engagement (%)</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <Bar dataKey="count" fill="#00F2FE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* TRANPORTATION DENSITY SHARE */}
            <GlassCard glowColor="green">
              <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Transit Lane Shares</h4>
              <div className="flex items-center justify-between h-44">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transportShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {transportShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Labels legend */}
                <div className="w-1/2 space-y-1.5 text-[10px]">
                  {transportShare.map((share, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: share.color }}></span>
                      <span className="text-gray-400 font-semibold">{share.name}:</span>
                      <span className="font-bold text-white font-mono">{share.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* RIGHT COLUMN: DISPATCH MONITOR LOGS */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard glowColor="purple" className="flex flex-col h-[520px]">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Real-Time dispatch log feed</span>
            </h3>

            {/* SYNSAPSE FEED CONTAINER */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
              {activeAlerts.map((log, idx) => (
                <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-gray-500 font-bold">
                    <span>SYNAPSE-LOG</span>
                    <span>13:11:{27 + idx}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans">{log}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
