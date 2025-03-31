import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coins, Users, LineChart, Settings, Flame } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-tik-dark border-t border-tik-gray md:left-0 md:top-0 md:w-20 md:h-screen md:border-r z-50">
      <div className="flex flex-row md:flex-col h-full">
        <div className="hidden md:flex items-center justify-center h-20 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-tik-pink to-tik-cyan p-[2px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col justify-around md:justify-start w-full px-2 md:space-y-4">
          <NavItem 
            to="/" 
            icon={<Flame />} 
            text="Trending"
            isActive={location.pathname === '/'} 
          />
          <NavItem 
            to="/creators" 
            icon={<Users />} 
            text="Creators"
            isActive={location.pathname === '/creators'} 
          />
          <NavItem 
            to="/tokens" 
            icon={<LineChart />} 
            text="Portfolio"
            isActive={location.pathname === '/tokens'} 
          />
          <NavItem 
            to="/settings" 
            icon={<Settings />} 
            text="Settings"
            isActive={location.pathname === '/settings'} 
          />
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ 
  to, 
  icon, 
  text, 
  isActive 
}: { 
  to: string; 
  icon: React.ReactNode; 
  text: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300
      ${isActive 
        ? 'text-white scale-110' 
        : 'text-gray-500 hover:text-gray-300'}`}
  >
    {icon}
    <span className="text-xs md:hidden">{text}</span>
  </Link>
);