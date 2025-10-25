import React, { useState } from 'react';
import { Usuario } from '../../types';
import { Save, Eye, EyeOff, Upload, X, CheckCircle } from 'lucide-react';

interface EditarPerfilProps {
  user: Usuario;
  onUpdateUser: (userData: Partial<Usuario>) => Promise<void>;
}

type Profesion = 'estudiante' | 'cosmetologa' | 'dermatologa' | 'medico_estetico' | '';

export function EditarPerfil({ user, onUpdateUser }: EditarPerfilProps) {
  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    email: user.email || '',
    telefono: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profesion, setProfesion] = useState<Profesion>('');
  const [profesionValidada, setProfesionValidada] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validar que las contraseñas coincidan si se está cambiando
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setMessage('Las contraseñas no coinciden');
        return;
      }

      await onUpdateUser({
        nombre: formData.nombre,
        email: formData.email,
        // Aquí se agregaría la lógica para actualizar contraseña
      });

      setMessage('Perfil actualizado correctamente');
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage('Error al actualizar el perfil');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfesionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProfesion = e.target.value as Profesion;
    setProfesion(newProfesion);
    
    // Si no es estudiante, abrir modal para validar
    if (newProfesion && newProfesion !== 'estudiante') {
      setShowModal(true);
    } else if (newProfesion === 'estudiante') {
      setProfesionValidada(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Crear preview si es imagen
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleValidarProfesion = () => {
    if (selectedFile) {
      // Aquí se subiría el archivo al servidor
      console.log('Archivo a validar:', selectedFile);
      setProfesionValidada(true);
      setShowModal(false);
      setMessage('Profesión validada correctamente. Pendiente de aprobación.');
    } else {
      setMessage('Por favor, adjunta un documento que avale tu profesión');
    }
  };

  const handleCancelarModal = () => {
    setShowModal(false);
    setProfesion('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const getProfesionLabel = (prof: Profesion): string => {
    const labels: Record<string, string> = {
      'estudiante': 'Estudiante',
      'cosmetologa': 'Cosmetóloga',
      'dermatologa': 'Dermatóloga',
      'medico_estetico': 'Médico Estético'
    };
    return labels[prof] || '';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Editar Perfil
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="+34 123 456 789"
            />
          </div>

          <div>
            <label htmlFor="profesion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profesión
            </label>
            <div className="flex items-center gap-2">
              <select
                id="profesion"
                value={profesion}
                onChange={handleProfesionChange}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seleccionar...</option>
                <option value="estudiante">Estudiante</option>
                <option value="cosmetologa">Cosmetóloga</option>
                <option value="dermatologa">Dermatóloga</option>
                <option value="medico_estetico">Médico Estético</option>
              </select>
              {profesionValidada && (
                <span title="Profesión validada">
                  <CheckCircle size={20} className="text-green-500" />
                </span>
              )}
            </div>
            {profesion === 'estudiante' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Como estudiante, no necesitas adjuntar documentación
              </p>
            )}
          </div>
        </div>

        {/* Cambio de contraseña */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Cambiar contraseña
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes y botón de enviar */}
        <div className="flex items-center justify-between">
          {message && (
            <p className={`text-sm ${
              message.includes('Error') 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {message}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* Modal para validar profesión */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Validar Profesión
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getProfesionLabel(profesion)}
                </p>
              </div>
              <button
                onClick={handleCancelarModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Para validar tu profesión, adjunta un documento que avale tu título:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1 mb-4">
                  <li>Diploma o certificado profesional</li>
                  <li>Formatos aceptados: PDF, JPG, PNG</li>
                  <li>Tamaño máximo: 5MB</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile ? selectedFile.name : 'Click para seleccionar archivo'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    o arrastra y suelta aquí
                  </span>
                </label>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vista previa:
                  </p>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
                  />
                </div>
              )}

              {selectedFile && !previewUrl && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCancelarModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Cancelar
                </button>
                
                <button
                  type="button"
                  onClick={handleValidarProfesion}
                  disabled={!selectedFile}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Validar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}