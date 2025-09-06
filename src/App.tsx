import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ClientesList } from './components/Clientes/ClientesList';
import { CitasList } from './components/Citas/CitasList';
import { ProcedimientosList } from './components/Procedimientos/ProcedimientosList';
import { Reportes } from './components/Reportes/Reportes';
import { Configuracion } from './components/Configuracion/Configuracion';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { ViewMode } from './types';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { 
    clientes, 
    procedimientos, 
    citas, 
    loading,
    error,
    addCliente, 
    updateCliente, 
    deleteCliente,
    addProcedimiento,
    addCita,
    updateCita,
    deleteCita,
    refreshData
  } = useData();

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Cargando datos de La Cabina Estética..." />
      </div>
    );
  }

  // Mostrar error si hay problemas de conexión
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorAlert 
            message={`Error de conexión: ${error}. Verifica tu configuración de Supabase.`} 
            onDismiss={() => window.location.reload()}
          />
          <div className="mt-4 text-center">
            <button 
              onClick={refreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard clientes={clientes} citas={citas} procedimientos={procedimientos} />;
      case 'clientes':
        return (
          <ClientesList 
            clientes={clientes}
            procedimientos={procedimientos}
            onAddCliente={addCliente}
            onUpdateCliente={updateCliente}
            onDeleteCliente={deleteCliente}
          />
        );
      case 'citas':
        return (
          <CitasList 
            citas={citas}
            clientes={clientes}
            onAddCita={addCita}
            onUpdateCita={updateCita}
            onDeleteCita={deleteCita}
          />
        );
      case 'procedimientos':
        return (
          <ProcedimientosList 
            procedimientos={procedimientos}
            clientes={clientes}
            onAddProcedimiento={addProcedimiento}
          />
        );
      case 'reportes':
        return <Reportes clientes={clientes} procedimientos={procedimientos} citas={citas} />;
      case 'configuracion':
        return <Configuracion user={user!} onUpdateUser={async () => {
          // TODO: Implementar actualización de usuario en Supabase
          console.log('Actualizando usuario...');
        }} />;
      default:
        return <Dashboard clientes={clientes} citas={citas} procedimientos={procedimientos} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header user={user!} onLogout={logout} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;