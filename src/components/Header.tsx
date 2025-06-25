import React, { useState } from 'react';
import { LogOut, Users, DollarSign, Calculator, Settings, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, activeView, onViewChange }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Calculator },
    { id: 'settings', name: 'Configurações', icon: Settings, adminOnly: true }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'hr': return 'RRHH';
      case 'viewer': return 'Consultor';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">PayrollPro</h1>
            </div>
            
            <nav className="flex space-x-4 relative">
              {navigation.map((item) => {
                const Icon = item.icon;
                if (item.adminOnly && user.role !== 'admin') {
                  return null;
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </button>
                );
              })}

              {/* Menú desplegable Trabajadores */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown(true)}
                onMouseLeave={() => setOpenDropdown(false)}
              >
                <button
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    ['employees', 'payroll'].includes(activeView)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setOpenDropdown((v) => !v)}
                  type="button"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Trabajadores
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {openDropdown && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { setOpenDropdown(false); onViewChange('employees'); }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 ${activeView === 'employees' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      <Users className="w-4 h-4" /> Funcionários
                    </button>
                    <button
                      onClick={() => { setOpenDropdown(false); onViewChange('payroll'); }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 ${activeView === 'payroll' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      <DollarSign className="w-4 h-4" /> Nómina
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};