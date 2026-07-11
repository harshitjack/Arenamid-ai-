import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Cpu, Compass, Activity, ShieldCheck, Thermometer, 
  MapPin, Users, Flame, Utensils, Navigation, 
  Accessibility, Train, Zap, ChevronRight, MessageSquare
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { liveData } = useSocket();

  // Subsystem stats
  const subsystems = [
    { name: 'Navigation AI', desc: 'Real-time pathfinding', icon: Navigation, color: 'text-neonBlue', bg: 'bg-neonBlue/10' },
    { name: 'Crowd AI', desc: 'Predictive density modeling', icon: Users, color: 'text-emeraldGreen', bg: 'bg-emeraldGreen/10' },
    { name: 'Emergency AI', desc: 'Incident responder mapping', icon: Flame, color: 'text-red-400', bg: 'bg-red-400/10' },
    { name: 'Food & Queue AI', desc: 'Wait-time calculations', icon: Utensils, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Transport AI', desc: 'Traffic flow & transit capacity', icon: Train, color: 'text-stadiumPurple', bg: 'bg-stadiumPurple/10' },
    { name: 'Accessibility AI', desc: 'Step-free transit paths', icon: Accessibility, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* HERO CONTENT */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-neonBlue/10 border border-neonBlue/20 rounded-full px-4 py-1.5 text-xs text-neonBlue font-semibold tracking-wider">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>FIFA WORLD CUP 2026 CENTRAL OPERATING SYSTEM</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
            ArenaMind AI:<br />
            <span className="bg-gradient-to-r from-neonBlue via-white to-emeraldGreen bg-clip-text text-transparent">
              Next-Gen Stadium Intelligence
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
            The neural grid connecting crowd logistics, emergency protocols, smart transit routing, and AI-guided spectator navigation into a single, unified stadium brain.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => navigate('/copilot')}
              className="flex items-center gap-2 bg-gradient-to-r from-neonBlue to-emeraldGreen hover:opacity-90 text-[#07070A] font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-neon-blue/20 transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Talk to AI Copilot</span>
            </button>
            <button 
              onClick={() => navigate('/stadium')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98]"
            >
              <Compass className="w-5 h-5 text-emeraldGreen" />
              <span>Explore Digital Twin</span>
            </button>
          </div>
        </div>

        {/* HERO DIGITAL TWIN PREVIEW */}
        <div className="lg:col-span-5 flex justify-center">
          <GlassCard glowColor="blue" className="w-full max-w-md border-neonBlue/20 relative overflow-hidden group">
            {/* Pulsing grid grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] opacity-35"></div>

            <div className="relative flex flex-col items-center py-6">
              {/* Stadium Shape SVG */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 border border-neonBlue/25 rounded-full animate-[spin_40s_linear_infinite]"></div>
                {/* Secondary Ring */}
                <div className="absolute inset-4 border border-dashed border-emeraldGreen/20 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
                {/* Stadium Roof Ring */}
                <div className="absolute inset-8 bg-[#0D0D13] border-2 border-white/10 rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,242,254,0.1)]">
                  {/* Field Pitch */}
                  <div className="w-32 h-20 bg-emeraldGreen/10 border border-emeraldGreen/30 rounded flex items-center justify-center transform rotate-12 relative overflow-hidden">
                    <div className="absolute inset-0 border-r border-emeraldGreen/15"></div>
                    <div className="w-8 h-8 rounded-full border border-emeraldGreen/20 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-neonBlue animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Floating telemetry tags */}
                <div className="absolute top-2 left-0 bg-[#0D0D13]/90 border border-white/5 px-2 py-1 rounded text-[10px] font-mono text-neonBlue flex items-center gap-1.5 animate-bounce">
                  <span className="w-1.5 h-1.5 bg-neonBlue rounded-full animate-ping"></span>
                  <span>CROWD: 88%</span>
                </div>
                <div className="absolute bottom-4 right-0 bg-[#0D0D13]/90 border border-white/5 px-2 py-1 rounded text-[10px] font-mono text-emeraldGreen flex items-center gap-1.5 animate-bounce [animation-delay:1s]">
                  <span className="w-1.5 h-1.5 bg-emeraldGreen rounded-full"></span>
                  <span>TEMP: 24°C</span>
                </div>
              </div>

              {/* Core Telemetry metrics */}
              <div className="grid grid-cols-3 gap-3 w-full border-t border-white/5 pt-6 mt-6 text-center">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Health</p>
                  <p className="text-sm font-extrabold text-emeraldGreen flex items-center justify-center gap-1 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>NOMINAL</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Carbon Saved</p>
                  <p className="text-sm font-extrabold text-white font-mono mt-0.5">4.2 Tons</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Synapse</p>
                  <p className="text-sm font-extrabold text-neonBlue font-mono mt-0.5">14.8 ms</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* STADIUM HEALTH TELEMETRY GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GlassCard className="flex items-center gap-4 py-4" hoverEffect>
          <div className="w-12 h-12 rounded-xl bg-neonBlue/10 flex items-center justify-center text-neonBlue shadow-[0_0_10px_rgba(0,242,254,0.1)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Fans</p>
            <h3 className="text-xl font-bold font-mono text-white mt-0.5">{liveData.crowdCount.toLocaleString()}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 py-4" hoverEffect>
          <div className="w-12 h-12 rounded-xl bg-emeraldGreen/10 flex items-center justify-center text-emeraldGreen shadow-[0_0_10px_rgba(0,255,135,0.1)]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Operations Status</p>
            <h3 className="text-xl font-bold text-white mt-0.5">100% Operational</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 py-4" hoverEffect>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Emergency Status</p>
            <h3 className="text-xl font-bold text-emeraldGreen mt-0.5">NOMINAL (0)</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 py-4" hoverEffect>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Stadium Weather</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{liveData.weather.temp}°C, {liveData.weather.condition}</h3>
          </div>
        </GlassCard>
      </section>

      {/* AI ARCHITECTURE PIPELINE */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">The Central Neural Architecture</h2>
          <p className="text-gray-400 text-sm">
            Our multi-agent hierarchy routes telemetric flows through a central brain down to feature-specific logic models.
          </p>
        </div>

        <GlassCard className="p-8 relative">
          <div className="flex flex-col items-center justify-center py-6 gap-8 relative">
            {/* Central Brain */}
            <div className="relative group flex flex-col items-center z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-neonBlue via-stadiumPurple to-emeraldGreen p-[2px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-[#0A0A0E] flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-neonBlue animate-pulse" />
                </div>
              </div>
              <span className="text-sm font-bold text-white mt-3 glow-blue">ArenaMind Central AI Brain</span>
            </div>

            {/* Connecting lines via standard elements or simple indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 w-full mt-4">
              {subsystems.map((sub, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center w-36 text-center bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-all hover:scale-105 duration-200 cursor-pointer"
                  onClick={() => navigate(idx === 0 ? '/navigation' : idx === 1 ? '/stadium' : idx === 2 ? '/emergency' : idx === 3 ? '/food' : idx === 4 ? '/transport' : '/accessibility')}
                >
                  <div className={`w-10 h-10 rounded-xl ${sub.bg} flex items-center justify-center ${sub.color} mb-3`}>
                    <sub.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white block">{sub.name}</span>
                  <span className="text-[10px] text-gray-500 mt-1 block leading-tight">{sub.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* PRODUCT FEATURES GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hoverEffect className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-neonBlue/10 flex items-center justify-center text-neonBlue">
            <Navigation className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Dynamic Routing</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            AI updates mapping paths continuously depending on stadium congestion, escalator statuses, wheelchair-friendly modes, and VIP checkpoints.
          </p>
          <button onClick={() => navigate('/navigation')} className="text-xs font-semibold text-neonBlue hover:underline flex items-center gap-1 group">
            <span>Access Navigator</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </GlassCard>

        <GlassCard hoverEffect className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emeraldGreen/10 flex items-center justify-center text-emeraldGreen">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Digital Twin Vision</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Track seat block occupancy, monitor wait times for amenities, and inspect detailed metrics across 5 tiers of seating sections live.
          </p>
          <button onClick={() => navigate('/stadium')} className="text-xs font-semibold text-emeraldGreen hover:underline flex items-center gap-1 group">
            <span>Open Digital Twin</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </GlassCard>

        <GlassCard hoverEffect className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-400/10 flex items-center justify-center text-red-400">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Emergency Coordination</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Spectators or staff can report critical incidents. AI classifies severity, alerts operators, maps routes, and assigns volunteers immediately.
          </p>
          <button onClick={() => navigate('/emergency')} className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1 group">
            <span>Report / Track Alerts</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </GlassCard>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 pt-8 text-center text-xs text-gray-500">
        <p>© 2026 FIFA World Cup Smart Stadium platform - Powered by ArenaMind AI Core Operations.</p>
        <p className="mt-1">Built with high-frequency telemetry tracking, real-time Socket connections, and Gemini multi-agent systems.</p>
      </footer>
    </div>
  );
};
export default Home;
