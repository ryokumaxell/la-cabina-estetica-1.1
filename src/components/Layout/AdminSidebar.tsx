import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt,
  Settings,
} from 'lucide-react';
import { ViewMode } from '../../types';
import { clsx } from 'clsx';

interface AdminSidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

// Menú específico para el administrador
const adminNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', name: 'Clientes', icon: Users },
  { id: 'facturacion', name: 'Facturación', icon: Receipt },
  { id: 'configuracion', name: 'Configuración', icon: Settings },
];

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isHovered || isMobileOpen;

  return (
    <>
      {/* Botón de menú para móviles */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        aria-label="Menú"
      >
        {isMobileOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

      {/* Overlay para móviles */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          'fixed md:relative z-40 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full',
          'transform transition-all duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          isExpanded ? 'w-64' : 'w-16'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {isExpanded && (
              <h2 className="text-lg font-bold text-blue-600">Panel Admin</h2>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-2">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onViewChange(item.id as ViewMode);
                        setIsMobileOpen(false);
                      }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                        isExpanded ? 'justify-start' : 'justify-center',
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                      )}
                      title={!isExpanded ? item.name : ''}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}