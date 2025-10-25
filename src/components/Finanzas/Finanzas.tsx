import { useState } from 'react';
import { Calendar, DollarSign, TrendingUp, AlertTriangle, Users } from 'lucide-react';

export function Finanzas() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [fechaInicio, setFechaInicio] = useState<string>(todayStr);
  const [fechaFin, setFechaFin] = useState<string>(todayStr);

  // Valores de ejemplo. Sustituir por datos reales desde BD.
  const cobradoHoy = 8500;
  const cobradoRango = 42000;

  const cxpProveedores = 12000; // cuentas por pagar a proveedores
  const cxpServiciosFijos = 3000; // renta, luz, internet, etc.
  const cxpServiciosExternos = 2000; // redes sociales u otros
  const cuentasPorPagarTotal = cxpProveedores + cxpServiciosFijos + cxpServiciosExternos;

  const cxcCombosLaser = 15000; // combos vendidos a crédito
  const cxcPaquetesPorSesion = 8000; // paquetes cobrados por sesión (fiado/kit)
  const cuentasPorCobrarTotal = cxcCombosLaser + cxcPaquetesPorSesion;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finanzas</h1>
        <p className="text-gray-600 mt-2">Resumen financiero: cobros, cuentas por pagar y por cobrar</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-frodyta-primary focus:border-frodyta-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-frodyta-primary focus:border-frodyta-primary"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-frodyta-primary text-white px-4 py-2 rounded-lg hover:bg-frodyta-primary/90 transition-colors"
            >
              <Calendar size={18} />
              Aplicar
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={() => {
                const t = new Date().toISOString().split('T')[0];
                setFechaInicio(t);
                setFechaFin(t);
              }}
            >
              Hoy
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cobrado Hoy</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">RD$ {cobradoHoy.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <TrendingUp size={16} />
            Por ventas y servicios del día
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cobrado por Fecha</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">RD$ {cobradoRango.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Rango: {fechaInicio} a {fechaFin}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cuentas por Pagar</p>
              <p className="text-2xl font-bold text-red-600 mt-1">RD$ {cuentasPorPagarTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
          <ul className="mt-4 text-sm text-gray-700 space-y-1">
            <li>Proveedores: RD$ {cxpProveedores.toLocaleString()}</li>
            <li>Servicios fijos: RD$ {cxpServiciosFijos.toLocaleString()}</li>
            <li>Servicios externos: RD$ {cxpServiciosExternos.toLocaleString()}</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cuentas por Cobrar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">RD$ {cuentasPorCobrarTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
          <ul className="mt-4 text-sm text-gray-700 space-y-1">
            <li>Combos Láser: RD$ {cxcCombosLaser.toLocaleString()}</li>
            <li>Paquetes por sesión: RD$ {cxcPaquetesPorSesion.toLocaleString()}</li>
          </ul>
        </div>
      </div>

      {/* Listados detallados (placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalle Cuentas por Pagar</h2>
          <div className="text-gray-600 text-sm">Pronto: listado de facturas a proveedores, servicios fijos y externos.</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalle Cuentas por Cobrar</h2>
          <div className="text-gray-600 text-sm">Pronto: listado de clientes con saldo pendiente (combos/paquetes por sesión).</div>
        </div>
      </div>
    </div>
  );
}
