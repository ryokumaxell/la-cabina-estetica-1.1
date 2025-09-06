import React, { useState } from 'react';
import { Usuario } from '../../types';
import { EditarPerfil } from './EditarPerfil';
import { GestionServicios } from './GestionServicios';

interface ConfiguracionProps {
  user: Usuario;
  onUpdateUser: (userData: Partial<Usuario>) => Promise<void>;
}

type ConfigSection = 'perfil' | 'servicios';

export function Configuracion({ user, onUpdateUser }: ConfiguracionProps) {
  const [currentSection, setCurrentSection] = useState<ConfigSection>('perfil');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Configuración
      </h1>

      {/* Navegación entre secciones */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setCurrentSection('perfil')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'perfil'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Mi Perfil
          </button>
          <button
            onClick={() => setCurrentSection('servicios')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'servicios'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Servicios
          </button>
        </nav>
      </div>

      {/* Contenido de la sección actual */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {currentSection === 'perfil' && (
          <EditarPerfil user={user} onUpdateUser={onUpdateUser} />
        )}
        
        {currentSection === 'servicios' && (
          <GestionServicios />
        )}
      </div>
    </div>
  );
}