import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  UserPlus,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Cliente, Cita, Procedimiento } from '../../types';
import { formatDate, formatTime, isCurrentWeek } from '../../utils/dateUtils';

interface DashboardProps {
  clientes: Cliente[];
  citas: Cita[];
  procedimientos: Procedimiento[];
}

export function Dashboard({ clientes, citas, procedimientos }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const citasHoy = citas.filter(c => c.fecha_inicio.split('T')[0] === today);
  const citasPendientes = citas.filter(c => c.estado === 'programada');
  
  const ingresosSemana = procedimientos
    .filter(p => isCurrentWeek(p.fecha_procedimiento))
    .reduce((sum, p) => sum + p.costo, 0);
    
  

  // Valores de ejemplo - Deberían venir de tu base de datos
  const cuentasPorPagar = 17000; // Ejemplo: 17,000 pesos
  const cuentasPorCobrar = 25000; // Ejemplo: 25,000 pesos

  const stats = [
    {
      name: 'Citas Hoy',
      value: citasHoy.length,
      change: `${citasPendientes.length} pendientes`,
      changeType: 'neutral',
      icon: Calendar,
      color: 'pink'
    },
    {
      name: 'Ingresos Semana',
      value: `RD$ ${ingresosSemana.toLocaleString()}`,
      change: '+12% vs semana anterior',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      name: 'Cuentas por Pagar',
      value: `RD$ ${cuentasPorPagar.toLocaleString()}`,
      change: 'A proveedores',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      name: 'Cuenta por Cobrar',
      value: `RD$ ${cuentasPorCobrar.toLocaleString()}`,
      change: 'De clientes',
      changeType: 'neutral',
      icon: DollarSign,
      color: 'blue'
    }
  ];

  const proximasCitas = citas
    .filter(c => c.estado === 'programada')
    .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())
    .slice(0, 5);

  const clientesRecientes = clientes
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen de tu centro estético</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas Citas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Citas</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {proximasCitas.length > 0 ? proximasCitas.map((cita) => (
              <div key={cita.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {cita.cliente_nombre}
                  </p>
                  <p className="text-sm text-gray-600">{cita.servicio}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(cita.fecha_inicio)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(cita.fecha_inicio)}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay citas programadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Clientes Recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Clientes Recientes</h2>
            <UserPlus size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {clientesRecientes.length > 0 ? clientesRecientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {cliente.nombre_completo}
                  </p>
                  <p className="text-sm text-gray-600">{cliente.email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Nuevo
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay clientes recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <UserPlus size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Nuevo Cliente</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
            <Calendar size={24} className="text-pink-600 mb-2" />
            <span className="text-sm font-medium text-pink-900">Agendar Cita</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <CheckCircle size={24} className="text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Procedimiento</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Ver Reportes</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {citasHoy.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Recordatorio</h3>
              <p className="text-blue-800">
                Tienes {citasHoy.length} {citasHoy.length === 1 ? 'cita programada' : 'citas programadas'} para hoy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}