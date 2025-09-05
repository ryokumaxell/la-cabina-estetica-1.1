import React, { useState, useEffect } from 'react';
import { X, FileText, Clock, DollarSign, User, Package, Camera, AlertTriangle } from 'lucide-react';
import { Procedimiento, Cliente, ProductoUsado } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

interface ProcedimientoModalProps {
  procedimiento: Procedimiento | null;
  clientes: Cliente[];
  mode: 'view' | 'add';
  onClose: () => void;
  onSave: (procedimiento: Omit<Procedimiento, 'id' | 'created_at'>) => void;
}

const serviciosComunes = [
  'Limpieza Facial Profunda',
  'Peeling Químico Superficial',
  'Peeling Químico Medio',
  'Microdermoabrasión',
  'Hidratación Profunda',
  'Tratamiento Antienvejecimiento',
  'Tratamiento para Acné',
  'Depilación Láser',
  'Mesoterapia Facial',
  'Radiofrecuencia',
  'Luz Pulsada',
  'Masaje Facial Relajante',
  'Tratamiento de Manchas',
  'Rejuvenecimiento Facial'
];

const productosComunes = [
  { nombre: 'Ácido Glicólico 30%', categoria: 'Peeling' },
  { nombre: 'Ácido Salicílico 20%', categoria: 'Peeling' },
  { nombre: 'Sérum Vitamina C', categoria: 'Antioxidante' },
  { nombre: 'Ácido Hialurónico', categoria: 'Hidratante' },
  { nombre: 'Retinol 0.5%', categoria: 'Antienvejecimiento' },
  { nombre: 'Niacinamida 10%', categoria: 'Regulador' },
  { nombre: 'Protector Solar SPF 50+', categoria: 'Protección' },
  { nombre: 'Máscara Purificante', categoria: 'Limpieza' },
  { nombre: 'Exfoliante Enzimático', categoria: 'Exfoliación' },
  { nombre: 'Sérum Regenerador', categoria: 'Reparación' }
];

export function ProcedimientoModal({ procedimiento, clientes, mode, onClose, onSave }: ProcedimientoModalProps) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo_servicio: '',
    protocolo: '',
    productos_usados: [] as ProductoUsado[],
    observaciones: '',
    responsable: 'u1',
    duracion_min: 60,
    costo: 0,
    fotos: [] as string[],
    fecha_procedimiento: new Date().toISOString()
  });

  const [newProducto, setNewProducto] = useState<ProductoUsado>({
    nombre: '',
    lote: '',
    cantidad: ''
  });

  useEffect(() => {
    if (procedimiento) {
      setFormData(procedimiento);
    } else {
      // Reset form for new procedure
      setFormData({
        cliente_id: '',
        tipo_servicio: '',
        protocolo: '',
        productos_usados: [],
        observaciones: '',
        responsable: 'u1',
        duracion_min: 60,
        costo: 0,
        fotos: [],
        fecha_procedimiento: new Date().toISOString()
      });
    }
  }, [procedimiento]);

  const isViewMode = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddProducto = () => {
    if (newProducto.nombre && newProducto.lote && newProducto.cantidad) {
      setFormData(prev => ({
        ...prev,
        productos_usados: [...prev.productos_usados, newProducto]
      }));
      setNewProducto({ nombre: '', lote: '', cantidad: '' });
    }
  };

  const handleRemoveProducto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productos_usados: prev.productos_usados.filter((_, i) => i !== index)
    }));
  };

  const handleServicioChange = (servicio: string) => {
    setFormData(prev => ({ ...prev, tipo_servicio: servicio }));
    
    // Auto-fill protocol and cost based on service
    let protocolo = '';
    let costo = 0;
    let duracion = 60;

    switch (servicio) {
      case 'Limpieza Facial Profunda':
        protocolo = '1. Desmaquillado y limpieza\n2. Exfoliación\n3. Extracción de comedones\n4. Mascarilla purificante\n5. Hidratación final';
        costo = 2800;
        duracion = 75;
        break;
      case 'Peeling Químico Superficial':
        protocolo = '1. Limpieza profunda\n2. Aplicación de ácido\n3. Neutralización\n4. Hidratación y protección solar';
        costo = 3500;
        duracion = 45;
        break;
      case 'Tratamiento Antienvejecimiento':
        protocolo = '1. Limpieza\n2. Aplicación de activos\n3. Masaje facial\n4. Mascarilla rejuvenecedora\n5. Protección';
        costo = 5500;
        duracion = 90;
        break;
      case 'Hidratación Profunda':
        protocolo = '1. Limpieza suave\n2. Exfoliación ligera\n3. Aplicación de ácido hialurónico\n4. Mascarilla hidratante\n5. Sérum y crema';
        costo = 3200;
        duracion = 60;
        break;
      default:
        protocolo = '';
        costo = 0;
        duracion = 60;
    }

    setFormData(prev => ({
      ...prev,
      protocolo,
      costo,
      duracion_min: duracion
    }));
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre_completo || 'Cliente no encontrado';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Registrar Procedimiento' : 'Detalles del Procedimiento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Básica */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-900 border-b pb-2">
                <FileText size={20} className="text-purple-600" />
                Información del Procedimiento
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                {isViewMode ? (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {getClienteNombre(formData.cliente_id)}
                  </div>
                ) : (
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente_id: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre_completo}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Servicio *
                </label>
                {isViewMode ? (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {formData.tipo_servicio}
                  </div>
                ) : (
                  <select
                    value={formData.tipo_servicio}
                    onChange={(e) => handleServicioChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Seleccionar servicio...</option>
                    {serviciosComunes.map((servicio) => (
                      <option key={servicio} value={servicio}>
                        {servicio}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Fecha y Hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora *
                </label>
                {isViewMode ? (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {formatDateTime(formData.fecha_procedimiento)}
                  </div>
                ) : (
                  <input
                    type="datetime-local"
                    value={formData.fecha_procedimiento.slice(0, 16)}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      fecha_procedimiento: new Date(e.target.value).toISOString() 
                    }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                )}
              </div>

              {/* Duración y Costo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (minutos) *
                  </label>
                  {isViewMode ? (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      {formData.duracion_min} min
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={formData.duracion_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, duracion_min: parseInt(e.target.value) || 0 }))}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo (RD$) *
                  </label>
                  {isViewMode ? (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg font-medium text-green-600">
                      RD$ {formData.costo.toLocaleString()}
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={formData.costo}
                      onChange={(e) => setFormData(prev => ({ ...prev, costo: parseInt(e.target.value) || 0 }))}
                      required
                      min="0"
                      step="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}
                </div>
              </div>

              {/* Responsable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsable
                </label>
                {isViewMode ? (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {formData.responsable === 'u1' ? 'Dra. Ana García' : 'María Rodríguez'}
                  </div>
                ) : (
                  <select
                    value={formData.responsable}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="u1">Dra. Ana García</option>
                    <option value="u2">María Rodríguez</option>
                  </select>
                )}
              </div>
            </div>

            {/* Protocolo y Productos */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-900 border-b pb-2">
                <Package size={20} className="text-green-600" />
                Protocolo y Productos
              </div>

              {/* Protocolo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protocolo del Tratamiento
                </label>
                <textarea
                  value={formData.protocolo}
                  onChange={(e) => setFormData(prev => ({ ...prev, protocolo: e.target.value }))}
                  disabled={isViewMode}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  placeholder="Describe el paso a paso del procedimiento..."
                />
              </div>

              {/* Productos Usados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Productos Utilizados
                </label>
                
                {!isViewMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                    <select
                      value={newProducto.nombre}
                      onChange={(e) => setNewProducto(prev => ({ ...prev, nombre: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Seleccionar producto...</option>
                      {productosComunes.map((producto) => (
                        <option key={producto.nombre} value={producto.nombre}>
                          {producto.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newProducto.lote}
                      onChange={(e) => setNewProducto(prev => ({ ...prev, lote: e.target.value }))}
                      placeholder="Lote"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProducto.cantidad}
                        onChange={(e) => setNewProducto(prev => ({ ...prev, cantidad: e.target.value }))}
                        placeholder="Cantidad"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddProducto}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {formData.productos_usados.length > 0 ? (
                  <div className="space-y-2">
                    {formData.productos_usados.map((producto, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{producto.nombre}</div>
                          <div className="text-sm text-gray-600">
                            Lote: {producto.lote} • Cantidad: {producto.cantidad}
                          </div>
                        </div>
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProducto(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No hay productos registrados
                  </div>
                )}
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones y Notas
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  disabled={isViewMode}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  placeholder="Reacciones del cliente, resultados observados, recomendaciones..."
                />
              </div>

              {/* Información de Registro (solo en modo vista) */}
              {isViewMode && procedimiento && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Información de Registro</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Registrado el: {formatDateTime(procedimiento.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Registrar Procedimiento
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}