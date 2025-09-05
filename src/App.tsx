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
import { ViewMode } from './types';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { 
    clientes, 
    procedimientos, 
    citas, 
    addCliente, 
    updateCliente, 
    deleteCliente,
    addProcedimiento,
    addCita,
    updateCita,
    deleteCita
  } = useData();

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
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
      default:
        return <Dashboard clientes={clientes} citas={citas} procedimientos={procedimientos} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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