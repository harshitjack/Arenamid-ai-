import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Send, Mic, Image, MapPin, Ticket, Languages, 
  HelpCircle, Sparkles, User, Cpu, AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
  timestamp: Date;
}

export const AICopilot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: `Hello ${user?.name || 'Operator'}. I am the ArenaMind Central Copilot. How can I guide you around the stadium today? Ask me about gate locations, food options, transit statuses, or report immediate safety alerts.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Simulations status states
  const [micActive, setMicActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [ticketScanned, setTicketScanned] = useState(false);
  const [scannedTicketData, setScannedTicketData] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = { role: 'user', parts: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history payload for Gemini API context
      const historyPayload = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, history: historyPayload })
      });

      if (!res.ok) throw new Error('Copilot endpoint failed');
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'model',
        parts: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.warn('Network copilot query failed. Using offline smart response simulation.');
      // Local fallback
      setTimeout(() => {
        let fallbackText = "I encountered a connection error with the central neural cloud, but my local sandbox predicts: ";
        const query = textToSend.toLowerCase();

        if (query.includes('seat')) {
          fallbackText += "Your seat in Section 104 is best accessed through Gate B. Elevators are available immediately to the right of the gate entry.";
        } else if (query.includes('restroom') || query.includes('toilet')) {
          fallbackText += "The restrooms in Section 103 have a 1-minute wait. Follow the corridor signs near the exit gates.";
        } else if (query.includes('halal') || query.includes('food') || query.includes('vegetarian')) {
          fallbackText += "Copa Grill behind Section 112 offers certified Halal burgers. Green Field Bistro near Gate D has excellent vegan and vegetarian salads.";
        } else if (query.includes('emergency') || query.includes('medical') || query.includes('hurt')) {
          fallbackText += "EMERGENCY STATE DETECTED. I have alerted the command center and mapped Section 104 to the nearest first-aid kiosk. Please navigate to the Emergency Center page to log detailed tracking.";
        } else {
          fallbackText += "You can reach Gate A by proceeding to the outer loop concourse level. Signs are marked in green. Average walking time from Section 104 is 3 minutes.";
        }

        setMessages(prev => [...prev, {
          role: 'model',
          parts: fallbackText,
          timestamp: new Date()
        }]);
        setLoading(false);
      }, 1000);
      return;
    }
    setLoading(false);
  };

  const handleMicSimulate = () => {
    setMicActive(true);
    setInput('Listening to voice query...');
    setTimeout(() => {
      setInput('Where is the nearest Halal food stall with the shortest wait time?');
      setMicActive(false);
    }, 2000);
  };

  const handleLocationSimulate = () => {
    setLocationShared(true);
    addSystemNotice('📍 Current coordinates shared: Section 104 Corridor, Row G.');
  };

  const handleTicketSimulate = () => {
    setTicketScanned(true);
    setScannedTicketData('TICKET: GATE B | SEC 104 | ROW G | SEAT 14');
    addSystemNotice('🎟️ Ticket scanned successfully! Seat: Sec 104, Row G. Gate B entryway assigned.');
    setInput('Find my seat from Gate B');
  };

  const addSystemNotice = (text: string) => {
    setMessages(prev => [...prev, {
      role: 'model',
      parts: `[SYSTEM LOG] ${text}`,
      timestamp: new Date()
    }]);
  };

  const suggestionChips = [
    { text: 'Find my seat', prompt: 'Guide me to my seat in Section 104 Row G' },
    { text: 'Nearest restroom', prompt: 'Where is the nearest restroom and what is the wait time?' },
    { text: 'Halal/Vegan options', prompt: 'Where is halal food and vegetarian options?' },
    { text: 'Emergency near me', prompt: 'Emergency help needed! High density congestion near Gate B' },
    { text: 'Translate announcement', prompt: 'Translate the stadium announcer loudspeaker feed' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
      {/* LEFT CHAT LOG */}
      <div className="lg:col-span-8 flex flex-col h-full bg-[#0D0D13]/40 border border-white/5 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neonBlue to-emeraldGreen"></div>

        {/* CHAT WINDOW */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, idx) => {
            const isSystem = msg.parts.startsWith('[SYSTEM LOG]');
            const isAI = msg.role === 'model';
            
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[80%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* AVATAR */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                  ${isAI 
                    ? 'bg-neonBlue/10 border-neonBlue/20 text-neonBlue' 
                    : 'bg-emeraldGreen/10 border-emeraldGreen/20 text-emeraldGreen'}
                `}>
                  {isAI ? <Cpu className="w-4.5 h-4.5 animate-pulse" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* TEXT CONTAINER */}
                <div className={`rounded-2xl p-4 text-sm leading-relaxed
                  ${isSystem 
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs' 
                    : isAI 
                      ? 'bg-white/5 border border-white/5 text-gray-200' 
                      : 'bg-neonBlue/10 border border-neonBlue/20 text-neonBlue'}
                `}>
                  {msg.parts}
                  <span className="block text-[10px] text-gray-500 mt-2 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-neonBlue/10 border border-neonBlue/20 text-neonBlue flex items-center justify-center shrink-0 animate-pulse">
                <Cpu className="w-4.5 h-4.5 animate-spin" />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-gray-400 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neonBlue rounded-full animate-ping"></span>
                <span>AI Synapse calculating routing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* PROMPT CHIPS */}
        <div className="px-6 py-2 border-t border-white/5 flex flex-wrap gap-2">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.prompt)}
              className="text-[11px] font-semibold bg-white/5 border border-white/5 rounded-full px-3 py-1 text-gray-300 hover:border-neonBlue/30 hover:bg-neonBlue/5 hover:text-neonBlue transition-all"
            >
              {chip.text}
            </button>
          ))}
        </div>

        {/* INPUT FORM CONTAINER */}
        <div className="p-4 border-t border-white/5 bg-[#0A0A0F]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }} 
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ArenaMind Copilot..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neonBlue transition-all"
            />
            <button
              type="submit"
              className="bg-neonBlue hover:opacity-90 text-[#07070A] font-bold p-3 rounded-xl shadow-lg shadow-neon-blue/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT UTILITIES PANEL */}
      <div className="lg:col-span-4 space-y-6">
        <GlassCard glowColor="blue">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neonBlue" />
            <span>Copilot Controller</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* VOICE ASSIST */}
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
              <div>
                <p className="font-bold text-white">Voice Dictation</p>
                <p className="text-gray-500 mt-0.5">Simulate speech queries</p>
              </div>
              <button 
                onClick={handleMicSimulate}
                className={`p-2.5 rounded-lg border transition-all ${micActive ? 'bg-red-500/10 border-red-500 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* LOCATION ASSIST */}
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
              <div>
                <p className="font-bold text-white">Location Services</p>
                <p className="text-gray-500 mt-0.5">Share current seat beacon</p>
              </div>
              <button 
                onClick={handleLocationSimulate}
                className={`p-2.5 rounded-lg border transition-all ${locationShared ? 'bg-emeraldGreen/10 border-emeraldGreen text-emeraldGreen' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* TICKET ASSIST */}
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
              <div>
                <p className="font-bold text-white">Ticket OCR Scanner</p>
                <p className="text-gray-500 mt-0.5">Upload and scan match ticket</p>
              </div>
              <button 
                onClick={handleTicketSimulate}
                className={`p-2.5 rounded-lg border transition-all ${ticketScanned ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
              >
                <Ticket className="w-4 h-4" />
              </button>
            </div>

            {/* LANGUAGE TRANSLATE SELECTION */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-neonBlue" />
                <p className="font-bold text-white">Translating Engine</p>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-[#0D0D13] border border-white/10 rounded-lg py-1.5 px-3 text-white text-xs"
              >
                <option value="en">English (default)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="pt">Português (Portuguese)</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider text-gray-400">Security Warning</h4>
          <div className="flex gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Ensure telemetry sharing remains enabled during the match. Turning off location beacons prevents automatic volunteer responder mapping in medical incidents.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
export default AICopilot;
