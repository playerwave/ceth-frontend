import React from "react";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ 
  activeTab, 
  onTabChange, 
  tabs, 
  className = "" 
}) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 text-lg font-semibold transition-colors duration-200 ${
            activeTab === tab.id
              ? "text-[#1E3A8A] border-b-4 border-[#1E3A8A]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="flex items-center gap-2">
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            <span>{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TabBar;
