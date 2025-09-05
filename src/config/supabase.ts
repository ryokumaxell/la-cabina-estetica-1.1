import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar si las variables de entorno están configuradas correctamente
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('tu-proyecto') && 
  !supabaseAnonKey.includes('tu_clave');

let supabase: any = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase configurado correctamente');
  } catch (error) {
    console.warn('⚠️ Error al configurar Supabase:', error);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase no configurado - usando datos mock');
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre_completo: string;
          fecha_nacimiento: string;
          telefono: string;
          email: string;
          direccion: string;
          genero: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decir';
          alergias?: string[];
          medicamentos_actuales?: string[];
          notas_medicas?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre_completo?: string;
          fecha_nacimiento?: string;
          telefono?: string;
          email?: string;
          direccion?: string;
          genero?: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no decir';
          alergias?: string[];
          medicamentos_actuales?: string[];
          notas_medicas?: string;
          updated_at?: string;
        };
      };
      historiales_visitas: {
        Row: {
          id: string;
          cliente_id: string;
          tipo_servicio: string;
          protocolo: string;
          productos_usados: any[];
          observaciones: string;
          responsable: string;
          duracion_min: number;
          costo: number;
          fotos: string[];
          fecha_procedimiento: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          tipo_servicio: string;
          protocolo: string;
          productos_usados?: any[];
          observaciones?: string;
          responsable: string;
          duracion_min: number;
          costo: number;
          fotos?: string[];
          fecha_procedimiento: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          tipo_servicio?: string;
          protocolo?: string;
          productos_usados?: any[];
          observaciones?: string;
          responsable?: string;
          duracion_min?: number;
          costo?: number;
          fotos?: string[];
          fecha_procedimiento?: string;
        };
      };
      citas: {
        Row: {
          id: string;
          cliente_id: string;
          servicio: string;
          fecha_inicio: string;
          fecha_fin: string;
          estado: 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_show';
          responsable: string;
          notas: string;
          recordatorios_enviados: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          servicio: string;
          fecha_inicio: string;
          fecha_fin: string;
          estado?: 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_show';
          responsable: string;
          notas?: string;
          recordatorios_enviados?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          servicio?: string;
          fecha_inicio?: string;
          fecha_fin?: string;
          estado?: 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_show';
          responsable?: string;
          notas?: string;
          recordatorios_enviados?: boolean;
        };
      };
      fotos: {
        Row: {
          id: string;
          cliente_id: string;
          url: string;
          tipo: 'antes' | 'despues' | 'procedimiento';
          fecha: string;
          descripcion: string;
          procedimiento_id?: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          url: string;
          tipo: 'antes' | 'despues' | 'procedimiento';
          fecha: string;
          descripcion: string;
          procedimiento_id?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          url?: string;
          tipo?: 'antes' | 'despues' | 'procedimiento';
          fecha?: string;
          descripcion?: string;
          procedimiento_id?: string;
        };
      };
      consentimientos: {
        Row: {
          id: string;
          cliente_id: string;
          tipo: string;
          fecha: string;
          metodo: 'digital' | 'fisico';
          archivo: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          tipo: string;
          fecha: string;
          metodo: 'digital' | 'fisico';
          archivo: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          tipo?: string;
          fecha?: string;
          metodo?: 'digital' | 'fisico';
          archivo?: string;
        };
      };
    };
  };
}
