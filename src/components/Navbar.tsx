import React from 'react';
import { Home, Camera, Eye, AlertTriangle, Users, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
interface NavbarProps {currentPage: string; onNavigate: (page: string) => void;}
const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SECURESIGHT</span>
          </div>
          <div className="flex items-center space-x-6">
            <NavItem icon={Home} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')}/>
            <NavItem icon={Camera} label="Cameras" active={currentPage === 'cameras'} onClick={() => onNavigate('cameras')}/>
            <NavItem icon={Eye} label="Scenes" active={currentPage === 'scenes'} onClick={() => onNavigate('scenes')}/>
            <NavItem icon={AlertTriangle} label="Incidents" active={currentPage === 'incidents'} onClick={() => onNavigate('incidents')}/>
            <NavItem icon={Users} label="Users" active={currentPage === 'users'} onClick={() => onNavigate('users')}/>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleSignOut} className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-white text-sm font-medium">{user?.name}</div>
            <div className="text-slate-400 text-xs">{user?.email}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
interface NavItemProps {icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; onClick: () => void;}
const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
    active 
      ? 'bg-blue-600 text-white' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800'
  }`}
  onClick={onClick}>
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);
export default Navbar;