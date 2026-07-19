import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Cpu, Lock, Mail, User, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = 'fan';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password strength helper
  const getPasswordStrength = (pw: string): { label: string; score: number } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return { label: labels[score] || '', score };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

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

  const strengthColors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emeraldGreen'];
  const strengthTextColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emeraldGreen'];

  return (
    <main className="min-h-screen bg-[#07070A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-neonBlue/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-emeraldGreen/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>

      <div className="w-full max-w-md relative z-10">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neonBlue to-emeraldGreen p-[1.5px] flex items-center justify-center shadow-neon-blue/30 shadow-lg mb-3" aria-hidden="true">
            <div className="w-full h-full rounded-[14.5px] bg-[#07070A] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-neonBlue" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-neonBlue via-white to-emeraldGreen bg-clip-text text-transparent">ARENAMIND AI</h1>
          <p className="text-xs text-gray-500 font-semibold tracking-widest mt-1">FIFA WORLD CUP 2026</p>
        </div>

        <GlassCard glowColor="green" className="w-full">
          <h2 className="text-xl font-bold text-white mb-6" id="register-heading">Create Fan Account</h2>

          {/* Error alert region - announced immediately to screen readers */}
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            id="register-error"
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
            aria-labelledby="register-heading"
            noValidate
          >
            <div>
              <label htmlFor="register-name" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emeraldGreen focus:ring-2 focus:ring-emeraldGreen/30 transition-all"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-required="true"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emeraldGreen focus:ring-2 focus:ring-emeraldGreen/30 transition-all"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={error ? 'register-error' : undefined}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emeraldGreen focus:ring-2 focus:ring-emeraldGreen/30 transition-all"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-describedby="password-strength-hint"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emeraldGreen/30 rounded-md p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2" id="password-strength-hint">
                  <div className="flex gap-1 mb-1" role="meter" aria-label="Password strength" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={4}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strengthColors[strength.score] : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-bold ${strengthTextColors[strength.score] || 'text-gray-500'}`}>
                    Password strength: {strength.label || 'Very Weak'}
                  </p>
                </div>
              )}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
              className="w-full bg-gradient-to-r from-emeraldGreen to-neonBlue hover:from-emeraldGreen hover:to-neonBlue text-[#07070A] font-bold py-3 rounded-xl shadow-lg shadow-emeraldGreen/20 hover:opacity-90 active:scale-[0.99] transition-all text-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emeraldGreen/50"
            >
              {loading
                ? 'Initializing Interface...'
                : <><CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Create Fan Account</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Already registered? <Link to="/login" className="text-emeraldGreen hover:underline focus:underline focus:outline-none">Access Console</Link>
          </p>
        </GlassCard>
      </div>
    </main>
  );
};
export default Register;
