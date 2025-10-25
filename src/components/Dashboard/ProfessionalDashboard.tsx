import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Heart,
  Clock,
  UserCheck,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';
import { Cliente, Cita, Procedimiento } from '../../types';
import { formatDate, formatTime, isCurrentWeek } from '../../utils/dateUtils';

interface ProfessionalDashboardProps {
  clientes: Cliente[];
  citas: Cita[];
  procedimientos: Procedimiento[];
}

export function ProfessionalDashboard({ clientes, citas, procedimientos }: ProfessionalDashboardProps) {
  // Estadísticas
  const totalPacientes = clientes.length;
  const citasHoy = citas.filter(cita => {
    const today = new Date().toDateString();
    return new Date(cita.fecha).toDateString() === today;
  });
  
  const citasSemana = citas.filter(cita => isCurrentWeek(new Date(cita.fecha)));
  const tratamientosRealizados = procedimientos.length;
  
  // Próximas citas
  const proximasCitas = citas
    .filter(cita => new Date(cita.fecha) >= new Date() && cita.estado !== 'cancelada')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  // Pacientes recientes
  const pacientesRecientes = clientes
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 4);

  // Tratamientos populares
  const tratamientosPopulares = procedimientos.reduce((acc, proc) => {
    acc[proc.tipo_servicio] = (acc[proc.tipo_servicio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTratamientos = Object.entries(tratamientosPopulares)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Panel Profesional</h1>
            <p className="text-pink-100">Bienvenida a tu espacio de cuidado especializado</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <Heart size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600">Mis Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{totalPacientes}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <Users size={24} className="text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Consultas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{citasHoy.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">{citasSemana.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Tratamientos</p>
              <p className="text-2xl font-bold text-gray-900">{tratamientosRealizados}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Stethoscope size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Consultas</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {proximasCitas.length > 0 ? proximasCitas.map((cita) => {
              const cliente = clientes.find(c => c.id === cita.cliente_id);
              const isToday = new Date(cita.fecha).toDateString() === new Date().toDateString();
              
              return (
                <div key={cita.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {cliente?.nombre_completo || 'Cliente no encontrado'}
                    </p>
                    <p className="text-sm text-gray-600">{cita.tipo_cita}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isToday ? 'text-pink-600' : 'text-gray-600'}`}>
                      {formatDate(cita.fecha)}
                    </p>
                    <p className="text-sm text-gray-500">{formatTime(cita.hora)}</p>
                  </div>
                  {cita.estado === 'confirmada' && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  {cita.estado === 'programada' && (
                    <Clock size={16} className="text-yellow-500" />
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay consultas programadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Pacientes Recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pacientes Recientes</h2>
            <Users size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {pacientesRecientes.length > 0 ? pacientesRecientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {cliente.nombre_completo}
                  </p>
                  <p className="text-sm text-gray-600">{cliente.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {cliente.created_at ? formatDate(cliente.created_at) : 'Fecha no disponible'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay pacientes registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tratamientos Populares */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Tratamientos Más Realizados</h2>
          <Award size={20} className="text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topTratamientos.length > 0 ? topTratamientos.map(([tratamiento, cantidad], index) => (
            <div key={tratamiento} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <Star size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{tratamiento}</p>
                  <p className="text-sm text-gray-600">{cantidad} realizados</p>
                </div>
                <div className="text-lg font-bold text-green-600">#{index + 1}</div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              <Stethoscope size={48} className="mx-auto mb-3 opacity-50" />
              <p>No hay tratamientos registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}