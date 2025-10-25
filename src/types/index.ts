export interface Cliente {
  id: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  telefono: string;
  email?: string | null;
  direccion: string;
  genero: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decir';
  alergias: string[];
  medicamentos_actuales: string[];
  notas_medicas: string;
  photos?: Photo[];
  consentimientos?: Consentimiento[];
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  url: string;
  tipo: 'antes' | 'despues' | 'procedimiento';
  fecha: string;
  descripcion: string;
  procedimiento_id?: string;
}

export interface Consentimiento {
  id: string;
  tipo: string;
  fecha: string;
  metodo: 'digital' | 'fisico';
  archivo: string;
}

export interface Procedimiento {
  id: string;
  cliente_id: string;
  tipo_servicio: string;
  protocolo: string;
  productos_usados: ProductoUsado[];
  observaciones: string;
  responsable: string;
  duracion_min: number;
  costo: number;
  fotos: string[];
  fecha_procedimiento: string;
  created_at: string;
}

// Alias para compatibilidad con la base de datos
export type HistorialVisita = Procedimiento;

export interface ProductoUsado {
  nombre: string;
  lote: string;
  cantidad: string;
}

export interface Cita {
  id: string;
  cliente_id: string;
  cliente_nombre?: string;
  servicio: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_show';
  responsable: string;
  notas: string;
  recordatorios_enviados: boolean;
  created_at: string;
}

// Tipos para operaciones de base de datos
export type ClienteInsert = Omit<Cliente, 'id' | 'created_at' | 'updated_at' | 'photos' | 'consentimientos'>;

export type ClienteUpdate = Partial<Omit<Cliente, 'id' | 'created_at' | 'photos' | 'consentimientos'>>;

export type ProcedimientoInsert = Omit<Procedimiento, 'id' | 'created_at'>;
export type ProcedimientoUpdate = Partial<Omit<Procedimiento, 'id' | 'created_at'>>;

export type CitaInsert = Omit<Cita, 'id' | 'created_at' | 'cliente_nombre'>;
export type CitaUpdate = Partial<Omit<Cita, 'id' | 'created_at' | 'cliente_nombre'>>;

export type PhotoInsert = Omit<Photo, 'id'>;
export type PhotoUpdate = Partial<Omit<Photo, 'id'>>;

export type ConsentimientoInsert = Omit<Consentimiento, 'id'>;
export type ConsentimientoUpdate = Partial<Omit<Consentimiento, 'id'>>;

export interface Usuario {
  id: string;
  nombre: string;
  email?: string | null;
  rol: 'admin' | 'cosmiatra' | 'asistente' | 'recepcionista' | 'cosmetologa' | 'dermatologo' | 'estudiante';
  ultimo_login: string;
  activo?: boolean;
  config_notificaciones: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

// Interfaces para el sistema de administración
export interface Administrador {
  id: string;
  email: string;
  nombre: string;
  rol: 'super_admin' | 'admin';
  activo: boolean;
  created_at: string;
  ultimo_acceso?: string;
}

export interface UsuarioAutorizado {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'cosmiatra' | 'asistente' | 'recepcionista' | 'cosmetologa' | 'dermatologo' | 'estudiante';
  activo: boolean;
  autorizado_por: string; // Email del administrador que lo autorizó
  fecha_autorizacion: string;
  ultimo_acceso?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  rol?: string;
  esAdministrador?: boolean;
  esUsuarioAutorizado?: boolean;
}

export type ViewMode = 'dashboard' | 'clientes' | 'citas' | 'procedimientos' | 'reportes' | 'finanzas' | 'configuracion' | 'facturacion' | 'usuarios';