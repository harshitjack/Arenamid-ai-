import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Cpu, Lock, Mail, AlertCircle, Eye, EyeOff, Zap, ChevronRight } from 'lucide-react';

// Demo accounts: only roles and display info — NO passwords stored in client code
const DEMO_ACCOUNTS = [
  {
    role: 'fan',
    label: 'Stadium Fan',
    description: 'Fan experience view',
    textColor: 'text-amber-400',
    ringClass: 'focus:ring-amber-400',
    borderClass: 'hover:border-amber-400/40',
  },
];

export const Login: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  // Standard form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click secure demo login — sends only role, zero passwords from client
  const handleDemoLogin = useCallback(async (role: string, label: string) => {
    setError('');
    setDemoLoading(label);
    try {
      await demoLogin(role);
      navigate('/');
    } catch (err: any) {
      setError(`Demo login failed: ${err.message || 'Please try again.'}`);
    } finally {
      setDemoLoading(null);
    }
  }, [demoLogin, navigate]);

  return (
    <main className="min-h-screen bg-[#07070A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-neonBlue/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-stadiumPurple/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-md relative z-10">

        {/* ===== INSTANT DEMO ACCESS BANNER ===== */}
        <section
          aria-labelledby="demo-section-heading"
          className="mb-6 rounded-2xl border border-neonBlue/30 bg-gradient-to-br from-neonBlue/10 via-emeraldGreen/5 to-transparent p-5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-neonBlue" aria-hidden="true" />
            <h2 id="demo-section-heading" className="text-sm font-extrabold text-white tracking-wide">⚡ Instant Demo Access</h2>
            <span className="ml-auto text-[10px] bg-emeraldGreen/20 text-emeraldGreen border border-emeraldGreen/30 rounded-full px-2 py-0.5 font-bold">NO SIGN-UP</span>
          </div>
          <p className="text-[11px] text-gray-400 mb-3">Click below to instantly explore the app — no email or password required.</p>

          <div className="grid grid-cols-1 gap-2" role="group" aria-label="One-click demo login options">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                id={`demo-btn-${account.role}`}
                onClick={() => handleDemoLogin(account.role, account.label)}
                disabled={demoLoading !== null}
                aria-busy={demoLoading === account.label}
                aria-label={`Instantly enter as ${account.label} — ${account.description}`}
                className={`group relative bg-white/5 hover:bg-white/10 text-left p-3.5 rounded-xl border border-white/8 ${account.borderClass} text-gray-300 flex flex-col gap-0.5 transition-all duration-200 focus:outline-none ${account.ringClass} focus:ring-2 disabled:opacity-50 disabled:cursor-wait active:scale-[0.98]`}
              >
                {demoLoading === account.label ? (
                  <span className="text-xs font-bold text-white animate-pulse">Entering...</span>
                ) : (
                  <>
                    <span className={`text-xs font-extrabold ${account.textColor}`}>{account.label}</span>
                    <span className="text-[10px] text-gray-500">{account.description}</span>
                    <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" aria-hidden="true" />
                  </>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ===== LOGO ===== */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-neonBlue to-emeraldGreen p-[1.5px] flex items-center justify-center shadow-lg mb-2" aria-hidden="true">
            <div className="w-full h-full rounded-[13px] bg-[#07070A] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-neonBlue animate-pulse" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-neonBlue via-white to-emeraldGreen bg-clip-text text-transparent">ARENAMIND AI</h1>
          <p className="text-[10px] text-gray-500 font-semibold tracking-widest mt-0.5">FIFA WORLD CUP 2026</p>
        </div>

        {/* ===== MANUAL LOGIN FORM ===== */}
        <GlassCard glowColor="blue" className="w-full">
          <h2 className="text-base font-bold text-white mb-4" id="login-form-heading">Or sign in with credentials</h2>

          <div role="alert" aria-live="assertive" aria-atomic="true" id="login-error-region">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3" aria-labelledby="login-form-heading" noValidate>
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neonBlue focus:ring-2 focus:ring-neonBlue/30 transition-all"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={error ? 'login-error-region' : undefined}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neonBlue focus:ring-2 focus:ring-neonBlue/30 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-required="true"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neonBlue/30 rounded-md p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
              className="w-full bg-gradient-to-r from-neonBlue to-emeraldGreen text-[#07070A] font-bold py-2.5 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.99] transition-all text-sm mt-4 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neonBlue/50"
            >
              {loading ? 'Connecting...' : 'Connect to Console'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            New operator? <Link to="/register" className="text-neonBlue hover:underline focus:underline focus:outline-none">Request access</Link>
          </p>
        </GlassCard>
      </div>
    </main>
  );
};
export default Login;
