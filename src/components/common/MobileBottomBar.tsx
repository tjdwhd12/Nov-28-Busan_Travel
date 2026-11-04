import React from 'react';
import { Calendar, MapPin, Calculator } from 'lucide-react';

interface MobileBottomBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'day-1', label: '당일 코스', icon: Calendar },
    { id: 'map', label: '코스 지도', icon: MapPin },
    { id: 'budget', label: '예산·예매', icon: Calculator },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-3 items-center h-16 max-w-sm mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className={`text-[11px] tracking-tight mt-1 truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
