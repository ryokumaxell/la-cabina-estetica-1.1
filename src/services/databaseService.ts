import { supabase } from '../config/supabase';
import { 
  Cliente, 
  ClienteInsert, 
  ClienteUpdate, 
  Procedimiento, 
  ProcedimientoInsert, 
  ProcedimientoUpdate,
  Cita,
  CitaInsert,
  CitaUpdate,
  Photo,
  PhotoInsert,
  PhotoUpdate,
  Consentimiento,
  ConsentimientoInsert,
  ConsentimientoUpdate
} from '../types';

// Helper function para verificar si Supabase está disponible
const checkSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase no está configurado');
  }
};

// =============================================
// Servicio de Clientes
// =============================================
export const clienteService = {
  // Obtener todos los clientes
  async getAll(): Promise<Cliente[]> {
    checkSupabase();

    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        photos:fotos(*),
        consentimientos(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clientes:', error);
      throw new Error('Error al obtener los clientes');
    }

    return data || [];
  },

  // Obtener un cliente por ID
  async getById(id: string): Promise<Cliente | null> {
    checkSupabase();
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        photos:fotos(*),
        consentimientos(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching cliente:', error);
      return null;
    }

    return data;
  },

  // Crear un nuevo cliente
  async create(cliente: ClienteInsert): Promise<Cliente> {
    checkSupabase();
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();

    if (error) {
      console.error('Error creating cliente:', error);
      throw new Error('Error al crear el cliente');
    }

    return data;
  },

  // Actualizar un cliente
  async update(id: string, updates: ClienteUpdate): Promise<Cliente> {
    checkSupabase();
    const { data, error } = await supabase
      .from('clientes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cliente:', error);
      throw new Error('Error al actualizar el cliente');
    }

    return data;
  },

  // Eliminar un cliente
  async delete(id: string): Promise<void> {
    checkSupabase();
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting cliente:', error);
      throw new Error('Error al eliminar el cliente');
    }
  },

  // Buscar clientes por nombre o email
  async search(query: string): Promise<Cliente[]> {
    checkSupabase();
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        photos:fotos(*),
        consentimientos(*)
      `)
      .or(`nombre_completo.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching clientes:', error);
      throw new Error('Error al buscar clientes');
    }

    return data || [];
  }
};

// =============================================
// Servicio de Historiales de Visitas (Procedimientos)
// =============================================
export const historialService = {
  // Obtener todos los historiales
  async getAll(): Promise<Procedimiento[]> {
    const { data, error } = await supabase
      .from('historiales_visitas')
      .select(`
        *,
        cliente:clientes(nombre_completo, email)
      `)
      .order('fecha_procedimiento', { ascending: false });

    if (error) {
      console.error('Error fetching historiales:', error);
      throw new Error('Error al obtener los historiales');
    }

    return data || [];
  },

  // Obtener historiales de un cliente específico
  async getByClienteId(clienteId: string): Promise<Procedimiento[]> {
    const { data, error } = await supabase
      .from('historiales_visitas')
      .select(`
        *,
        cliente:clientes(nombre_completo, email)
      `)
      .eq('cliente_id', clienteId)
      .order('fecha_procedimiento', { ascending: false });

    if (error) {
      console.error('Error fetching historiales by cliente:', error);
      throw new Error('Error al obtener los historiales del cliente');
    }

    return data || [];
  },

  // Obtener un historial por ID
  async getById(id: string): Promise<Procedimiento | null> {
    const { data, error } = await supabase
      .from('historiales_visitas')
      .select(`
        *,
        cliente:clientes(nombre_completo, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching historial:', error);
      return null;
    }

    return data;
  },

  // Crear un nuevo historial
  async create(historial: ProcedimientoInsert): Promise<Procedimiento> {
    const { data, error } = await supabase
      .from('historiales_visitas')
      .insert(historial)
      .select(`
        *,
        cliente:clientes(nombre_completo, email)
      `)
      .single();

    if (error) {
      console.error('Error creating historial:', error);
      throw new Error('Error al crear el historial');
    }

    return data;
  },

  // Actualizar un historial
  async update(id: string, updates: ProcedimientoUpdate): Promise<Procedimiento> {
    const { data, error } = await supabase
      .from('historiales_visitas')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        cliente:clientes(nombre_completo, email)
      `)
      .single();

    if (error) {
      console.error('Error updating historial:', error);
      throw new Error('Error al actualizar el historial');
    }

    return data;
  },

  // Eliminar un historial
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('historiales_visitas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting historial:', error);
      throw new Error('Error al eliminar el historial');
    }
  }
};

// =============================================
// Servicio de Citas
// =============================================
export const citaService = {
  // Obtener todas las citas
  async getAll(): Promise<Cita[]> {
    const { data, error } = await supabase
      .from('citas')
      .select(`
        *,
        cliente:clientes(nombre_completo, email, telefono)
      `)
      .order('fecha_inicio', { ascending: true });

    if (error) {
      console.error('Error fetching citas:', error);
      throw new Error('Error al obtener las citas');
    }

    return data || [];
  },

  // Obtener citas de un cliente específico
  async getByClienteId(clienteId: string): Promise<Cita[]> {
    const { data, error } = await supabase
      .from('citas')
      .select(`
        *,
        cliente:clientes(nombre_completo, email, telefono)
      `)
      .eq('cliente_id', clienteId)
      .order('fecha_inicio', { ascending: true });

    if (error) {
      console.error('Error fetching citas by cliente:', error);
      throw new Error('Error al obtener las citas del cliente');
    }

    return data || [];
  },

  // Obtener citas por rango de fechas
  async getByDateRange(startDate: string, endDate: string): Promise<Cita[]> {
    const { data, error } = await supabase
      .from('citas')
      .select(`
        *,
        cliente:clientes(nombre_completo, email, telefono)
      `)
      .gte('fecha_inicio', startDate)
      .lte('fecha_inicio', endDate)
      .order('fecha_inicio', { ascending: true });

    if (error) {
      console.error('Error fetching citas by date range:', error);
      throw new Error('Error al obtener las citas por rango de fechas');
    }

    return data || [];
  },

  // Crear una nueva cita
  async create(cita: CitaInsert): Promise<Cita> {
    const { data, error } = await supabase
      .from('citas')
      .insert(cita)
      .select(`
        *,
        cliente:clientes(nombre_completo, email, telefono)
      `)
      .single();

    if (error) {
      console.error('Error creating cita:', error);
      throw new Error('Error al crear la cita');
    }

    return data;
  },

  // Actualizar una cita
  async update(id: string, updates: CitaUpdate): Promise<Cita> {
    const { data, error } = await supabase
      .from('citas')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        cliente:clientes(nombre_completo, email, telefono)
      `)
      .single();

    if (error) {
      console.error('Error updating cita:', error);
      throw new Error('Error al actualizar la cita');
    }

    return data;
  },

  // Eliminar una cita
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting cita:', error);
      throw new Error('Error al eliminar la cita');
    }
  }
};

// =============================================
// Servicio de Fotos
// =============================================
export const photoService = {
  // Obtener fotos de un cliente
  async getByClienteId(clienteId: string): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      throw new Error('Error al obtener las fotos');
    }

    return data || [];
  },

  // Crear una nueva foto
  async create(photo: PhotoInsert): Promise<Photo> {
    const { data, error } = await supabase
      .from('fotos')
      .insert(photo)
      .select()
      .single();

    if (error) {
      console.error('Error creating photo:', error);
      throw new Error('Error al crear la foto');
    }

    return data;
  },

  // Eliminar una foto
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('fotos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting photo:', error);
      throw new Error('Error al eliminar la foto');
    }
  }
};

// =============================================
// Servicio de Consentimientos
// =============================================
export const consentimientoService = {
  // Obtener consentimientos de un cliente
  async getByClienteId(clienteId: string): Promise<Consentimiento[]> {
    const { data, error } = await supabase
      .from('consentimientos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching consentimientos:', error);
      throw new Error('Error al obtener los consentimientos');
    }

    return data || [];
  },

  // Crear un nuevo consentimiento
  async create(consentimiento: ConsentimientoInsert): Promise<Consentimiento> {
    const { data, error } = await supabase
      .from('consentimientos')
      .insert(consentimiento)
      .select()
      .single();

    if (error) {
      console.error('Error creating consentimiento:', error);
      throw new Error('Error al crear el consentimiento');
    }

    return data;
  },

  // Eliminar un consentimiento
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('consentimientos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting consentimiento:', error);
      throw new Error('Error al eliminar el consentimiento');
    }
  }
};
