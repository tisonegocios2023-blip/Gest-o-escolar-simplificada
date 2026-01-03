import React from 'react';
import { LayoutDashboard, Users, DollarSign, FileText, LogOut, GraduationCap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Alunos', icon: <Users size={20} /> },
    { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
    { id: 'reports', label: 'Relatórios AI', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-700">
        <GraduationCap className="text-blue-400" size={32} />
        <div>
          <h1 className="text-xl font-bold">EduFinance</h1>
          <p className="text-xs text-slate-400">Gestão Escolar</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-primary text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="mb-4 px-4">
          <p className="text-sm font-medium">{userRole}</p>
          <p className="text-xs text-slate-500">Logado agora</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};