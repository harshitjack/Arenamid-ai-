import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/GlassCard';
import { 
  AlertTriangle, Flame, ShieldAlert, LifeBuoy, Users, 
  MapPin, CheckCircle, Clock, Send, Info, User
} from 'lucide-react';

interface Incident {
  id?: string;
  _id?: string;
  reporterName: string;
  type: 'medical' | 'fire' | 'violence' | 'lost_child' | 'suspicious_object';
  description: string;
  location: string;
  status: 'reported' | 'assigned' | 'resolving' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  assignedVolunteer: string;
  aiAnalysis?: {
    suggestedResponse: string;
    responsePlan: string[];
    recommendedPath: string[];
  };
  createdAt: string | Date;
}

export const EmergencyCenter: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useSocket();

  const [type, setType] = useState<'medical' | 'fire' | 'violence' | 'lost_child' | 'suspicious_object'>('medical');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Fetch incidents list
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
        if (data.length > 0 && !selectedIncident) {
          setSelectedIncident(data[0]);
        }
      }
    } catch (err) {
      console.warn('Could not connect to incident REST. Initializing simulated database registry.');
      // Offline fallback incidents
      const mockList: Incident[] = [
        {
          id: 'inc-1',
          reporterName: 'John Fan',
          type: 'medical',
          description: 'Heat exhaustion, fan is feeling dizzy and needs water and ice pack.',
          location: 'Section 104, Row G',
          status: 'assigned',
          severity: 'medium',
          assignedVolunteer: 'David Beckham',
          aiAnalysis: {
            suggestedResponse: 'Deliver hydration package and cooling towels.',
            responsePlan: ['Fetch ice packs from Section 104 kiosk.', 'Assign nearby volunteer.', 'Track response status.'],
            recommendedPath: ['Volunteer Base', 'Elevator E1', 'Section 104 Row G']
          },
          createdAt: new Date().toISOString()
        }
      ];
      setIncidents(mockList);
      setSelectedIncident(mockList[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleReportEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    setReporting(true);
    const payload = {
      reporterName: user?.name || 'Anonymous Fan',
      type,
      description,
      location
    };

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setIncidents(prev => [data, ...prev]);
        setSelectedIncident(data);
        addAlert(`🚨 EMERGENCY LOGGED: ${type.toUpperCase()} reported at ${location}. AI response activated.`);
        
        // Reset form
        setDescription('');
        setLocation('');
      } else {
        throw new Error('Endpoint error');
      }
    } catch (err) {
      console.warn('REST report failed. Triggering Sandbox AI pipeline.');
      // Simulated response
      const mockResult: Incident = {
        id: `inc-${incidents.length + 1}`,
        reporterName: payload.reporterName,
        type: payload.type,
        description: payload.description,
        location: payload.location,
        status: 'reported',
        severity: description.toLowerCase().includes('fire') || description.toLowerCase().includes('heart') ? 'critical' : 'high',
        assignedVolunteer: '',
        aiAnalysis: {
          suggestedResponse: 'AI Sandbox Evaluator: Alerting emergency controllers and mapping local gates.',
          responsePlan: ['Dispatch nearest volunteer team.', 'Keep pathway from Gate B clear.', 'Prepare First Aid Station 2.'],
          recommendedPath: ['Gate A Entry', 'Sec 104 Row G']
        },
        createdAt: new Date().toISOString()
      };

      setIncidents(prev => [mockResult, ...prev]);
      setSelectedIncident(mockResult);
      addAlert(`🚨 SANDBOX ALERT: ${type.toUpperCase()} reported at ${location}. AI pipeline mock created.`);
      setDescription('');
      setLocation('');
    } finally {
      setReporting(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500 text-red-400 font-extrabold shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse';
      case 'high':
        return 'bg-orange-500/10 border-orange-500 text-orange-400 font-bold';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold';
      case 'low':
      default:
        return 'bg-emeraldGreen/10 border-emeraldGreen/20 text-emeraldGreen';
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
          <span>Central Emergency Response Center</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Report immediate hazards, security incidents, or medical events. The central AI automatically alerts control rooms, predicts severity levels, and maps volunteer routes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: REPORT FORM */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard glowColor="purple">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Log Incident Report</span>
            </h3>

            <form onSubmit={handleReportEmergency} className="space-y-4 text-xs">
              {/* INCIDENT TYPE */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Emergency Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[#0D0D13] border border-white/10 rounded-xl py-2.5 px-3.5 text-white"
                >
                  <option value="medical">Medical Emergency (Heart, Injury, Fainting)</option>
                  <option value="fire">Fire / Smoke hazard</option>
                  <option value="violence">Violence / Altercation / Fight</option>
                  <option value="lost_child">Lost Child Coordination</option>
                  <option value="suspicious_object">Suspicious Bag / Object</option>
                </select>
              </div>

              {/* LOCATION */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Stadium Location / Sector</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Section 104, Row G or Gate B East Lobby"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Incident Details / Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details for AI routing logic (e.g. Elderly fan has collapsed, breathing heavily, unconscious)..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reporting}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{reporting ? 'AI Parsing Details...' : 'Deploy AI Responders'}</span>
              </button>
            </form>
          </GlassCard>

          {/* PREVIOUS RECOGNIZED INCIDENTS LIST */}
          <GlassCard className="py-4">
            <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Active Incident Tickets</h4>
            {loading ? (
              <p className="text-xs text-gray-500 font-mono animate-pulse">Syncing tickets with Socket Gateway...</p>
            ) : incidents.length === 0 ? (
              <p className="text-xs text-gray-500">No active incidents reported. Stadium secure.</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {incidents.map((inc) => {
                  const isActive = selectedIncident?.id === inc.id || selectedIncident?._id === inc._id;
                  return (
                    <button
                      key={inc.id || inc._id}
                      onClick={() => setSelectedIncident(inc)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between
                        ${isActive 
                          ? 'bg-red-500/10 border-red-500/30 text-white' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10 hover:text-white'}`}
                    >
                      <div className="truncate">
                        <p className="font-bold truncate text-white capitalize">{inc.type.replace('_', ' ')}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{inc.location}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${getSeverityStyles(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: AI ANALYTIC SUMMARY */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <GlassCard glowColor="purple" className="space-y-6">
              {/* INCIDENT DETAILS */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">
                    {selectedIncident.type.replace('_', ' ')} Emergency
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-neonBlue" />
                    <span>Location: <span className="font-bold text-white">{selectedIncident.location}</span></span>
                  </div>
                </div>

                <span className={`text-xs px-2.5 py-1 border rounded-lg font-bold uppercase tracking-wider ${getSeverityStyles(selectedIncident.severity)}`}>
                  Severity: {selectedIncident.severity}
                </span>
              </div>

              {/* REPORT BY */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-4 h-4 text-neonBlue" />
                    <span>Reporter Details</span>
                  </div>
                  <p className="font-bold text-white mt-1.5">{selectedIncident.reporterName}</p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 text-emeraldGreen" />
                    <span>Status Tracker</span>
                  </div>
                  <p className="font-bold text-emeraldGreen mt-1.5 capitalize">{selectedIncident.status}</p>
                </div>
              </div>

              {/* DESCRIPTION SECTION */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Report Description</p>
                <p className="text-sm bg-white/5 p-4 rounded-xl border border-white/5 text-gray-300 leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              {/* AI ANALYTICAL ACTIONS BLOCK */}
              {selectedIncident.aiAnalysis && (
                <div className="space-y-4 border-t border-white/5 pt-4 text-xs">
                  <div className="flex items-center gap-2 text-neonBlue">
                    <LifeBuoy className="w-4.5 h-4.5 animate-spin" />
                    <h4 className="font-bold uppercase tracking-wider">AI Central Dispatch Output</h4>
                  </div>

                  {/* SUGGESTED ACTIONS */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Suggested Action</p>
                    <p className="text-white bg-neonBlue/5 border border-neonBlue/10 p-3 rounded-lg leading-relaxed">
                      {selectedIncident.aiAnalysis.suggestedResponse}
                    </p>
                  </div>

                  {/* COGNITIVE PROTOCOLS RESPONSE PLAN */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Action Plan (Synapses Assigned)</p>
                    {selectedIncident.aiAnalysis.responsePlan.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300 py-1 px-2.5 bg-white/5 rounded">
                        <CheckCircle className="w-3.5 h-3.5 text-emeraldGreen shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* EMERGENCY NAVIGATION ROUTING */}
                  {selectedIncident.aiAnalysis.recommendedPath && selectedIncident.aiAnalysis.recommendedPath.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Safe Evacuation / Responder Path</p>
                      <div className="flex items-center gap-1 bg-[#0D0D13] p-3 rounded-lg border border-white/5 overflow-x-auto text-[10px] font-mono text-neonBlue">
                        {selectedIncident.aiAnalysis.recommendedPath.map((node, idx) => (
                          <React.Fragment key={idx}>
                            <span className="font-bold text-white shrink-0">{node}</span>
                            {idx < (selectedIncident.aiAnalysis?.recommendedPath?.length ?? 0) - 1 && (
                              <span className="text-gray-600 font-sans mx-1">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
              <Info className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-sm text-gray-400 font-bold">No Active Incident Selected</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">Select any reported incident ticket on the left menu to view detailed AI analysis datasets.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
export default EmergencyCenter;
