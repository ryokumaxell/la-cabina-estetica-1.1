import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, MapPin, AlertTriangle, Pill, FileText, Download } from 'lucide-react';
import { Cliente, Procedimiento } from '../../types';
import { formatDate, calculateAge } from '../../utils/dateUtils';

interface ClienteModalProps {
  cliente: Cliente | null;
  procedimientos: Procedimiento[];
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function ClienteModal({ cliente, procedimientos, mode, onClose, onSave }: ClienteModalProps) {
  const [formData, setFormData] = useState<Omit<Cliente, 'id' | 'created_at' | 'updated_at' | 'photos' | 'consentimientos'>>({
    nombre_completo: '',
    fecha_nacimiento: '',
    telefono: '',
    email: undefined,
    direccion: '',
    genero: '',
    alergias: [],
    medicamentos_actuales: [],
    notas_medicas: '',
    suscripcion: 'standard'
  });

  const [newAlergia, setNewAlergia] = useState('');
  const [newMedicamento, setNewMedicamento] = useState('');

  useEffect(() => {
    if (cliente) {
      const { id, created_at, updated_at, photos, consentimientos, ...clienteData } = cliente;
      setFormData({
        ...clienteData,
        fecha_nacimiento: cliente.fecha_nacimiento ? cliente.fecha_nacimiento.split('T')[0] : '',
        email: cliente.email || undefined,
        genero: (cliente as any).genero || '',
        suscripcion: (cliente as any).suscripcion ?? 'standard'
      });
    } else {
      setFormData({
        nombre_completo: '',
        fecha_nacimiento: '',
        telefono: '',
        email: undefined,
        direccion: '',
        genero: '',
        alergias: [],
        medicamentos_actuales: [],
        notas_medicas: '',
        suscripcion: 'standard'
      });
    }
  }, [cliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo.trim() || !formData.telefono.trim()) {
      alert('Por favor complete los campos obligatorios: Nombre y Teléfono');
      return;
    }

    if (formData.email && !/^[^@\s]+@gmail\.com$/i.test(formData.email.trim())) {
      alert('Por favor ingrese un correo Gmail válido (termina en @gmail.com)');
      return;
    }
    
    const formDataToSave = {
      ...formData,
      email: formData.email?.trim() || null
    };
    
    onSave(formDataToSave);
  };

  const handleAddAlergia = () => {
    if (newAlergia.trim()) {
      setFormData(prev => ({
        ...prev,
        alergias: [...prev.alergias, newAlergia.trim()]
      }));
      setNewAlergia('');
    }
  };

  const handleRemoveAlergia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alergias: prev.alergias.filter((_, i) => i !== index)
    }));
  };

  const handleAddMedicamento = () => {
    if (newMedicamento.trim()) {
      setFormData(prev => ({
        ...prev,
        medicamentos_actuales: [...prev.medicamentos_actuales, newMedicamento.trim()]
      }));
      setNewMedicamento('');
    }
  };

  const handleRemoveMedicamento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicamentos_actuales: prev.medicamentos_actuales.filter((_, i) => i !== index)
    }));
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isAddMode ? 'Nuevo Cliente' : 
             isEditMode ? 'Editar Cliente' : 
             'Detalles del Cliente'}
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
            {/* Datos Personales */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-900 border-b pb-2">
                <User size={20} className="text-purple-600" />
                Datos Personales
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_completo: e.target.value }))}
                    disabled={isViewMode}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData(prev => ({ ...prev, genero: e.target.value as any }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    disabled={isViewMode}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value || undefined }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suscripción
                  </label>
                  <select
                    value={formData.suscripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, suscripcion: e.target.value as any }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  >
                    <option value="standard">Standard</option>
                    <option value="plus">Plus</option>
                    <option value="pro_max">Pro Max</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  />
                </div>

              {/* Alergias */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <AlertTriangle size={16} className="text-red-500" />
                  Alergias
                </div>
                {!isViewMode && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newAlergia}
                      onChange={(e) => setNewAlergia(e.target.value)}
                      placeholder="Agregar alergia..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAlergia())}
                    />
                    <button
                      type="button"
                      onClick={handleAddAlergia}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      +
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {formData.alergias.map((alergia, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                    >
                      {alergia}
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAlergia(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  {formData.alergias.length === 0 && (
                    <span className="text-gray-500 text-sm">Ninguna alergia conocida</span>
                  )}
                </div>
              </div>

              {/* Medicamentos */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Pill size={16} className="text-blue-500" />
                  Medicamentos Actuales
                </div>
                {!isViewMode && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newMedicamento}
                      onChange={(e) => setNewMedicamento(e.target.value)}
                      placeholder="Agregar medicamento..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMedicamento())}
                    />
                    <button
                      type="button"
                      onClick={handleAddMedicamento}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      +
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {formData.medicamentos_actuales.map((medicamento, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {medicamento}
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicamento(index)}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  {formData.medicamentos_actuales.length === 0 && (
                    <span className="text-gray-500 text-sm">Sin medicamentos actuales</span>
                  )}
                </div>
              </div>

              {/* Notas Médicas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Médicas
                </label>
                <textarea
                  value={formData.notas_medicas}
                  onChange={(e) => setFormData(prev => ({ ...prev, notas_medicas: e.target.value }))}
                  disabled={isViewMode}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                  placeholder="Información médica relevante, condiciones de la piel, observaciones..."
                />
              </div>
            </div>

            {/* Historial y Fotos */}
            <div className="space-y-6">
              {isViewMode && cliente && (
                <>
                  {/* Fotos */}
                  {Array.isArray(cliente.photos) && cliente.photos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                        <FileText size={20} className="text-pink-600" />
                        Fotos del Cliente
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {(cliente.photos ?? []).map((photo) => (
                          <div key={photo.id} className="relative">
                            <img
                              src={photo.url}
                              alt={photo.descripcion ?? 'Foto del cliente'}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                              <p className="font-medium">{photo.tipo}</p>
                              <p>{photo.fecha ? formatDate(photo.fecha) : '-'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Historial de Procedimientos */}
                  {procedimientos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                        <FileText size={20} className="text-green-600" />
                        Historial de Tratamientos ({procedimientos.length})
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {procedimientos
                          .sort((a, b) => new Date(b.fecha_procedimiento).getTime() - new Date(a.fecha_procedimiento).getTime())
                          .map((proc) => (
                            <div key={proc.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{proc.tipo_servicio}</h4>
                                <span className="text-sm text-gray-600">{formatDate(proc.fecha_procedimiento)}</span>
                              </div>
                              {proc.observaciones && (
                                <p className="text-sm text-gray-600 mb-2">{proc.observaciones}</p>
                              )}
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{proc.duracion_min} min</span>
                                <span className="font-medium text-green-600">RD$ {proc.costo.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {/* Consentimientos */}
                  {Array.isArray(cliente.consentimientos) && cliente.consentimientos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                        <Download size={20} className="text-orange-600" />
                        Consentimientos
                      </div>
                      <div className="space-y-2">
                        {(cliente.consentimientos ?? []).map((consent) => (
                          <div key={consent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{consent.tipo}</p>
                              <p className="text-sm text-gray-600">
                                {(consent.fecha ? formatDate(consent.fecha) : '-')} - {consent.metodo === 'digital' ? 'Digital' : 'Físico'}
                              </p>
                            </div>
                            <button className="text-purple-600 hover:text-purple-700">
                              <Download size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Información de Registro */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Información de Registro</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Cliente desde: {formatDate(cliente.created_at)}</p>
                      <p>Última actualización: {formatDate(cliente.updated_at)}</p>
                    </div>
                  </div>
                </>
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
                {isAddMode ? 'Crear Cliente' : 'Guardar Cambios'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}