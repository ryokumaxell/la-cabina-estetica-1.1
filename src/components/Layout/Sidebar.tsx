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
  { id: 'configuracion', name: 'Configuración', icon: Settings },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full">
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
                      ? 'bg-purple-100 dark:bg-purple-600 text-purple-700 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Icon size={20} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
            <Camera size={20} />
            Galería
          </button>
        </div>
      </nav>
    </aside>
  );
}