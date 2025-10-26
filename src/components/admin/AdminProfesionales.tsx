import React, { useEffect, useState } from 'react';
import { Edit, Mail, User, Crown, CheckCircle, AlertCircle, PlusCircle } from 'lucide-react';
import { Profesional, PlanSuscripcion } from '../../types';
import { profecionalesService } from '../../firebase/firestore';

interface EditarProfesionalModalProps {
  profesional: Profesional | null;
  onClose: () => void;
  onSaved: (updated: Profesional) => void;
}

function EditarProfesionalModal({ profesional, onClose, onSaved }: EditarProfesionalModalProps) {
  const [nombre, setNombre] = useState(profesional?.nombre || '');
  const [suscripcion, setSuscripcion] = useState<PlanSuscripcion>(profesional?.suscripcion || 'standard');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profesional) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await profecionalesService.updateProfesional(profesional.email, {
        nombre: nombre.trim() || undefined,
        suscripcion
      });
      onSaved({ ...profesional, nombre: nombre.trim() || undefined, suscripcion });
      onClose();
    } catch (e) {
      console.error('Error al actualizar profesional:', e);
      setError('No se pudo guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Edit className="text-purple-600" size={18} />
            <h3 className="text-lg font-semibold">Editar Profesional</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md text-gray-700 dark:text-gray-200">
              <Mail size={16} />
              <span>{profesional.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Nombre del profesional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suscripción</label>
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-amber-500" />
              <select
                value={suscripcion}
                onChange={(e) => setSuscripcion(e.target.value as PlanSuscripcion)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="standard">Standard</option>
                <option value="plus">Plus</option>
                <option value="pro_max">Pro Max</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 border border-red-200 rounded">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-md">Cancelar</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProfesionales() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Profesional | null>(null);

  const loadProfesionales = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await profecionalesService.getAllProfesionales();
      // Ordenamos por fecha si existe, sino por email
      const ordenados = list.sort((a, b) => {
        const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (ad !== bd) return bd - ad;
        return a.email.localeCompare(b.email);
      });
      setProfesionales(ordenados);
    } catch (e) {
      console.error('Error cargando profesionales:', e);
      setError('No se pudieron cargar los profesionales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfesionales();
  }, []);

  const handleEdit = (prof: Profesional) => {
    setSelected(prof);
    setShowModal(true);
  };

  const handleSaved = (updated: Profesional) => {
    setProfesionales(prev => prev.map(p => (p.email === updated.email ? updated : p)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Profesionales Registrados</h2>
          <p className="text-sm text-gray-600">Correos, nombre y suscripción desde Firestore</p>
        </div>
        <button
          onClick={loadProfesionales}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <PlusCircle size={16} />
          Refrescar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 border">
        {loading ? (
          <div className="py-8 text-center text-gray-500">Cargando profesionales...</div>
        ) : error ? (
          <div className="py-4 text-red-600 flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : profesionales.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No hay profesionales registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suscripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profesionales.map((p) => (
                  <tr key={p.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {p.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.nombre || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Crown size={14} />
                        {p.suscripcion || 'standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p.activo !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700">
                          <CheckCircle size={14} /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEdit(p)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        <Edit size={14} /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selected && (
        <EditarProfesionalModal
          profesional={selected}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}