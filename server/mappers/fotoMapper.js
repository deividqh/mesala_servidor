// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████  MAPEO FOTO BDD <-> API
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/** ### MariaDB puede devolver JSON como texto o como objeto según la configuración. */
function parsearJson(valor) {
  if (valor === null || valor === undefined) return null;
  if (typeof valor === 'string') return JSON.parse(valor);
  return valor;
}

/** ### Normaliza las fechas de MariaDB al formato ISO que consume el cliente. */
function fechaIso(valor) {
  if (!valor) return null;
  const fecha = valor instanceof Date ? valor : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
}

/** ### Construye el contrato completo que se devuelve al cliente. */
function mapearFoto(row) {
  if (!row) return null;

  return {
    id: Number(row.id),
    usuario_id: Number(row.usuario_id),
    schema_version: Number(row.schema_version),
    slug: row.slug,
    captured_at: fechaIso(row.captured_at),
    created_at: fechaIso(row.created_at),
    updated_at: fechaIso(row.updated_at),
    salon: parsearJson(row.salon),
    app: parsearJson(row.app),
    ficha_foto: {
      titulo: row.titulo,
      mensaje: row.mensaje,
      es_cerrada: Boolean(row.es_cerrada),
      es_favorita: Boolean(row.es_favorita),
    },
    motores: parsearJson(row.motores),
    rangos: parsearJson(row.rangos),
  };
}

/** ### Construye una ficha ligera para el listado privado. */
function mapearResumenFoto(row) {
  const salon = parsearJson(row.salon) || {};

  return {
    id: Number(row.id),
    schema_version: Number(row.schema_version),
    slug: row.slug,
    captured_at: fechaIso(row.captured_at),
    created_at: fechaIso(row.created_at),
    updated_at: fechaIso(row.updated_at),
    salon: {
      nombre_salon: salon.nombre_salon,
      tipo_salon: salon.tipo_salon,
      filas: salon.filas,
      columnas: salon.columnas,
    },
    ficha_foto: {
      titulo: row.titulo,
      mensaje: row.mensaje,
      es_cerrada: Boolean(row.es_cerrada),
      es_favorita: Boolean(row.es_favorita),
    },
  };
}

module.exports = {
  mapearFoto,
  mapearResumenFoto,
  parsearJson,
};
