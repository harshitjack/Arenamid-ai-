import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, Server, Database, TrendingUp, HelpCircle } from 'lucide-react';

export const Analytics: React.FC = () => {
  // Chart datasets
  const queryLatency = [
    { name: '10s ago', Gemini: 120, RAG: 45, DB: 12 },
    { name: '8s ago', Gemini: 145, RAG: 55, DB: 15 },
    { name: '6s ago', Gemini: 112, RAG: 40, DB: 10 },
    { name: '4s ago', Gemini: 130, RAG: 48, DB: 11 },
    { name: '2s ago', Gemini: 95, RAG: 35, DB: 8 },
    { name: 'Now', Gemini: 115, RAG: 42, DB: 9 },
  ];

  const carbonData = [
    { name: 'Monday', CO2: 2.1 },
    { name: 'Tuesday', CO2: 2.8 },
    { name: 'Wednesday', CO2: 3.4 },
    { name: 'Thursday', CO2: 4.2 },
    { name: 'Friday', CO2: 5.1 },
    { name: 'Saturday', CO2: 6.8 },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Activity className="w-8 h-8 text-neonBlue" />
          <span>System Diagnostics & Analytics</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Monitor system metrics, including Pinecone RAG latency, Gemini token usage index, and detailed carbon saving reports.
        </p>
      </div>

      {/* SYSTEM METRICS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        <GlassCard className="py-4 border-l-4 border-l-neonBlue">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Average AI Latency</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">115 ms</h3>
            </div>
            <Cpu className="w-5 h-5 text-neonBlue" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">Gemini 1.5-Flash processing time</p>
        </GlassCard>

        <GlassCard className="py-4 border-l-4 border-l-emeraldGreen">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Pinecone RAG Speed</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">42 ms</h3>
            </div>
            <Database className="w-5 h-5 text-emeraldGreen" />
          </div>
          <p className="text-[10px] text-emeraldGreen mt-2 font-semibold">Vector indexing embedding checks</p>
        </GlassCard>

        <GlassCard className="py-4 border-l-4 border-l-stadiumPurple">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Server RAM Usage</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">142 MB</h3>
            </div>
            <Server className="w-5 h-5 text-stadiumPurple" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">Node express thread consumption</p>
        </GlassCard>

        <GlassCard className="py-4 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Redis Cache Hitrate</p>
              <h3 className="text-xl font-bold font-mono text-white mt-1">94.8%</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">Pre-cached queue delay payloads</p>
        </GlassCard>
      </section>

      {/* GRAPH GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LATENCY AREA CHART */}
        <div className="lg:col-span-6">
          <GlassCard glowColor="blue">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Synapse Processing Latency Breakdown (ms)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={queryLatency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <Line type="monotone" dataKey="Gemini" stroke="#00F2FE" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="RAG" stroke="#00FF87" strokeWidth={2} />
                  <Line type="monotone" dataKey="DB" stroke="#7F00FF" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* CARBON BAR CHART */}
        <div className="lg:col-span-6">
          <GlassCard glowColor="green">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Carbon Savings Progress (Tons CO2 Offset)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <Bar dataKey="CO2" fill="#00FF87" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
