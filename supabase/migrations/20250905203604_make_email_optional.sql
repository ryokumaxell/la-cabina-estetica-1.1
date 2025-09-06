-- Hacer que el campo email sea opcional
ALTER TABLE clientes 
ALTER COLUMN email DROP NOT NULL,
DROP CONSTRAINT IF EXISTS clientes_email_key;

-- Actualizar la restricción UNIQUE para permitir múltiples valores NULL
CREATE UNIQUE INDEX IF NOT EXISTS clientes_email_key ON clientes (email) WHERE email IS NOT NULL;
