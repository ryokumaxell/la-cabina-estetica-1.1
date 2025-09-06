-- =============================================
-- Migración: Hacer campos opcionales en tabla clientes
-- =============================================

-- Hacer fecha_nacimiento opcional
ALTER TABLE clientes 
ALTER COLUMN fecha_nacimiento DROP NOT NULL;

-- Hacer email opcional (ya tiene una migración previa, pero verificamos)
ALTER TABLE clientes 
ALTER COLUMN email DROP NOT NULL;

-- Hacer genero opcional
ALTER TABLE clientes 
ALTER COLUMN genero DROP NOT NULL;

-- Actualizar el constraint UNIQUE para email para permitir múltiples valores NULL
-- Primero eliminamos el constraint existente
ALTER TABLE clientes 
DROP CONSTRAINT IF EXISTS clientes_email_key;

-- Luego creamos uno parcial que solo aplique cuando email NO es NULL
CREATE UNIQUE INDEX clientes_email_unique 
ON clientes(email) 
WHERE email IS NOT NULL;