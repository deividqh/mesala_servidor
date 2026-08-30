// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████  CONSULTAS DE FOTO
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const pool = require('../config/db');

const COLUMNAS_FOTO = `
  id, usuario_id, titulo, mensaje, slug, schema_version,
  captured_at, created_at, updated_at,
  es_cerrada, es_favorita, salon, app, motores, rangos
`;

/** ### Inserta una foto ligada directamente al usuario autenticado. */
async function crear(usuarioId, foto) {
  const [result] = await pool.query(
    `INSERT INTO foto (
      usuario_id, titulo, mensaje, slug, schema_version, captured_at,
      es_cerrada, es_favorita, salon, app, motores, rangos
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuarioId,
      foto.ficha_foto.titulo,
      foto.ficha_foto.mensaje,
      foto.slug,
      foto.schema_version,
      foto.captured_at,
      foto.ficha_foto.es_cerrada ? 1 : 0,
      foto.ficha_foto.es_favorita ? 1 : 0,
      JSON.stringify(foto.salon),
      JSON.stringify(foto.app),
      JSON.stringify(foto.motores),
      JSON.stringify(foto.rangos),
    ]
  );

  return result.insertId;
}

/** ### Devuelve las fichas ligeras del usuario actual. */
async function listarPorUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT
      id, titulo, mensaje, slug, schema_version,
      captured_at, created_at, updated_at,
      es_cerrada, es_favorita, salon
     FROM foto
     WHERE usuario_id = ?
     ORDER BY captured_at DESC, id DESC`,
    [usuarioId]
  );
  return rows;
}

/** ### Busca una foto utilizando siempre id y propietario. */
async function buscarPorIdYUsuario(fotoId, usuarioId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS_FOTO}
     FROM foto
     WHERE id = ? AND usuario_id = ?
     LIMIT 1`,
    [fotoId, usuarioId]
  );
  return rows[0] || null;
}

/** ### Sobrescribe la instantánea completa sin cambiar id ni created_at. */
async function actualizarCompleta(fotoId, usuarioId, foto) {
  const [result] = await pool.query(
    `UPDATE foto SET
      titulo = ?, mensaje = ?, slug = ?, schema_version = ?, captured_at = ?,
      es_cerrada = ?, es_favorita = ?, salon = ?, app = ?, motores = ?, rangos = ?
     WHERE id = ? AND usuario_id = ?`,
    [
      foto.ficha_foto.titulo,
      foto.ficha_foto.mensaje,
      foto.slug,
      foto.schema_version,
      foto.captured_at,
      foto.ficha_foto.es_cerrada ? 1 : 0,
      foto.ficha_foto.es_favorita ? 1 : 0,
      JSON.stringify(foto.salon),
      JSON.stringify(foto.app),
      JSON.stringify(foto.motores),
      JSON.stringify(foto.rangos),
      fotoId,
      usuarioId,
    ]
  );
  return result.affectedRows;
}

/** ### Edita sólo la ficha y conserva captured_at. */
async function actualizarFicha(fotoId, usuarioId, ficha) {
  const [result] = await pool.query(
    `UPDATE foto SET
      titulo = ?, mensaje = ?, slug = ?, es_cerrada = ?, es_favorita = ?
     WHERE id = ? AND usuario_id = ?`,
    [
      ficha.titulo,
      ficha.mensaje,
      ficha.slug,
      ficha.es_cerrada ? 1 : 0,
      ficha.es_favorita ? 1 : 0,
      fotoId,
      usuarioId,
    ]
  );
  return result.affectedRows;
}

/** ### Elimina una foto sólo cuando pertenece al usuario autenticado. */
async function eliminar(fotoId, usuarioId) {
  const [result] = await pool.query(
    'DELETE FROM foto WHERE id = ? AND usuario_id = ?',
    [fotoId, usuarioId]
  );
  return result.affectedRows;
}

/** ### Comprueba la unicidad global sin devolver datos privados. */
async function existeSlug(slug) {
  const [rows] = await pool.query(
    'SELECT 1 FROM foto WHERE slug = ? LIMIT 1',
    [slug]
  );
  return rows.length > 0;
}

module.exports = {
  crear,
  listarPorUsuario,
  buscarPorIdYUsuario,
  actualizarCompleta,
  actualizarFicha,
  eliminar,
  existeSlug,
};
