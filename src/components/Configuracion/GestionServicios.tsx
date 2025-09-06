import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_min: number;
}

interface GestionServiciosProps {}

export function GestionServicios({}: GestionServiciosProps) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion_min: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const servicioData = {
      id: editingServicio?.id || Date.now().toString(),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      duracion_min: parseInt(formData.duracion_min)
    };

    if (editingServicio) {
      // Editar servicio existente
      setServicios(prev => prev.map(s => s.id === editingServicio.id ? servicioData : s));
    } else {
      // Agregar nuevo servicio
      setServicios(prev => [...prev, servicioData]);
    }

    // Limpiar formulario y cerrar modal
    setFormData({ nombre: '', descripcion: '', precio: '', duracion_min: '' });
    setEditingServicio(null);
    setShowModal(false);
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
      duracion_min: servicio.duracion_min.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setServicios(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gestión de Servicios
        </h2>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus size={16} />
          Agregar Servicio
        </button>
      </div>

      {/* Lista de servicios */}
      {servicios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No hay servicios registrados. Agrega tu primer servicio.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {servicio.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {servicio.descripcion}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-purple-600 dark:text-purple-400">
                      {servicio.precio}€
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {servicio.duracion_min} min
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(servicio)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                    title="Editar servicio"
                  >
                    <Edit2 size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(servicio.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    title="Eliminar servicio"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingServicio ? 'Editar Servicio' : 'Agregar Servicio'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del servicio
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    name="duracion_min"
                    value={formData.duracion_min}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingServicio(null);
                    setFormData({ nombre: '', descripcion: '', precio: '', duracion_min: '' });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {editingServicio ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}