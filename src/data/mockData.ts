import { Cliente, Procedimiento, Cita, Usuario } from '../types';

export const mockUsuarios: Usuario[] = [
  {
    id: 'u1',
    nombre: 'Dra. Ana García',
    email: 'ana@cosmetica.com',
    rol: 'cosmiatra',
    ultimo_login: '2025-01-08T10:00:00Z',
    config_notificaciones: {
      email: true,
      sms: true,
      whatsapp: true
    }
  },
  {
    id: 'u2',
    nombre: 'María Rodríguez',
    email: 'maria@cosmetica.com',
    rol: 'asistente',
    ultimo_login: '2025-01-08T09:30:00Z',
    config_notificaciones: {
      email: true,
      sms: false,
      whatsapp: true
    }
  }
];

export const mockClientes: Cliente[] = [
  {
    id: 'c1',
    nombre_completo: 'María Pérez Santos',
    fecha_nacimiento: '1989-05-21',
    telefono: '+1 809 555 1234',
    email: 'maria.perez@email.com',
    direccion: 'Av. Winston Churchill #45, Santo Domingo',
    genero: 'Femenino',
    alergias: ['ácido salicílico', 'parabenos'],
    medicamentos_actuales: ['metformina', 'vitamina D'],
    notas_medicas: 'Piel sensible. Evitar exposición solar 48h post-peeling. Tendencia a hiperpigmentación.',
    photos: [
      {
        id: 'p1',
        url: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg',
        tipo: 'antes',
        fecha: '2025-01-01T10:00:00Z',
        descripcion: 'Estado inicial - Consulta'
      },
      {
        id: 'p2',
        url: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg',
        tipo: 'despues',
        fecha: '2025-01-01T11:30:00Z',
        descripcion: 'Después del peeling químico'
      }
    ],
    consentimientos: [
      {
        id: 'con1',
        tipo: 'Peeling Químico',
        fecha: '2025-01-01T09:30:00Z',
        metodo: 'digital',
        archivo: 'consent-peeling-maria.pdf'
      }
    ],
    created_at: '2025-01-01T09:00:00Z',
    updated_at: '2025-01-01T11:45:00Z'
  },
  {
    id: 'c2',
    nombre_completo: 'Carmen López',
    fecha_nacimiento: '1995-03-15',
    telefono: '+1 809 555 5678',
    email: 'carmen.lopez@email.com',
    direccion: 'Calle El Conde #12, Zona Colonial',
    genero: 'Femenino',
    alergias: ['ninguna conocida'],
    medicamentos_actuales: [],
    notas_medicas: 'Primera consulta. Piel grasa con tendencia acneica. Muy motivada con el tratamiento.',
    photos: [
      {
        id: 'p3',
        url: 'https://images.pexels.com/photos/3762873/pexels-photo-3762873.jpeg',
        tipo: 'antes',
        fecha: '2025-01-03T14:00:00Z',
        descripcion: 'Evaluación inicial'
      }
    ],
    consentimientos: [],
    created_at: '2025-01-03T14:00:00Z',
    updated_at: '2025-01-03T15:30:00Z'
  },
  {
    id: 'c3',
    nombre_completo: 'Isabella Martínez',
    fecha_nacimiento: '1987-11-28',
    telefono: '+1 809 555 9012',
    email: 'isabella.martinez@email.com',
    direccion: 'Av. Sarasota #78, Bella Vista',
    genero: 'Femenino',
    alergias: ['retinol'],
    medicamentos_actuales: ['anticonceptivos'],
    notas_medicas: 'Cliente recurrente. Excelente adherencia al tratamiento. Piel madura con líneas de expresión.',
    photos: [
      {
        id: 'p4',
        url: 'https://images.pexels.com/photos/3192601/pexels-photo-3192601.jpeg',
        tipo: 'antes',
        fecha: '2025-01-05T16:00:00Z',
        descripcion: 'Antes del tratamiento antienvejecimiento'
      }
    ],
    consentimientos: [
      {
        id: 'con2',
        tipo: 'Tratamiento Antienvejecimiento',
        fecha: '2025-01-05T15:45:00Z',
        metodo: 'digital',
        archivo: 'consent-antiaging-isabella.pdf'
      }
    ],
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2025-01-05T17:00:00Z'
  }
];

export const mockProcedimientos: Procedimiento[] = [
  {
    id: 'proc1',
    cliente_id: 'c1',
    tipo_servicio: 'Peeling Químico Superficial',
    protocolo: '1. Desmaquillar completamente\n2. Limpiar con solución desengrasante\n3. Aplicar ácido glicólico 30% por 3 minutos\n4. Neutralizar con bicarbonato\n5. Aplicar protector solar SPF 50+',
    productos_usados: [
      { nombre: 'Ácido Glicólico 30%', lote: 'GL-2025-01', cantidad: '2ml' },
      { nombre: 'Neutralizador', lote: 'NT-2024-12', cantidad: '5ml' },
      { nombre: 'Protector Solar SPF 50+', lote: 'PS-2025-01', cantidad: '1 aplicación' }
    ],
    observaciones: 'Paciente toleró muy bien el procedimiento. Ligero enrojecimiento que desapareció en 30 minutos. Se le proporcionaron instrucciones post-tratamiento.',
    responsable: 'u1',
    duracion_min: 45,
    costo: 3500,
    fotos: ['p1', 'p2'],
    fecha_procedimiento: '2025-01-01T10:30:00Z',
    created_at: '2025-01-01T11:45:00Z'
  },
  {
    id: 'proc2',
    cliente_id: 'c2',
    tipo_servicio: 'Limpieza Facial Profunda',
    protocolo: '1. Doble limpieza\n2. Exfoliación enzimática\n3. Extracción de comedones\n4. Máscara purificante 15 min\n5. Hidratación con ácido hialurónico',
    productos_usados: [
      { nombre: 'Gel Limpiador', lote: 'CL-2025-01', cantidad: '3ml' },
      { nombre: 'Exfoliante Enzimático', lote: 'EX-2024-12', cantidad: '2ml' },
      { nombre: 'Máscara Purificante', lote: 'MP-2025-01', cantidad: '10ml' }
    ],
    observaciones: 'Primera sesión. Piel con muchas impurezas. Se recomienda repetir en 15 días. Cliente muy satisfecha con los resultados inmediatos.',
    responsable: 'u2',
    duracion_min: 60,
    costo: 2800,
    fotos: ['p3'],
    fecha_procedimiento: '2025-01-03T14:30:00Z',
    created_at: '2025-01-03T15:45:00Z'
  },
  {
    id: 'proc3',
    cliente_id: 'c3',
    tipo_servicio: 'Tratamiento Antienvejecimiento',
    protocolo: '1. Limpieza profunda\n2. Aplicación de vitamina C\n3. Microagujas con ácido hialurónico\n4. Máscara de colágeno\n5. Sérum regenerador',
    productos_usados: [
      { nombre: 'Sérum Vitamina C', lote: 'VC-2025-01', cantidad: '1ml' },
      { nombre: 'Ácido Hialurónico', lote: 'AH-2024-12', cantidad: '0.5ml' },
      { nombre: 'Máscara Colágeno', lote: 'MC-2025-01', cantidad: '1 unidad' }
    ],
    observaciones: 'Excelente respuesta al tratamiento. Piel más firme y luminosa inmediatamente. Programar próxima sesión en 3 semanas.',
    responsable: 'u1',
    duracion_min: 90,
    costo: 5500,
    fotos: ['p4'],
    fecha_procedimiento: '2025-01-05T16:30:00Z',
    created_at: '2025-01-05T18:15:00Z'
  }
];

export const mockCitas: Cita[] = [
  {
    id: 'apt1',
    cliente_id: 'c1',
    cliente_nombre: 'María Pérez Santos',
    servicio: 'Peeling Químico de Seguimiento',
    fecha_inicio: '2025-01-10T10:00:00Z',
    fecha_fin: '2025-01-10T10:45:00Z',
    estado: 'confirmada',
    responsable: 'u1',
    notas: 'Segunda sesión de peeling. Revisar evolución.',
    recordatorios_enviados: true,
    created_at: '2025-01-08T09:00:00Z'
  },
  {
    id: 'apt2',
    cliente_id: 'c2',
    cliente_nombre: 'Carmen López',
    servicio: 'Limpieza Facial',
    fecha_inicio: '2025-01-10T14:30:00Z',
    fecha_fin: '2025-01-10T15:30:00Z',
    estado: 'programada',
    responsable: 'u2',
    notas: 'Segunda sesión de limpieza profunda.',
    recordatorios_enviados: false,
    created_at: '2025-01-08T11:15:00Z'
  },
  {
    id: 'apt3',
    cliente_id: 'c3',
    cliente_nombre: 'Isabella Martínez',
    servicio: 'Consulta de Evaluación',
    fecha_inicio: '2025-01-11T16:00:00Z',
    fecha_fin: '2025-01-11T16:30:00Z',
    estado: 'programada',
    responsable: 'u1',
    notas: 'Evaluación de resultados del tratamiento antienvejecimiento.',
    recordatorios_enviados: false,
    created_at: '2025-01-08T16:20:00Z'
  },
  {
    id: 'apt4',
    cliente_id: 'c1',
    cliente_nombre: 'María Pérez Santos',
    servicio: 'Hidratación Profunda',
    fecha_inicio: '2025-01-12T11:00:00Z',
    fecha_fin: '2025-01-12T12:00:00Z',
    estado: 'programada',
    responsable: 'u1',
    notas: 'Tratamiento complementario post-peeling.',
    recordatorios_enviados: false,
    created_at: '2025-01-09T10:30:00Z'
  }
];