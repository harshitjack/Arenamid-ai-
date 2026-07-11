import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Home, MessageSquare, Eye, MapPin, AlertTriangle, 
  Accessibility, Bus, Utensils, Trophy, ClipboardList, 
  LayoutDashboard, User, LogOut, Menu, X, Cpu, CloudRain, ShieldCheck, Activity
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { liveData, connected } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'AI Copilot', path: '/copilot', icon: MessageSquare, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Live Stadium', path: '/stadium', icon: Eye, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Smart Navigation', path: '/navigation', icon: MapPin, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Accessibility', path: '/accessibility', icon: Accessibility, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Transport', path: '/transport', icon: Bus, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Food & Queue', path: '/food', icon: Utensils, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Match Center', path: '/match', icon: Trophy, roles: ['fan', 'volunteer', 'organizer', 'staff'] },
    { name: 'Volunteer Portal', path: '/volunteer', icon: ClipboardList, roles: ['volunteer', 'organizer'] },
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['organizer', 'staff'] },
    { name: 'System Analytics', path: '/analytics', icon: Activity, roles: ['organizer', 'staff'] },
  ];

  // Filter navigation items by role
  const userRole = user?.role || 'fan';
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-[#07070A] flex flex-col md:flex-row relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neonBlue/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* MOBILE HEADER */}
      <header className="md:hidden w-full bg-[#0D0D13]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neonBlue to-emeraldGreen p-[1px] flex items-center justify-center">
            <div className="w-full h-full rounded-[7px] bg-[#07070A] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-neonBlue" />
            </div>
          </div>
          <span className="font-bold tracking-wider bg-gradient-to-r from-neonBlue to-emeraldGreen bg-clip-text text-transparent">ARENAMIND</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-gray-400 hover:text-white"
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0A0F]/90 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* LOGO */}
          <div className="hidden md:flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neonBlue to-emeraldGreen p-[1.5px] flex items-center justify-center shadow-neon-blue/20 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-[#07070A] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-neonBlue animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold tracking-wider bg-gradient-to-r from-neonBlue to-emeraldGreen bg-clip-text text-transparent">ARENAMIND AI</h1>
              <p className="text-[10px] text-gray-500 font-semibold tracking-widest">STADIUM OS</p>
            </div>
          </div>

          {/* SYSTEM HEALTH / SOCKET */}
          <div className="glass rounded-xl p-3 border border-white/5 mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emeraldGreen animate-pulse shadow-neon-green/50 shadow-md' : 'bg-red-500'} `}></span>
              <span className="text-gray-400 font-medium">Socket Gateway</span>
            </div>
            <span className="text-[10px] text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded font-mono">FIFA 26</span>
          </div>

          {/* NAV LINKS */}
          <nav className="space-y-1.5">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent
                  ${isActive 
                    ? 'bg-gradient-to-r from-neonBlue/10 to-emeraldGreen/5 text-neonBlue border-neonBlue/10 shadow-[0_0_15px_rgba(0,242,254,0.05)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/5'}
                `}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* PROFILE & LOGOUT */}
        <div className="border-t border-white/5 pt-6 space-y-3">
          {user && (
            <div 
              className="flex items-center gap-3 px-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neonBlue rounded-lg" 
              role="button"
              tabIndex={0}
              onClick={() => navigate('/profile')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/profile');
                }
              }}
              aria-label="View user profile"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-stadiumPurple to-neonBlue flex items-center justify-center text-sm font-bold text-white shadow-neon-blue/10 shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{user.role}</p>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 hover:border hover:border-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
        {/* TELEMETRY TOP BAR */}
        <div className="bg-[#0D0D13]/40 backdrop-blur-md border-b border-white/5 py-3.5 px-6 flex flex-wrap items-center justify-between gap-4 z-20">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">LIVE Crowd:</span>
              <span className="font-mono font-bold text-white glow-blue">{liveData.crowdCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-neonBlue" />
              <span className="text-gray-300 font-medium">{liveData.weather.temp}°C / {liveData.weather.condition}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">AI Core:</span>
              <span className="text-emeraldGreen font-mono font-bold glow-green">98.7% Conf.</span>
            </div>
          </div>

          {/* ACTIVE MATCH STATUS INDICATOR */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="font-bold text-gray-200">LIVE MATCH:</span>
            </div>
            <span className="font-bold text-neonBlue">{liveData.match.homeTeam} {liveData.match.homeScore} - {liveData.match.awayScore} {liveData.match.awayTeam}</span>
            <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-1.5 py-0.5 rounded font-bold">MIN {liveData.match.minute}'</span>
          </div>
        </div>

        {/* MAIN BODY VIEW */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
