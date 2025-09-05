import React from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import { Usuario } from '../../types';

interface HeaderProps {
  user: Usuario;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-purple-600">
              Centro Estético
            </h1>
            <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {user.rol === 'cosmiatra' ? 'Cosmiatróloga' : 
               user.rol === 'asistente' ? 'Asistente' : 'Recepcionista'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user.nombre}
                </span>
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}