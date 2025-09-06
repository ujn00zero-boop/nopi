import React from 'react';
import { Home, History, User, HandCoins } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const DesktopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/lend', icon: HandCoins, label: 'Lend' },
    { path: '/account', icon: User, label: 'Account' },
  ];

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DesktopNav;