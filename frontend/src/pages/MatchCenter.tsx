import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Trophy, Clock, Sparkles, Activity, Flag, HelpCircle, 
  MapPin, ShieldAlert, Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineEvent {
  time: number;
  type: 'goal' | 'card' | 'shot' | 'corner' | 'substitution';
  detail: string;
}

export const MatchCenter: React.FC = () => {
  const { liveData } = useSocket();
  const [matchData, setMatchData] = useState<any>(null);
  const [commentary, setCommentary] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  // Fetch initial match center details
  const fetchMatchCenter = async () => {
    try {
      const res = await fetch('/api/match');
      if (res.ok) {
        const data = await res.json();
        setMatchData(data);
        setCommentary(data.aiCommentary);
        setTimeline(data.timeline);
      }
    } catch (err) {
      console.warn('REST API unavailable, loading offline mock Match Center.');
      // Offline fallback
      const mockMatch = {
        homeTeam: 'USA',
        awayTeam: 'Mexico',
        homeScore: 1,
        awayScore: 1,
        status: 'live',
        minute: 54,
        possession: { home: 55, away: 45 },
        expectedGoals: { home: 1.45, away: 1.12 },
        momentum: [
          { name: '10\'', value: 10 },
          { name: '20\'', value: -15 },
          { name: '30\'', value: 20 },
          { name: '40\'', value: 45 },
          { name: '50\'', value: -5 },
          { name: '60\'', value: 30 }
        ],
        timeline: [
          { time: 12, type: 'goal', detail: 'GOAL! USA scores. Pulisic with a beautiful volley!' },
          { time: 34, type: 'card', detail: 'Yellow card shown to McKennie (USA).' },
          { time: 42, type: 'goal', detail: 'GOAL! Mexico scores. Jimenez equalizes with a header!' }
        ],
        aiCommentary: [
          '[Minute 12] AI Analysis: USA exploit spaces in the wide channel. Pulisic has 0.65 xG on that volley.',
          '[Minute 34] AI Analysis: Match intensity is high, average player heart rate is 164 bpm.',
          '[Minute 42] AI Analysis: Mexico shifts to cross-heavy play. High conversion chance on set piece.'
        ],
        predictions: { homeWin: 45, awayWin: 30, draw: 25 },
        heatmaps: {
          home: [{ x: 30, y: 40, intensity: 8 }, { x: 35, y: 45, intensity: 10 }, { x: 70, y: 50, intensity: 6 }],
          away: [{ x: 50, y: 30, intensity: 7 }, { x: 60, y: 35, intensity: 9 }, { x: 40, y: 60, intensity: 5 }]
        }
      };
      setMatchData(mockMatch);
      setCommentary(mockMatch.aiCommentary);
      setTimeline(mockMatch.timeline as TimelineEvent[]);
    }
  };

  useEffect(() => {
    fetchMatchCenter();
  }, []);

  // Update live scores and match statistics reactive to socket emits
  useEffect(() => {
    if (liveData.match && matchData) {
      setMatchData((prev: any) => ({
        ...prev,
        homeScore: liveData.match.homeScore,
        awayScore: liveData.match.awayScore,
        minute: liveData.match.minute,
        possession: liveData.match.possession,
        expectedGoals: liveData.match.expectedGoals,
      }));

      if (liveData.match.event) {
        const nextEvent: TimelineEvent = {
          time: liveData.match.event.time,
          type: liveData.match.event.type as any,
          detail: liveData.match.event.detail
        };
        setTimeline(prev => [nextEvent, ...prev]);
        setCommentary(prev => [
          `[Minute ${liveData.match.minute}] AI Commentary: Live incident logged: ${liveData.match.event?.detail}. Expected conversion adjustment registered.`,
          ...prev
        ]);
      }
    }
  }, [liveData]);

  // Convert flat numbers array to chart format if needed
  const getMomentumChartData = () => {
    if (!matchData?.momentum) return [];
    if (typeof matchData.momentum[0] === 'object') return matchData.momentum;
    
    return matchData.momentum.map((val: number, i: number) => ({
      name: `${(i + 1) * 5}'`,
      value: val
    }));
  };

  return (
    <div className="space-y-8">
      {/* SCOREBOARD CONTAINER */}
      {matchData && (
        <section className="bg-gradient-to-tr from-[#0D0D13]/90 to-[#101017]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden text-center flex flex-col items-center justify-center">
          {/* Neon background lines */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-neonBlue to-emeraldGreen"></div>

          <div className="flex items-center gap-2 text-xs font-semibold text-neonBlue bg-neonBlue/10 px-3.5 py-1.5 rounded-full mb-6">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>FIFA WORLD CUP 2026 - SEMI FINAL</span>
          </div>

          {/* TEAMS AND SCORE ROW */}
          <div className="grid grid-cols-3 gap-4 items-center w-full max-w-xl">
            {/* HOME TEAM */}
            <div className="text-right space-y-2">
              <h3 className="text-lg md:text-2xl font-extrabold text-white">{matchData.homeTeam}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">USA Soccer</p>
            </div>

            {/* LIVE SCORE */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono text-white glow-blue">
                {matchData.homeScore} : {matchData.awayScore}
              </h1>
              <span className="inline-block text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded animate-pulse">
                LIVE MIN {matchData.minute}'
              </span>
            </div>

            {/* AWAY TEAM */}
            <div className="text-left space-y-2">
              <h3 className="text-lg md:text-2xl font-extrabold text-white">{matchData.awayTeam}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Mexican Federation</p>
            </div>
          </div>

          {/* POSSESSION BAR */}
          <div className="w-full max-w-lg mt-8 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span className="font-semibold">{matchData.possession.home}% Possession</span>
              <span className="font-semibold">{matchData.possession.away}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-neonBlue transition-all duration-500" 
                style={{ width: `${matchData.possession.home}%` }}
              ></div>
              <div 
                className="h-full bg-emeraldGreen transition-all duration-500" 
                style={{ width: `${matchData.possession.away}%` }}
              ></div>
            </div>
          </div>
        </section>
      )}

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL: TIMELINE & AI FEED */}
        <div className="lg:col-span-4 space-y-6">
          {/* EXPECTED GOALS */}
          {matchData && (
            <GlassCard className="py-4">
              <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Expected Goals (xG)</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">USA</span>
                  <p className="text-lg font-extrabold text-white mt-0.5 font-mono">{matchData.expectedGoals.home.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">MEX</span>
                  <p className="text-lg font-extrabold text-white mt-0.5 font-mono">{matchData.expectedGoals.away.toFixed(2)}</p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* LIVE TIMELINE */}
          <GlassCard glowColor="blue">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <Flag className="w-5 h-5 text-neonBlue" />
              <span>Event Timeline</span>
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {timeline.map((evt, i) => (
                <div key={i} className="flex gap-3 text-xs items-start">
                  <span className="font-mono text-neonBlue font-bold shrink-0">{evt.time}'</span>
                  <div className="space-y-0.5 leading-relaxed">
                    <p className="font-bold text-white uppercase text-[10px]">{evt.type}</p>
                    <p className="text-gray-400 text-[11px]">{evt.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* CENTER PANEL: MOMENTUM & COMMENTARY */}
        <div className="lg:col-span-8 space-y-6">
          {/* MOMENTUM CHART */}
          <GlassCard glowColor="green">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">AI Match Attacking Momentum</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getMomentumChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <Area type="monotone" dataKey="value" stroke="#00FF87" fill="rgba(0, 255, 135, 0.1)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* AI LIVE COMMENTARY */}
          <GlassCard>
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-neonBlue animate-pulse" />
              <span>AI Analytical Commentary Logs</span>
            </h3>

            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
              {commentary.map((comm, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-gray-300 leading-relaxed font-mono">
                  {comm}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default MatchCenter;
