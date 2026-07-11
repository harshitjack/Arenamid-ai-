import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Accessibility, Volume2, ZoomIn, Eye, Activity, 
  MapPin, CheckCircle, Shield, HelpCircle, AudioLines
} from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const [textSize, setTextSize] = useState<'md' | 'lg' | 'xl'>('md');
  const [highContrast, setHighContrast] = useState(false);
  const [signLanguageActive, setSignLanguageActive] = useState(false);

  const announcements = [
    'Welcome to the FIFA World Cup 2026. Kick-off is in 30 minutes. Please locate your seating gates.',
    'Weather advisory: Temperatures are holding at 24°C. Hydration kiosks are open throughout the East concourse.',
    'Congestion Warning: Gate A is currently experiencing high exit traffic. Fans are advised to utilize Gate C.'
  ];

  const handleSpeechTrigger = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  const handleContrastToggle = () => {
    setHighContrast(!highContrast);
    updatePreferences({ accessibilityMode: !highContrast });
  };

  // Set font multiplier classes based on text size
  const getTextSizeClass = () => {
    if (textSize === 'lg') return 'text-base';
    if (textSize === 'xl') return 'text-lg';
    return 'text-xs';
  };

  return (
    <div className={`space-y-8 ${highContrast ? 'contrast-125 saturate-150' : ''}`}>
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Accessibility className="w-8 h-8 text-neonBlue" />
          <span>Accessibility Control Desk</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Customize your spectator preferences. Adjust contrast ratios, scale text readouts, search wheelchair-accessible transit corridors, or activate assistive audio feeds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONTROL SUITE */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard glowColor="blue" className={highContrast ? 'border-2 border-neonBlue' : ''}>
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <ZoomIn className="w-5 h-5 text-neonBlue" />
              <span>UI Modifiers</span>
            </h3>

            <div className="space-y-6 text-xs">
              {/* TEXT SCALING */}
              <div className="space-y-2">
                <label className="block text-gray-400 font-bold uppercase tracking-wider">Text Size Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTextSize('md')}
                    className={`py-2 rounded-xl font-bold border transition-all ${textSize === 'md' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400'}`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setTextSize('lg')}
                    className={`py-2 rounded-xl font-bold border transition-all ${textSize === 'lg' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400'}`}
                  >
                    Large
                  </button>
                  <button
                    onClick={() => setTextSize('xl')}
                    className={`py-2 rounded-xl font-bold border transition-all ${textSize === 'xl' ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/5 text-gray-400'}`}
                  >
                    X-Large
                  </button>
                </div>
              </div>

              {/* HIGH CONTRAST */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl">
                <div>
                  <p className="font-bold text-white">High Contrast Overlay</p>
                  <p className="text-gray-500 mt-0.5 text-[10px]">Boost visibility profiles and colors</p>
                </div>
                <button
                  onClick={handleContrastToggle}
                  className={`px-4 py-2 rounded-xl font-bold border transition-all ${highContrast ? 'bg-emeraldGreen/10 border-emeraldGreen text-emeraldGreen' : 'bg-white/5 border-white/10 text-gray-400'}`}
                >
                  {highContrast ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* SIGN LANGUAGE DESK */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl">
                <div>
                  <p className="font-bold text-white">Sign Language Desk</p>
                  <p className="text-gray-500 mt-0.5 text-[10px]">Simulate virtual signer avatar window</p>
                </div>
                <button
                  onClick={() => setSignLanguageActive(!signLanguageActive)}
                  className={`px-4 py-2 rounded-xl font-bold border transition-all ${signLanguageActive ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-white/5 border-white/10 text-gray-400'}`}
                >
                  {signLanguageActive ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </GlassCard>

          {/* SIGN LANGUAGE INTERPRETER WIDGET */}
          {signLanguageActive && (
            <GlassCard className="text-center p-6 border-neonBlue/30">
              <p className="font-bold text-white text-xs mb-3.5 uppercase tracking-wider text-neonBlue">Virtual Sign Language Interpreter</p>
              <div className="relative w-full aspect-video bg-[#0D0D13] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                {/* Simulated visual avatar box */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neonBlue/10 to-transparent"></div>
                <div className="text-center space-y-2 z-10">
                  <div className="w-12 h-12 rounded-full bg-neonBlue/20 border border-neonBlue/30 flex items-center justify-center text-neonBlue text-sm font-bold mx-auto animate-bounce">
                    AI
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block">Signing: "Gate B is fully accessible..."</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* RIGHT COLUMN: ACCESSIBLE AMENITIES */}
        <div className="lg:col-span-7 space-y-6">
          {/* ANNOUNCEMENT LOUDSPEAKER */}
          <GlassCard glowColor="green">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <AudioLines className="w-5 h-5 text-emeraldGreen" />
              <span>Audio Announcements Louder Speaker</span>
            </h3>

            <div className="space-y-3.5">
              {announcements.map((feed, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs gap-4"
                >
                  <p className={`text-gray-300 leading-relaxed ${getTextSizeClass()}`}>{feed}</p>
                  <button
                    onClick={() => handleSpeechTrigger(feed)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-neonBlue/30 transition-all font-semibold shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-neonBlue" />
                    <span>Speak</span>
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* LIST OF ACCESSIBLE PATHWAYS */}
          <GlassCard>
            <h4 className="font-bold text-white text-xs mb-3.5 uppercase tracking-widest text-gray-400">Step-free Access Corridors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-neonBlue font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Elevator Corridor E1</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Located behind Section 104 lobby. Services Tier 1 and Tier 2 seating blocks without escalators.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emeraldGreen font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Accessible Restrooms Zone 2</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Located next to Gate B. Equipped with automatic doors, lower sinks, and emergency alert pull chords.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-stadiumPurple font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Elevator Corridor W3</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Located behind Section 112 lobby. Connects Lower level suites directly with VIP lounge tier.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Tactile Ramp A1</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Step-free ramp entry from Gate A parking lot directly onto the outer stand lobby levels.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default AccessibilityPage;
export { AccessibilityPage as Accessibility };
