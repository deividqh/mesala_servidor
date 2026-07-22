# Diseño propuesto de base de datos (MariaDB)

## Objetivos generales
- Autenticación con roles `admin` y `staff`.
- Un usuario (propietaria) puede administrar cero o más salones.
- Cada salón almacena la configuración JSON proveniente de `dicc_api_foto.configuracion` y puede tener múltiples fotos.
- Las fotos conservan el histórico completo (`dicc_reservas`, `dicc_indices`, `dicc_mensajes`, `configuracion`) y permiten marcar plantillas y publicaciones públicas con metadatos obligatorios.

## Entidades principales
### `usuario`
Credenciales y estado del personal. El campo `role` controla los permisos básicos. `is_active` permite suspender cuentas sin borrarlas. Se crean índices útiles para filtrar por rol y estado.

### `salon`
Configuración base sincronizada con el JSON entregado por la API. Los campos JSON tienen restricciones `JSON_VALID` para asegurar consistencia. `nombre` da un identificador legible para la UI.

### `foto`
Instantáneas inmutables. `captured_at` guarda la fecha efectiva de la captura; `created_at` indica cuándo llegó al servidor (puede diferir si se sube una foto histórica). Los flags `es_plantilla` y `es_publica` controlan visibilidad y reutilización.

Para las fotos públicas se almacena un `slug_publico` único, un mensaje obligatorio y la fecha de publicación (`publicada_at`). Esto facilita generar URLs amigables y mostrar contexto adicional cuando se comparte la foto. Todas las fotos guardan también la `configuracion` completa para restaurar la UI sin depender del estado del salón.

## Notas adicionales
- Todos los `TIMESTAMP(3)` se almacenan en UTC para cumplir la política adoptada.
- Las columnas JSON usan `utf8mb4` y se valida su formato para evitar datos corruptos.
- Si necesitas política de retención (p. ej. últimas 20 fotos por salón), se puede instrumentar con un job periódico que elimine los excesos siguiendo la consulta `ORDER BY captured_at DESC`.

