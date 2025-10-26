import React, { useEffect, useState } from 'react';
import { X, User, Mail } from 'lucide-react';
import { Cliente } from '../../types';

interface AdminClienteModalProps {
  cliente: Cliente | null;
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function AdminClienteModal({ cliente, mode, onClose, onSave }: AdminClienteModalProps) {
  const [formData, setFormData] = useState<Pick<Cliente, 'nombre_completo' | 'email' | 'suscripcion'>>({
    nombre_completo: '',
    email: undefined,
    suscripcion: 'standard'
  });

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre_completo: cliente.nombre_completo || '',
        email: cliente.email || undefined,
        suscripcion: (cliente as any).suscripcion ?? 'standard'
      });
    } else {
      setFormData({ nombre_completo: '', email: undefined, suscripcion: 'standard' });
    }
  }, [cliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }
    if (formData.email && !/^[^@\s]+@gmail\.com$/i.test(formData.email.trim())) {
      alert('Por favor ingrese un correo Gmail válido (termina en @gmail.com)');
      return;
    }

    const dataToSave: Omit<Cliente, 'id' | 'created_at' | 'updated_at'> = {
      nombre_completo: formData.nombre_completo.trim(),
      email: formData.email?.trim() || null,
      suscripcion: formData.suscripcion,
      activo: true,
      // Defaults for fields not present in admin form
      fecha_nacimiento: '',
      telefono: '',
      direccion: '',
      genero: 'Prefiero no decir',
      alergias: [],
      medicamentos_actuales: [],
      notas_medicas: ''
    } as any;

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isAddMode ? 'Nuevo Cliente (Admin)' : isEditMode ? 'Editar Cliente (Admin)' : 'Detalles del Cliente'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (Gmail)</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value || undefined }))}
              disabled={isViewMode}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suscripción</label>
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

          {!isViewMode && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Registrar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}