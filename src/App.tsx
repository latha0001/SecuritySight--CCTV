import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './components/SignIn';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import Scenes from './pages/Scenes';
import Incidents from './pages/Incidents';
import Users from './pages/Users';
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SecureSight...</p>
        </div>
      </div>
    );
  }
  if (!user) {return <SignIn />;}
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cameras':
        return <Cameras />;
      case 'scenes':
        return <Scenes />;
      case 'incidents':
        return <Incidents />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;