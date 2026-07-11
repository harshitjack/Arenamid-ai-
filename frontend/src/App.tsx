import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { AICopilot } from './pages/AICopilot';
import { LiveStadium } from './pages/LiveStadium';
import { SmartNavigation } from './pages/SmartNavigation';
import { EmergencyCenter } from './pages/EmergencyCenter';
import { Accessibility } from './pages/Accessibility';
import { Transport } from './pages/Transport';
import { Food } from './pages/Food';
import { MatchCenter } from './pages/MatchCenter';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard pages wrapped in Layout */}
            <Route path="/" element={<ProtectedRoute><DashboardLayout><Home /></DashboardLayout></ProtectedRoute>} />
            <Route path="/copilot" element={<ProtectedRoute><DashboardLayout><AICopilot /></DashboardLayout></ProtectedRoute>} />
            <Route path="/stadium" element={<ProtectedRoute><DashboardLayout><LiveStadium /></DashboardLayout></ProtectedRoute>} />
            <Route path="/navigation" element={<ProtectedRoute><DashboardLayout><SmartNavigation /></DashboardLayout></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><DashboardLayout><EmergencyCenter /></DashboardLayout></ProtectedRoute>} />
            <Route path="/accessibility" element={<ProtectedRoute><DashboardLayout><Accessibility /></DashboardLayout></ProtectedRoute>} />
            <Route path="/transport" element={<ProtectedRoute><DashboardLayout><Transport /></DashboardLayout></ProtectedRoute>} />
            <Route path="/food" element={<ProtectedRoute><DashboardLayout><Food /></DashboardLayout></ProtectedRoute>} />
            <Route path="/match" element={<ProtectedRoute><DashboardLayout><MatchCenter /></DashboardLayout></ProtectedRoute>} />
            
            <Route path="/volunteer" element={
              <ProtectedRoute allowedRoles={['volunteer', 'organizer']}>
                <DashboardLayout>
                  <VolunteerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['organizer', 'staff']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['organizer', 'staff']}>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
export { App };
