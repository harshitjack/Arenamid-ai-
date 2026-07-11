import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Cpu, Lock, Mail, User, Shield, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('fan');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await register(name, email, password, role);
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-neonBlue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-emeraldGreen/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neonBlue to-emeraldGreen p-[1.5px] flex items-center justify-center shadow-neon-blue/30 shadow-lg mb-3">
            <div className="w-full h-full rounded-[14.5px] bg-[#07070A] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-neonBlue" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-neonBlue via-white to-emeraldGreen bg-clip-text text-transparent">ARENAMIND AI</h1>
          <p className="text-xs text-gray-500 font-semibold tracking-widest mt-1">FIFA WORLD CUP 2026</p>
        </div>

        <GlassCard glowColor="green" className="w-full">
          <h2 className="text-xl font-bold text-white mb-6">Create Operator Account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emeraldGreen transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emeraldGreen transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emeraldGreen transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Assigned Role</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emeraldGreen transition-all appearance-none cursor-pointer"
                >
                  <option value="fan" className="bg-[#0D0D13]">Stadium Fan</option>
                  <option value="volunteer" className="bg-[#0D0D13]">Field Volunteer</option>
                  <option value="staff" className="bg-[#0D0D13]">Operations Staff</option>
                  <option value="organizer" className="bg-[#0D0D13]">FIFA Organizer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emeraldGreen to-neonBlue hover:from-emeraldGreen hover:to-neonBlue text-[#07070A] font-bold py-3 rounded-xl shadow-lg shadow-emeraldGreen/20 hover:opacity-90 active:scale-[0.99] transition-all text-sm mt-6"
            >
              {loading ? 'Initializing Interface...' : 'Authorize Operator'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Already registered? <Link to="/login" className="text-emeraldGreen hover:underline">Access Console</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
export default Register;
