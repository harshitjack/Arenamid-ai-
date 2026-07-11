import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { User, Shield, Languages, Check, Eye, HelpCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [favTeam, setFavTeam] = useState(user?.preferences?.favoriteTeam || '');
  
  // Dietary checkboxes
  const [dietary, setDietary] = useState<string[]>(user?.preferences?.dietaryRestrictions || []);

  const handleDietToggle = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(prev => prev.filter(d => d !== item));
    } else {
      setDietary(prev => [...prev, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      favoriteTeam: favTeam,
      dietaryRestrictions: dietary
    });
    alert('User preference parameters updated inside Local Sandbox!');
  };

  const diets = ['halal', 'vegetarian', 'kids', 'healthy'];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <User className="w-8 h-8 text-neonBlue" />
          <span>Operator Profile Controls</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Review operator credentials, adjust language preferences, and configure dietary parameters.
        </p>
      </div>

      <GlassCard glowColor="blue">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* USER INFO BLOCK */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neonBlue to-emeraldGreen flex items-center justify-center text-2xl font-bold text-white shadow-neon-blue/20 shadow-md">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name}</h3>
              <p className="text-gray-400">{user?.email}</p>
              <span className="inline-block bg-neonBlue/10 border border-neonBlue/20 text-neonBlue text-[9px] font-bold px-2 py-0.5 rounded uppercase mt-1">
                Role: {user?.role}
              </span>
            </div>
          </div>

          {/* DYNAMIC FIELDSET */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Favorite World Cup Team</label>
              <input
                type="text"
                value={favTeam}
                onChange={(e) => setFavTeam(e.target.value)}
                placeholder="e.g. USA or Mexico"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-neonBlue transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Announcements Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0D0D13] border border-white/10 rounded-xl py-2.5 px-3.5 text-white"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
              </select>
            </div>
          </div>

          {/* DIETARY SELECTIONS */}
          <div className="space-y-2">
            <label className="block text-gray-400 font-bold uppercase tracking-wider">Dietary Preferences</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {diets.map((diet) => {
                const checked = dietary.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => handleDietToggle(diet)}
                    className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl border text-left font-semibold capitalize transition-all
                      ${checked 
                        ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
                  >
                    <span>{diet}</span>
                    {checked && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Concessions view will prioritize highlighting items matching selected diets.</p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-neonBlue to-emeraldGreen text-[#07070A] font-bold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm mt-8"
          >
            <span>Update Parameters</span>
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
export default Profile;
