import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Cpu, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <main className="min-h-screen bg-[#07070A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-neonBlue/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-stadiumPurple/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>

      <div className="w-full max-w-md relative z-10">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neonBlue to-emeraldGreen p-[1.5px] flex items-center justify-center shadow-neon-blue/30 shadow-lg mb-3" aria-hidden="true">
            <div className="w-full h-full rounded-[14.5px] bg-[#07070A] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-neonBlue animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-neonBlue via-white to-emeraldGreen bg-clip-text text-transparent">ARENAMIND AI</h1>
          <p className="text-xs text-gray-500 font-semibold tracking-widest mt-1">FIFA WORLD CUP 2026</p>
        </div>

        <GlassCard glowColor="blue" className="w-full">
          <h2 className="text-xl font-bold text-white mb-6" id="login-heading">Login to Stadium OS</h2>

          {/* Error alert region - announced immediately to screen readers */}
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            id="login-error"
          >
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-sm mb-5">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-labelledby="login-heading"
            noValidate
          >
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neonBlue transition-all"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neonBlue transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-required="true"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
              className="w-full bg-gradient-to-r from-neonBlue to-emeraldGreen hover:from-neonBlue hover:to-emeraldGreen text-[#07070A] font-bold py-3 rounded-xl shadow-lg shadow-neon-blue/20 hover:opacity-90 active:scale-[0.99] transition-all text-sm mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Booting OS Core...' : 'Connect to Console'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            New operator? <Link to="/register" className="text-neonBlue hover:underline focus:underline focus:outline-none">Request access</Link>
          </p>
        </GlassCard>

        {/* MOCK LOGINS DRAWER */}
        <section aria-label="Developer sandbox quick login options" className="mt-6 glass rounded-2xl border border-white/5 p-4 text-xs">
          <p className="font-bold text-gray-400 mb-2.5 uppercase tracking-wider text-[10px]" id="sandbox-label">Developer Sandbox Logins</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]" role="group" aria-labelledby="sandbox-label">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@arenamind.com', 'admin123')}
              aria-label="Quick login as Organizer Admin with admin@arenamind.com"
              className="bg-white/5 hover:bg-white/10 text-left p-2 rounded-lg border border-white/5 hover:border-neonBlue/20 text-gray-300 flex flex-col focus:outline-none focus:ring-1 focus:ring-neonBlue"
            >
              <span className="font-bold text-neonBlue">Organizer (Admin)</span>
              <span>admin@arenamind.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('volunteer@arenamind.com', 'volunteer123')}
              aria-label="Quick login as Volunteer with volunteer@arenamind.com"
              className="bg-white/5 hover:bg-white/10 text-left p-2 rounded-lg border border-white/5 hover:border-emeraldGreen/20 text-gray-300 flex flex-col focus:outline-none focus:ring-1 focus:ring-emeraldGreen"
            >
              <span className="font-bold text-emeraldGreen">Volunteer</span>
              <span>volunteer@arenamind.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('staff@arenamind.com', 'staff123')}
              aria-label="Quick login as Stadium Staff with staff@arenamind.com"
              className="bg-white/5 hover:bg-white/10 text-left p-2 rounded-lg border border-white/5 hover:border-stadiumPurple/20 text-gray-300 flex flex-col focus:outline-none focus:ring-1 focus:ring-stadiumPurple"
            >
              <span className="font-bold text-stadiumPurple">Stadium Staff</span>
              <span>staff@arenamind.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('fan@arenamind.com', 'fan123')}
              aria-label="Quick login as Fan Profile with fan@arenamind.com"
              className="bg-white/5 hover:bg-white/10 text-left p-2 rounded-lg border border-white/5 hover:border-amber-400/20 text-gray-300 flex flex-col focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <span className="font-bold text-amber-400">Fan Profile</span>
              <span>fan@arenamind.com</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
export default Login;
