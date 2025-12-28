
import React from 'react';
import { Home, Utensils, Target, User, PlusCircle } from 'lucide-react';
import { AppTab } from '../types';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onAddClick: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, onAddClick, children }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-white shadow-2xl">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/80 ios-blur sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {activeTab === 'dashboard' && '今日概览'}
          {activeTab === 'meals' && '饮食记录'}
          {activeTab === 'tasks' && '健康挑战'}
          {activeTab === 'profile' && '个人中心'}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 pt-4 bg-gray-50">
        {children}
      </main>

      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 ios-blur border-t border-gray-100 safe-bottom z-20">
        <div className="flex justify-around items-center h-16 relative">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-gray-400'}`}
          >
            <Home size={22} />
            <span className="text-[10px] font-medium">首页</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('meals')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'meals' ? 'text-emerald-500' : 'text-gray-400'}`}
          >
            <Utensils size={22} />
            <span className="text-[10px] font-medium">足迹</span>
          </button>

          {/* Special Center Button */}
          <button 
            onClick={onAddClick}
            className="flex flex-col items-center justify-center -translate-y-4 bg-emerald-500 text-white rounded-full p-3 shadow-lg shadow-emerald-200 active:scale-90 transition-transform"
          >
            <PlusCircle size={28} />
          </button>

          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'tasks' ? 'text-emerald-500' : 'text-gray-400'}`}
          >
            <Target size={22} />
            <span className="text-[10px] font-medium">任务</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-emerald-500' : 'text-gray-400'}`}
          >
            <User size={22} />
            <span className="text-[10px] font-medium">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
