import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Lightbulb, 
  Activity, 
  MessageSquare, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Flame
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';

const menuItems = [
  { path: '/', icon: Home, label: 'Menu Utama' },
  { path: '/rekomendasi', icon: Lightbulb, label: 'Rekomendasi' },
  { path: '/detail-boiler', icon: Activity, label: 'Detail Boiler' },
  { path: '/ai-copilot', icon: MessageSquare, label: 'AI Copilot' },
  { path: '/operator', icon: Settings, label: 'Operator' },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Boiler Cofiring</h1>
            <p className="text-xs text-slate-400">Monitoring System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-orange-500 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Theme</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-slate-300 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="px-3 py-2 bg-slate-800 rounded-lg">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
        </div>
        
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
