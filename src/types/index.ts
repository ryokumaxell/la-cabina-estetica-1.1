export interface Cliente {
  id: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  genero: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decir';
  alergias: string[];
  medicamentos_actuales: string[];
  notas_medicas: string;
  photos: Photo[];
  consentimientos: Consentimiento[];
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

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'cosmiatra' | 'asistente' | 'recepcionista';
  ultimo_login: string;
  config_notificaciones: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export type ViewMode = 'dashboard' | 'clientes' | 'citas' | 'procedimientos' | 'reportes';