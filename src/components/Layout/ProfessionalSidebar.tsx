import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  Camera,
  Settings,
  Heart,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { ViewMode } from '../../types';
import { clsx } from 'clsx';

interface ProfessionalSidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

// Menú específico para dermatólogas/cosmetólogas
const professionalNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', name: 'Mis Pacientes', icon: Users },
  { id: 'citas', name: 'Consultas', icon: Calendar },
  { id: 'procedimientos', name: 'Tratamientos', icon: Stethoscope },
  { id: 'reportes', name: 'Análisis', icon: BarChart3 },
  { id: 'configuracion', name: 'Mi Perfil', icon: Settings },
];

export function ProfessionalSidebar({ currentView, onViewChange }: ProfessionalSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <LayoutDashboard size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:relative z-40 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border-r border-pink-200 dark:border-gray-700 h-full',
          'transform transition-all duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          isExpanded ? 'w-64' : 'w-16'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-pink-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                <Heart size={20} className="text-white" />
              </div>
              {isExpanded && (
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    FRODYTA
                  </h2>
                  <p className="text-xs text-pink-600 dark:text-pink-400">Cuidado Profesional</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-2">
              {professionalNavigation.map((item) => {
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
                          ? 'bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 shadow-sm'
                          : 'text-pink-600 hover:bg-pink-100/50 hover:text-pink-700 dark:text-pink-300 dark:hover:bg-pink-900/20 dark:hover:text-pink-200'
                      )}
                      title={!isExpanded ? item.name : ''}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {isExpanded && (
                        <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-pink-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-pink-600 dark:text-pink-300',
                  'hover:bg-pink-100/50 hover:text-pink-700 dark:hover:bg-pink-900/20 rounded-lg transition-all duration-200',
                  isExpanded ? 'justify-start' : 'justify-center'
                )}
                title={!isExpanded ? 'Galería' : ''}
              >
                <Camera size={20} className="flex-shrink-0" />
                {isExpanded && <span className="whitespace-nowrap overflow-hidden">Galería</span>}
              </button>
            </div>
            
            {isExpanded && (
              <div className="mt-3 p-3 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
                  <Sparkles size={16} />
                  <span className="text-xs font-medium">Cuidado Especializado</span>
                </div>
                <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                  Transformando vidas a través del cuidado de la piel
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}