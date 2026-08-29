# Base de datos Mesala v2

La relación persistente es `usuario (1) -> (N) foto`. No existe una tabla `salon`: cada foto contiene una instantánea autónoma dentro de los JSON `salon`, `app`, `motores` y `rangos`.

## Responsabilidad de las fechas

- `captured_at`: la envía el cliente al tomar o sobrescribir la instantánea.
- `created_at`: la genera MariaDB al crear la fila.
- `updated_at`: la actualiza MariaDB al modificar la fila.

## Metadatos

`titulo`, `mensaje`, `slug`, `es_cerrada` y `es_favorita` son columnas relacionales. La API los agrupa dentro de `ficha_foto`. El slug es obligatorio y globalmente único; el mensaje puede ser `NULL`.

## Contrato JSON

`schema_version = 1` identifica el contrato actual. Antes de insertar o actualizar, el servidor valida forma, límites y referencias cruzadas. `motores.app_compatible` contiene la compatibilidad de aplicación.

Los scripts `schema.sql` y `crear_mesala_dev.sql` representan el modelo reproducible. La aplicación no crea ni altera tablas durante el arranque.
