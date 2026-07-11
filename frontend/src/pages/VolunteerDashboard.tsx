import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { GlassCard } from '../components/GlassCard';
import { 
  ClipboardList, Navigation, AlertTriangle, Users, 
  Send, HelpCircle, User, CheckCircle, Check, Info, ToggleLeft, ToggleRight
} from 'lucide-react';

interface VolunteerTask {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  assignedTo: string;
  location: string;
  status: 'pending' | 'assigned' | 'completed';
  urgency: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

export const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { socket, addAlert, activeAlerts } = useSocket();

  const [activeDuty, setActiveDuty] = useState(true);
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'Dave (Lead)', text: 'All units check in. Crowd surge expected at Gate B in 10 mins.', time: '13:02' },
    { sender: 'Lisa (Zone A)', text: 'I am at Section 101. Restroom queues are low right now.', time: '13:05' }
  ]);

  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch volunteer tasks list
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.warn('REST API unavailable, loading offline mock tasks.');
      setTasks([
        { id: 't-1', title: 'Assist Fan Wheelchair', description: 'Assist elderly fan entering Gate B with wheelchair escort to Section 104.', location: 'Gate B Entryway', assignedTo: user?.name || 'David Beckham', status: 'assigned', urgency: 'medium' },
        { id: 't-2', title: 'Language Translation', description: 'Translate French announcement for group of fans near Ticketing Gate 3.', location: 'Ticketing Gate 3', assignedTo: '', status: 'pending', urgency: 'low' },
        { id: 't-3', title: 'Section Check', description: 'Monitor occupancy density in lower stands of Section 120.', location: 'Section 120 Lower', assignedTo: '', status: 'pending', urgency: 'low' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Listen for socket messages
  useEffect(() => {
    if (socket) {
      const handleIncomingChat = (data: any) => {
        setChatMessages(prev => [...prev, {
          sender: data.sender,
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      };

      socket.emit('join_room', 'volunteer_tasks');
      socket.on('chat_message', handleIncomingChat);

      return () => {
        socket.off('chat_message', handleIncomingChat);
      };
    }
  }, [socket]);

  // Periodically emit simulated volunteer coordinates to the admin dashboard
  useEffect(() => {
    if (socket && activeDuty) {
      const reportLocationTimer = setInterval(() => {
        socket.emit('volunteer_location', {
          name: user?.name || 'David Beckham',
          section: '104',
          timestamp: new Date()
        });
      }, 8000);

      return () => clearInterval(reportLocationTimer);
    }
  }, [socket, activeDuty, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const payload = {
      sender: user?.name || 'Volunteer Helper',
      text: chatInput
    };

    if (socket) {
      socket.emit('send_chat', payload);
    } else {
      // Offline fallback
      setChatMessages(prev => [...prev, {
        sender: payload.sender,
        text: payload.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }

    setChatInput('');
  };

  const handleClaimTask = async (taskId: string) => {
    const volunteerName = user?.name || 'David Beckham';
    try {
      const res = await fetch(`/api/tasks/${taskId}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerName })
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId || t._id === taskId) ? updated : t));
        addAlert(`📋 TASK CLAIMED: "${updated.title}" assigned to you.`);
      }
    } catch (err) {
      // Offline simulation
      setTasks(prev => prev.map(t => (t.id === taskId) ? { ...t, assignedTo: volunteerName, status: 'assigned' } : t));
      addAlert(`📋 TASK CLAIMED (Offline): Task marked as assigned.`);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PUT'
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId || t._id === taskId) ? updated : t));
        addAlert(`✅ TASK COMPLETED: Good job!`);
      }
    } catch (err) {
      setTasks(prev => prev.map(t => (t.id === taskId) ? { ...t, status: 'completed' } : t));
      addAlert(`✅ TASK COMPLETED (Offline): Task marked as completed.`);
    }
  };

  // Filter tasks based on assignment
  const myTasks = tasks.filter(t => t.assignedTo === user?.name || t.assignedTo === 'David Beckham');
  const openTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-neonBlue animate-pulse" />
            <span>Field Volunteer Operations Portal</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Check in for your shift, coordinate with dispatch, log location reports, and resolve fan assistance tasks.
          </p>
        </div>

        {/* SHIFT STATUS TOGGLER */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-xs">
          <span className="font-semibold text-gray-400">Shift Status:</span>
          <button 
            onClick={() => {
              setActiveDuty(!activeDuty);
              addAlert(`🛡️ ATTENDANCE: Checked ${!activeDuty ? 'IN' : 'OUT'} of stadium duty.`);
            }}
            className="flex items-center gap-1.5 focus:outline-none"
          >
            {activeDuty ? (
              <>
                <span className="text-emeraldGreen font-bold">ACTIVE DUTY</span>
                <ToggleRight className="w-6 h-6 text-emeraldGreen cursor-pointer" />
              </>
            ) : (
              <>
                <span className="text-gray-500 font-bold">OFF DUTY</span>
                <ToggleLeft className="w-6 h-6 text-gray-500 cursor-pointer" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ACTIVE TASKS AND LISTS */}
        <div className="lg:col-span-7 space-y-6">
          {/* MY TASK LIST */}
          <GlassCard glowColor="green">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emeraldGreen animate-pulse" />
              <span>My Assigned Missions ({myTasks.length})</span>
            </h3>

            {myTasks.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono">No active missions assigned. Inspect the open pool below.</p>
            ) : (
              <div className="space-y-4">
                {myTasks.map((t) => (
                  <div key={t.id || t._id} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{t.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Location: {t.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] border
                        ${t.status === 'completed' ? 'bg-emeraldGreen/10 border-emeraldGreen/20 text-emeraldGreen' : 'bg-neonBlue/10 border-neonBlue/20 text-neonBlue'}`}>
                        {t.status}
                      </span>
                    </div>

                    <p className="text-gray-400 leading-relaxed text-[11px]">{t.description}</p>

                    {t.status !== 'completed' && (
                      <button
                        onClick={() => handleCompleteTask(String(t.id || t._id))}
                        className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-emeraldGreen text-[#07070A] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                      >
                        <Check className="w-4 h-4" />
                        <span>Complete Mission</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* OPEN TASK POOL */}
          <GlassCard>
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Open Logistics Task Pool ({openTasks.length})</h3>
            
            {openTasks.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono">No open tasks pending. Well done team!</p>
            ) : (
              <div className="space-y-3.5">
                {openTasks.map((t) => (
                  <div key={t.id || t._id} className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs gap-4">
                    <div>
                      <h4 className="font-bold text-white">{t.title}</h4>
                      <p className="text-gray-500 text-[10px] mt-0.5">Section: {t.location} | Urgency: {t.urgency}</p>
                    </div>
                    <button
                      onClick={() => handleClaimTask(String(t.id || t._id))}
                      className="py-1.5 px-3 rounded-lg bg-neonBlue/10 border border-neonBlue/20 text-neonBlue font-semibold transition-all hover:bg-neonBlue/20 hover:text-white shrink-0"
                    >
                      Claim
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: COGNITIVE BROADCAST & CHAT */}
        <div className="lg:col-span-5 space-y-6">
          {/* GENERAL DISPATCH CHAT */}
          <GlassCard glowColor="blue" className="flex flex-col h-[320px]">
            <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-gray-400">Volunteer Radio Chat</h3>
            
            {/* MESSAGES LOG */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-bold text-neonBlue">{msg.sender}</span>
                    <span className="text-gray-600 font-mono">{msg.time}</span>
                  </div>
                  <p className="bg-white/5 py-2 px-3 rounded-xl border border-white/5 text-gray-300 leading-relaxed max-w-[90%]">
                    {msg.text}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* SEND FORM */}
            <form onSubmit={handleSendChat} className="flex items-center gap-1.5 border-t border-white/5 pt-3.5 mt-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Radio message..."
                className="flex-1 bg-[#0D0D13] border border-white/10 rounded-xl py-2 px-3.5 text-white text-xs placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-neonBlue text-[#07070A] font-bold p-2.5 rounded-xl"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </GlassCard>

          {/* TELEMETRIC LOG ALERTS */}
          <GlassCard className="py-4">
            <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Broadcast Alerts Feed</h4>
            <div className="space-y-2.5 max-h-[120px] overflow-y-auto pr-1">
              {activeAlerts.map((alert, i) => (
                <div key={i} className="flex gap-2 text-[10px] text-gray-400 font-mono">
                  <span className="text-red-400 animate-pulse font-bold">!</span>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default VolunteerDashboard;
