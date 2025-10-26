import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { 
  AdministradorProfesional, 
  AdministradorProfesionalInsert,
  PermisosRol 
} from '../../types';
import {
  obtenerAdministradores,
  crearAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
  toggleActivoAdministrador,
  PERMISOS_PREDEFINIDOS
} from '../../services/administradoresService';
import { useAuth } from '../../hooks/useAuth';

interface ModalAdministradorProps {
  isOpen: boolean;
  onClose: () => void;
  administrador?: AdministradorProfesional | null;
  onSave: () => void;
}

const ModalAdministrador: React.FC<ModalAdministradorProps> = ({
  isOpen,
  onClose,
  administrador,
  onSave
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AdministradorProfesionalInsert>({
    email: '',
    nombre: '',
    rol: 'profesional',
    permisos: PERMISOS_PREDEFINIDOS.profesional_completo,
    activo: true,
    created_by: user?.email || '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [permisoTemplate, setPermisoTemplate] = useState('profesional_completo');

  useEffect(() => {
    if (administrador) {
      setFormData({
        email: administrador.email,
        nombre: administrador.nombre,
        rol: administrador.rol,
        permisos: administrador.permisos,
        activo: administrador.activo,
        created_by: administrador.created_by,
        notas: administrador.notas || ''
      });
    } else {
      setFormData({
        email: '',
        nombre: '',
        rol: 'profesional',
        permisos: PERMISOS_PREDEFINIDOS.profesional_completo,
        activo: true,
        created_by: user?.email || '',
        notas: ''
      });
      setPermisoTemplate('profesional_completo');
    }
    setError('');
  }, [administrador, user, isOpen]);

  const handleTemplateChange = (template: string) => {
    setPermisoTemplate(template);
    if (PERMISOS_PREDEFINIDOS[template]) {
      setFormData(prev => ({
        ...prev,
        permisos: PERMISOS_PREDEFINIDOS[template]
      }));
    }
  };

  const handlePermisoChange = (modulo: keyof PermisosRol, valor: boolean) => {
    setFormData(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [modulo]: valor
      }
    }));
    setPermisoTemplate('personalizado');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (administrador) {
        await actualizarAdministrador(administrador.id, {
          nombre: formData.nombre,
          rol: formData.rol,
          permisos: formData.permisos,
          activo: formData.activo,
          notas: formData.notas
        });
      } else {
        await crearAdministrador(formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el administrador');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {administrador ? 'Editar Administrador' : 'Nuevo Administrador'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!!administrador}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value as 'profesional' | 'super_admin' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="profesional">Profesional</option>
              <option value="super_admin">Super Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plantilla de Permisos
            </label>
            <select
              value={permisoTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            >
              <option value="profesional_completo">Profesional Completo</option>
              <option value="profesional_clinico">Profesional Clínico</option>
              <option value="profesional_administrativo">Profesional Administrativo</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permisos Específicos
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(formData.permisos).map(([modulo, permitido]) => (
                <label key={modulo} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={permitido}
                    onChange={(e) => handlePermisoChange(modulo as keyof PermisosRol, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm capitalize">
                    {modulo.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (Opcional)
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Notas adicionales sobre este administrador..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="activo" className="ml-2 text-sm text-gray-700">
              Administrador activo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestionAdministradores: React.FC = () => {
  const [administradores, setAdministradores] = useState<AdministradorProfesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [administradorSeleccionado, setAdministradorSeleccionado] = useState<AdministradorProfesional | null>(null);

  const cargarAdministradores = async () => {
    try {
      setLoading(true);
      const data = await obtenerAdministradores();
      setAdministradores(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAdministradores();
  }, []);

  const handleNuevo = () => {
    setAdministradorSeleccionado(null);
    setModalOpen(true);
  };

  const handleEditar = (administrador: AdministradorProfesional) => {
    setAdministradorSeleccionado(administrador);
    setModalOpen(true);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este administrador?')) {
      try {
        await eliminarAdministrador(id);
        await cargarAdministradores();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar administrador');
      }
    }
  };

  const handleToggleActivo = async (id: string, activo: boolean) => {
    try {
      await toggleActivoAdministrador(id, !activo);
      await cargarAdministradores();
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado del administrador');
    }
  };

  const getRolBadge = (rol: string) => {
    const styles = {
      super_admin: 'bg-purple-100 text-purple-800',
      profesional: 'bg-blue-100 text-blue-800'
    };
    return styles[rol as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const contarPermisos = (permisos: PermisosRol) => {
    return Object.values(permisos).filter(Boolean).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Gestión de Administradores
          </h2>
          <p className="text-gray-600 mt-1">
            Administra los usuarios que pueden acceder al panel profesional
          </p>
        </div>
        <button
          onClick={handleNuevo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Administrador
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permisos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {administradores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay administradores registrados</p>
                    <p className="text-sm">Agrega el primer administrador profesional</p>
                  </td>
                </tr>
              ) : (
                administradores.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {admin.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {admin.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolBadge(admin.rol)}`}>
                        {admin.rol === 'super_admin' ? 'Super Admin' : 'Profesional'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {contarPermisos(admin.permisos)}/6 módulos
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActivo(admin.id, admin.activo)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.activo
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {admin.activo ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.ultimo_acceso 
                        ? new Date(admin.ultimo_acceso).toLocaleDateString()
                        : 'Nunca'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditar(admin)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(admin.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalAdministrador
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        administrador={administradorSeleccionado}
        onSave={cargarAdministradores}
      />
    </div>
  );
};

export default GestionAdministradores;