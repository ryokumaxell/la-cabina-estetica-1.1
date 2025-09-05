import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Download, Filter } from 'lucide-react';
import { Cliente, Procedimiento, Cita } from '../../types';
import { formatDate, isCurrentWeek } from '../../utils/dateUtils';

interface ReportesProps {
  clientes: Cliente[];
  procedimientos: Procedimiento[];
  citas: Cita[];
}

export function Reportes({ clientes, procedimientos, citas }: ReportesProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Cálculos de métricas
  const totalIngresos = procedimientos.reduce((sum, proc) => sum + proc.costo, 0);
  const ingresosMesActual = procedimientos
    .filter(p => new Date(p.fecha_procedimiento).getMonth() === new Date().getMonth())
    .reduce((sum, proc) => sum + proc.costo, 0);
  
  const ingresosSemanales = procedimientos
    .filter(p => isCurrentWeek(p.fecha_procedimiento))
    .reduce((sum, proc) => sum + proc.costo, 0);

  const clientesActivos = new Set(
    procedimientos
      .filter(p => new Date(p.fecha_procedimiento) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .map(p => p.cliente_id)
  ).size;

  const tasaRetencion = clientes.length > 0 
    ? Math.round((clientesActivos / clientes.length) * 100) 
    : 0;

  // Servicios más populares
  const serviciosCount = procedimientos.reduce((acc, proc) => {
    acc[proc.tipo_servicio] = (acc[proc.tipo_servicio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviciosPopulares = Object.entries(serviciosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Ingresos por mes (últimos 6 meses)
  const ingresosPorMes = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const ingresos = procedimientos
      .filter(p => {
        const procDate = new Date(p.fecha_procedimiento);
        return procDate.getFullYear() === year && procDate.getMonth() === month;
      })
      .reduce((sum, proc) => sum + proc.costo, 0);
      
    return {
      mes: date.toLocaleDateString('es-DO', { month: 'short', year: '2-digit' }),
      ingresos
    };
  }).reverse();

  const maxIngresos = Math.max(...ingresosPorMes.map(m => m.ingresos));

  // Estadísticas de citas
  const citasRealizadas = citas.filter(c => c.estado === 'realizada').length;
  const citasCanceladas = citas.filter(c => c.estado === 'cancelada').length;
  const noShows = citas.filter(c => c.estado === 'no_show').length;
  const tasaAsistencia = citas.length > 0 
    ? Math.round((citasRealizadas / citas.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-2">Métricas y estadísticas de tu centro estético</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Este año</option>
          </select>
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-green-600">RD$ {totalIngresos.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">+12% vs mes anterior</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-3xl font-bold text-purple-600">{clientesActivos}</p>
              <p className="text-sm text-gray-500 mt-1">Retención: {tasaRetencion}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Asistencia</p>
              <p className="text-3xl font-bold text-blue-600">{tasaAsistencia}%</p>
              <p className="text-sm text-gray-500 mt-1">{citasRealizadas} de {citas.length} citas</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Procedimientos</p>
              <p className="text-3xl font-bold text-orange-600">{procedimientos.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total realizados</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingresos por Mes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ingresos por Mes</h3>
          <div className="space-y-4">
            {ingresosPorMes.map((mes, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{mes.mes}</span>
                  <span className="text-sm font-bold text-gray-900">
                    RD$ {mes.ingresos.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${maxIngresos > 0 ? (mes.ingresos / maxIngresos) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios Más Populares */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Servicios Más Solicitados</h3>
          <div className="space-y-4">
            {serviciosPopulares.map(([servicio, cantidad], index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {servicio}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${serviciosPopulares.length > 0 
                          ? (cantidad / serviciosPopulares[0][1]) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-bold text-gray-900 min-w-[2rem] text-right">
                  {cantidad}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumen Financiero */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen Financiero</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Esta semana</span>
              <span className="font-semibold text-green-600">
                RD$ {ingresosSemanales.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Este mes</span>
              <span className="font-semibold text-green-600">
                RD$ {ingresosMesActual.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Promedio por procedimiento</span>
              <span className="font-semibold text-green-600">
                RD$ {procedimientos.length > 0 
                  ? Math.round(totalIngresos / procedimientos.length).toLocaleString() 
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Total acumulado</span>
              <span className="font-bold text-green-600">
                RD$ {totalIngresos.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas de Citas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Análisis de Citas</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{tasaAsistencia}%</div>
              <div className="text-sm text-gray-600">Tasa de Asistencia</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Citas realizadas</span>
                <span className="font-semibold text-green-600">{citasRealizadas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancelaciones</span>
                <span className="font-semibold text-red-600">{citasCanceladas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">No asistieron</span>
                <span className="font-semibold text-orange-600">{noShows}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Total programadas</span>
                <span className="font-bold text-gray-900">{citas.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crecimiento de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crecimiento</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{clientes.length}</div>
              <div className="text-sm text-gray-600">Total Clientes</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nuevos esta semana</span>
                <span className="font-semibold text-green-600">
                  {clientes.filter(c => isCurrentWeek(c.created_at)).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nuevos este mes</span>
                <span className="font-semibold text-green-600">
                  {clientes.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Clientes activos</span>
                <span className="font-semibold text-purple-600">{clientesActivos}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Tasa retención</span>
                <span className="font-bold text-purple-600">{tasaRetencion}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones de Negocio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">💡 Servicios Estrella</h4>
            <p className="text-sm text-gray-600">
              Enfócate en promover "{serviciosPopulares[0]?.[0] || 'N/A'}" que es tu servicio más solicitado.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">📈 Oportunidades</h4>
            <p className="text-sm text-gray-600">
              Con {tasaAsistencia}% de asistencia, considera implementar recordatorios más efectivos.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🎯 Retención</h4>
            <p className="text-sm text-gray-600">
              Tu tasa de retención del {tasaRetencion}% es excelente. Continúa con programas de seguimiento.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">💰 Ingresos</h4>
            <p className="text-sm text-gray-600">
              Promedio de RD$ {procedimientos.length > 0 ? Math.round(totalIngresos / procedimientos.length).toLocaleString() : '0'} por sesión. 
              Considera paquetes premium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}