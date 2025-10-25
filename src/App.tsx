import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { AdminSidebar } from './components/Layout/AdminSidebar';
import { ProfessionalSidebar } from './components/Layout/ProfessionalSidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { ProfessionalDashboard } from './components/Dashboard/ProfessionalDashboard';
import { ClientesList } from './components/Clientes/ClientesList';
import { CitasList } from './components/Citas/CitasList';
import { ProcedimientosList } from './components/Procedimientos/ProcedimientosList';
import { Reportes } from './components/Reportes/Reportes';
import { Finanzas } from './components/Finanzas/Finanzas';
import { Configuracion } from './components/Configuracion/Configuracion';
import { Facturacion } from './components/Facturacion/Facturacion';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { ViewMode } from './types';

function App() {
  const { user, isAuthenticated, isLoading, login, loginWithGoogle, logout } = useAuth();
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
  
  // Verificar el tipo de usuario
  const isAdmin = user?.email === 'leonel.acosta11@gmail.com';
  const isProfessional = !isAdmin && isAuthenticated; // Cualquier otro usuario autenticado es profesional

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Verificando autenticación..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} onGoogleLogin={loginWithGoogle} />;
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
            message={`Error: ${error}`} 
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
    // Si es el administrador y está en la vista dashboard, mostrar el panel de administrador
    if (isAdmin && currentView === 'dashboard') {
      return <AdminDashboard />;
    }
    
    // Si es el administrador y está en la vista facturación
    if (isAdmin && currentView === 'facturacion') {
      return <Facturacion />;
    }
    
    // Si es un profesional (dermatólogo/cosmetólogo) y está en dashboard
    if (isProfessional && currentView === 'dashboard') {
      return <ProfessionalDashboard clientes={clientes} citas={citas} procedimientos={procedimientos} />;
    }
    
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
      case 'finanzas':
        return <Finanzas />;
      case 'configuracion':
        return <Configuracion user={user!} onUpdateUser={async () => {
          // TODO: Implementar actualización de usuario
          console.log('Actualizando usuario...');
        }} />;
      default:
        return <Dashboard clientes={clientes} citas={citas} procedimientos={procedimientos} />;
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header user={user} onLogout={logout} />
        <div className="flex flex-1 pt-16">
          {isAdmin ? (
            <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
          ) : isProfessional ? (
            <ProfessionalSidebar currentView={currentView} onViewChange={setCurrentView} />
          ) : (
            <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          )}
          <main className="flex-1 overflow-auto p-4 md:p-8">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header user={user!} onLogout={logout} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {isAdmin ? (
          <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        ) : isProfessional ? (
          <ProfessionalSidebar currentView={currentView} onViewChange={setCurrentView} />
        ) : (
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        )}
        
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