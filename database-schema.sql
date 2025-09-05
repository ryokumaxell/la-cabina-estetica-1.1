-- =============================================
-- Esquema de Base de Datos para La Cabina Estética
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Tabla de Clientes
-- =============================================
CREATE TABLE IF NOT EXISTS clientes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    direccion TEXT,
    genero VARCHAR(20) CHECK (genero IN ('Femenino', 'Masculino', 'Otro', 'Prefiero no decir')) NOT NULL,
    alergias TEXT[] DEFAULT '{}',
    medicamentos_actuales TEXT[] DEFAULT '{}',
    notas_medicas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Tabla de Historiales de Visitas (Procedimientos)
-- =============================================
CREATE TABLE IF NOT EXISTS historiales_visitas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo_servicio VARCHAR(255) NOT NULL,
    protocolo TEXT NOT NULL,
    productos_usados JSONB DEFAULT '[]',
    observaciones TEXT,
    responsable VARCHAR(255) NOT NULL,
    duracion_min INTEGER NOT NULL CHECK (duracion_min > 0),
    costo DECIMAL(10,2) NOT NULL CHECK (costo >= 0),
    fotos TEXT[] DEFAULT '{}',
    fecha_procedimiento TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Tabla de Citas
-- =============================================
CREATE TABLE IF NOT EXISTS citas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    servicio VARCHAR(255) NOT NULL,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('programada', 'confirmada', 'realizada', 'cancelada', 'no_show')) DEFAULT 'programada',
    responsable VARCHAR(255) NOT NULL,
    notas TEXT,
    recordatorios_enviados BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Tabla de Fotos
-- =============================================
CREATE TABLE IF NOT EXISTS fotos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('antes', 'despues', 'procedimiento')) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    descripcion TEXT,
    procedimiento_id UUID REFERENCES historiales_visitas(id) ON DELETE SET NULL
);

-- =============================================
-- Tabla de Consentimientos
-- =============================================
CREATE TABLE IF NOT EXISTS consentimientos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo VARCHAR(255) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    metodo VARCHAR(20) CHECK (metodo IN ('digital', 'fisico')) NOT NULL,
    archivo TEXT NOT NULL
);

-- =============================================
-- Índices para optimizar consultas
-- =============================================

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre_completo);

-- Índices para historiales de visitas
CREATE INDEX IF NOT EXISTS idx_historiales_cliente_id ON historiales_visitas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_historiales_fecha ON historiales_visitas(fecha_procedimiento);
CREATE INDEX IF NOT EXISTS idx_historiales_tipo_servicio ON historiales_visitas(tipo_servicio);

-- Índices para citas
CREATE INDEX IF NOT EXISTS idx_citas_cliente_id ON citas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha_inicio ON citas(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);
CREATE INDEX IF NOT EXISTS idx_citas_responsable ON citas(responsable);

-- Índices para fotos
CREATE INDEX IF NOT EXISTS idx_fotos_cliente_id ON fotos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_fotos_tipo ON fotos(tipo);
CREATE INDEX IF NOT EXISTS idx_fotos_procedimiento_id ON fotos(procedimiento_id);

-- Índices para consentimientos
CREATE INDEX IF NOT EXISTS idx_consentimientos_cliente_id ON consentimientos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_consentimientos_tipo ON consentimientos(tipo);

-- =============================================
-- Funciones y Triggers
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en clientes
CREATE TRIGGER update_clientes_updated_at 
    BEFORE UPDATE ON clientes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Políticas de Seguridad (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historiales_visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimientos ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes (permitir todas las operaciones para usuarios autenticados)
CREATE POLICY "Permitir todas las operaciones en clientes para usuarios autenticados" 
    ON clientes FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas para historiales_visitas
CREATE POLICY "Permitir todas las operaciones en historiales para usuarios autenticados" 
    ON historiales_visitas FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas para citas
CREATE POLICY "Permitir todas las operaciones en citas para usuarios autenticados" 
    ON citas FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas para fotos
CREATE POLICY "Permitir todas las operaciones en fotos para usuarios autenticados" 
    ON fotos FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas para consentimientos
CREATE POLICY "Permitir todas las operaciones en consentimientos para usuarios autenticados" 
    ON consentimientos FOR ALL 
    TO authenticated 
    USING (true);

-- =============================================
-- Datos de Ejemplo (Opcional)
-- =============================================

-- Insertar algunos datos de ejemplo para testing
INSERT INTO clientes (nombre_completo, fecha_nacimiento, telefono, email, direccion, genero, alergias, medicamentos_actuales, notas_medicas) VALUES
('María Pérez Santos', '1989-05-21', '+1 809 555 1234', 'maria.perez@email.com', 'Av. Winston Churchill #45, Santo Domingo', 'Femenino', ARRAY['ácido salicílico', 'parabenos'], ARRAY['metformina', 'vitamina D'], 'Piel sensible. Evitar exposición solar 48h post-peeling. Tendencia a hiperpigmentación.'),
('Carmen López', '1995-03-15', '+1 809 555 5678', 'carmen.lopez@email.com', 'Calle El Conde #12, Zona Colonial', 'Femenino', ARRAY['ninguna conocida'], ARRAY[]::TEXT[], 'Primera consulta. Piel grasa con tendencia acneica. Muy motivada con el tratamiento.'),
('Isabella Martínez', '1987-11-28', '+1 809 555 9012', 'isabella.martinez@email.com', 'Av. Sarasota #78, Bella Vista', 'Femenino', ARRAY['retinol'], ARRAY['anticonceptivos'], 'Cliente recurrente. Excelente adherencia al tratamiento. Piel madura con líneas de expresión.')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- Comentarios de la Base de Datos
-- =============================================

COMMENT ON TABLE clientes IS 'Información personal y médica de los clientes de la clínica estética';
COMMENT ON TABLE historiales_visitas IS 'Registro detallado de todos los procedimientos realizados a cada cliente';
COMMENT ON TABLE citas IS 'Programación de citas y consultas de los clientes';
COMMENT ON TABLE fotos IS 'Fotografías antes, durante y después de los procedimientos';
COMMENT ON TABLE consentimientos IS 'Documentos de consentimiento informado firmados por los clientes';

COMMENT ON COLUMN clientes.alergias IS 'Array de alergias conocidas del cliente';
COMMENT ON COLUMN clientes.medicamentos_actuales IS 'Array de medicamentos que está tomando actualmente';
COMMENT ON COLUMN historiales_visitas.productos_usados IS 'JSON con información de productos utilizados (nombre, lote, cantidad)';
COMMENT ON COLUMN historiales_visitas.fotos IS 'Array de URLs de fotos asociadas al procedimiento';
COMMENT ON COLUMN citas.estado IS 'Estado actual de la cita: programada, confirmada, realizada, cancelada, no_show';
COMMENT ON COLUMN fotos.tipo IS 'Tipo de foto: antes, despues, procedimiento';
COMMENT ON COLUMN consentimientos.metodo IS 'Método de firma: digital o fisico';
