import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  Camera,
  Settings
} from 'lucide-react';
import { ViewMode } from '../../types';
import { clsx } from 'clsx';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', name: 'Clientes', icon: Users },
  { id: 'citas', name: 'Citas', icon: Calendar },
  { id: 'procedimientos', name: 'Procedimientos', icon: FileText },
  { id: 'reportes', name: 'Reportes', icon: BarChart3 },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as ViewMode)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon size={20} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            <Camera size={20} />
            Galería
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            <Settings size={20} />
            Configuración
          </button>
        </div>
      </nav>
    </aside>
  );
}