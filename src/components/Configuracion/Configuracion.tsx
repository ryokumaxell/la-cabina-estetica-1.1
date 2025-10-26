import { useState } from 'react';
import { Usuario } from '../../types';
import { User, Briefcase, Bell, Clock, FileText, Package, Calendar, MessageSquare, Users } from 'lucide-react';
import { EditarPerfil } from './EditarPerfil';
import { GestionServicios } from './GestionServicios';
import GestionAdministradores from './GestionAdministradores';

interface ConfiguracionProps {
  user: Usuario;
  onUpdateUser: (userData: Partial<Usuario>) => Promise<void>;
}

type ConfigSection = 'perfil' | 'servicios' | 'administradores' | 'notificaciones' | 'horarios' | 'plantillas' | 'productos' | 'citas' | 'recordatorios';

const sections = [
  { id: 'perfil', name: 'Mi Perfil', icon: User },
  { id: 'servicios', name: 'Servicios', icon: Briefcase },
  { id: 'administradores', name: 'Administradores', icon: Users },
  { id: 'notificaciones', name: 'Notificaciones', icon: Bell },
  { id: 'horarios', name: 'Horarios', icon: Clock },
  { id: 'plantillas', name: 'Consentimientos', icon: FileText },
  { id: 'productos', name: 'Productos', icon: Package },
  { id: 'citas', name: 'Config. Citas', icon: Calendar },
  { id: 'recordatorios', name: 'Recordatorios', icon: MessageSquare },
];

export function Configuracion({ user, onUpdateUser }: ConfiguracionProps) {
  const [currentSection, setCurrentSection] = useState<ConfigSection>('perfil');

  const renderSection = () => {
    switch (currentSection) {
      case 'perfil':
        return <EditarPerfil user={user} onUpdateUser={onUpdateUser} />;
      case 'servicios':
        return <GestionServicios />;
      case 'administradores':
        return <GestionAdministradores />;
      case 'notificaciones':
        return <div className="text-gray-600 dark:text-gray-400">Sección de notificaciones (próximamente)</div>;
      case 'horarios':
        return <div className="text-gray-600 dark:text-gray-400">Sección de horarios (próximamente)</div>;
      case 'plantillas':
        return <div className="text-gray-600 dark:text-gray-400">Sección de plantillas (próximamente)</div>;
      case 'productos':
        return <div className="text-gray-600 dark:text-gray-400">Sección de productos (próximamente)</div>;
      case 'citas':
        return <div className="text-gray-600 dark:text-gray-400">Sección de configuración de citas (próximamente)</div>;
      case 'recordatorios':
        return <div className="text-gray-600 dark:text-gray-400">Sección de recordatorios (próximamente)</div>;
      default:
        return <EditarPerfil user={user} onUpdateUser={onUpdateUser} />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Configuración
        </h1>
        
        {/* Pestañas de navegación */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap gap-1 -mb-px">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = currentSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id as ConfigSection)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-frodyta-primary text-frodyta-primary dark:text-frodyta-primary'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon size={16} />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenido de la sección actual */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {renderSection()}
      </div>
    </div>
  );
}