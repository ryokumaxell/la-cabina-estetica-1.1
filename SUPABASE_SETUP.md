# Configuración de Supabase para La Cabina Estética

## Pasos para conectar tu proyecto con Supabase

### 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Elige tu organización
5. Completa los detalles del proyecto:
   - **Name**: `la-cabina-estetica`
   - **Database Password**: (guarda esta contraseña en un lugar seguro)
   - **Region**: Elige la región más cercana a tu ubicación
6. Haz clic en "Create new project"

### 2. Obtener las credenciales del proyecto

1. Una vez que tu proyecto esté listo, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (algo como: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)

### 3. Configurar las variables de entorno

1. En la raíz de tu proyecto, crea un archivo llamado `.env.local`
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=tu_project_url_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Ejemplo:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Crear las tablas en Supabase

1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Copia todo el contenido del archivo `database-schema.sql` que está en la raíz de tu proyecto
3. Pega el código en el editor SQL
4. Haz clic en **Run** para ejecutar el script

Esto creará todas las tablas necesarias:
- `clientes` - Información de los clientes
- `historiales_visitas` - Registro de procedimientos realizados
- `citas` - Programación de citas
- `fotos` - Fotografías de antes/después
- `consentimientos` - Documentos de consentimiento

### 5. Verificar la configuración

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre tu aplicación en el navegador
3. Deberías ver que los datos se cargan desde Supabase en lugar de los datos mock

### 6. Configurar políticas de seguridad (RLS)

Las políticas de Row Level Security (RLS) ya están configuradas en el script SQL, pero puedes ajustarlas según tus necesidades:

1. Ve a **Authentication** > **Policies** en tu dashboard de Supabase
2. Revisa las políticas creadas para cada tabla
3. Modifica si necesitas restricciones adicionales

### 7. Configurar autenticación (Opcional)

Si quieres agregar autenticación de usuarios:

1. Ve a **Authentication** > **Settings**
2. Configura los proveedores de autenticación que necesites
3. Actualiza las políticas RLS para incluir verificaciones de usuario

## Estructura de la Base de Datos

### Tabla `clientes`
- Información personal y médica de los clientes
- Campos: id, nombre_completo, fecha_nacimiento, telefono, email, direccion, genero, alergias, medicamentos_actuales, notas_medicas

### Tabla `historiales_visitas`
- Registro detallado de todos los procedimientos realizados
- Campos: id, cliente_id, tipo_servicio, protocolo, productos_usados, observaciones, responsable, duracion_min, costo, fotos, fecha_procedimiento

### Tabla `citas`
- Programación de citas y consultas
- Campos: id, cliente_id, servicio, fecha_inicio, fecha_fin, estado, responsable, notas, recordatorios_enviados

### Tabla `fotos`
- Fotografías antes, durante y después de procedimientos
- Campos: id, cliente_id, url, tipo, fecha, descripcion, procedimiento_id

### Tabla `consentimientos`
- Documentos de consentimiento informado
- Campos: id, cliente_id, tipo, fecha, metodo, archivo

## Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env.local` existe y tiene las variables correctas
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo

### Error de conexión a la base de datos
- Verifica que la URL y la clave anónima sean correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Revisa la consola del navegador para más detalles del error

### Las tablas no se crearon
- Verifica que ejecutaste todo el script SQL completo
- Revisa la pestaña "Logs" en Supabase para ver si hay errores
- Asegúrate de tener permisos de administrador en el proyecto

## Próximos Pasos

1. **Subir archivos**: Configura Supabase Storage para subir fotos de clientes
2. **Notificaciones**: Integra servicios de email/SMS para recordatorios de citas
3. **Reportes**: Crea vistas y funciones para generar reportes avanzados
4. **Backup**: Configura backups automáticos de la base de datos

## Soporte

Si tienes problemas con la configuración:
1. Revisa los logs en la consola del navegador
2. Verifica la documentación de Supabase: [docs.supabase.com](https://docs.supabase.com)
3. Revisa el estado de los servicios de Supabase: [status.supabase.com](https://status.supabase.com)
