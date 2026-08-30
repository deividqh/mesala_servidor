// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████████  LOGICA HTTP DE FOTOS
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const fotoSQL = require('../repositories/foto_SQL');
const { mapearFoto, mapearResumenFoto, parsearJson } = require('../mappers/fotoMapper');
const { validarFotoV1, validarFichaFoto, validarSlug } = require('../domain/fotoValidator');

/** ### Obtiene un id entero positivo desde los parámetros de ruta. */
function toId(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/** ### Responde los errores conocidos de la base sin filtrar detalles internos. */
function responderErrorBdd(error, res, contexto) {
  if (error?.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'El slug ya está siendo utilizado.' });
  }

  console.error(`Error en ${contexto}:`, error);
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

/** ### Guarda una foto ligada directamente al usuario autenticado. */
async function createFoto(req, res) {
  const usuarioId = toId(req.user?.id);
  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const validacion = validarFotoV1(req.body);
  if (!validacion.ok) {
    return res.status(422).json({
      message: 'La foto no cumple el contrato v1.',
      errors: validacion.errores,
      warnings: validacion.avisos,
    });
  }

  try {
    const fotoId = await fotoSQL.crear(usuarioId, validacion.valor);
    const row = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);

    return res.status(201).json({
      message: 'Foto guardada correctamente.',
      foto: mapearFoto(row),
      warnings: validacion.avisos,
    });
  } catch (error) {
    return responderErrorBdd(error, res, 'createFoto');
  }
}

/** ### Recupera el listado ligero de fotos del usuario actual. */
async function read_fotos(req, res) {
  const usuarioId = toId(req.user?.id);
  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  try {
    const rows = await fotoSQL.listarPorUsuario(usuarioId);
    return res.json(rows.map(mapearResumenFoto));
  } catch (error) {
    return responderErrorBdd(error, res, 'read_fotos');
  }
}

/** ### Obtiene una foto sólo cuando pertenece al usuario autenticado. */
async function get_foto_by_id(req, res) {
  const usuarioId = toId(req.user?.id);
  const fotoId = toId(req.params?.id);

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  if (!fotoId) return res.status(400).json({ message: 'ID de foto inválido.' });

  try {
    const row = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);
    if (!row) return res.status(404).json({ message: 'Foto no encontrada.' });
    return res.json(mapearFoto(row));
  } catch (error) {
    return responderErrorBdd(error, res, 'get_foto_by_id');
  }
}

/** ### Sobrescribe la instantánea completa utilizando id + usuario_id. */
async function updateFoto(req, res) {
  const usuarioId = toId(req.user?.id);
  const fotoId = toId(req.params?.id);

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  if (!fotoId) return res.status(400).json({ message: 'ID de foto inválido.' });

  const validacion = validarFotoV1(req.body);
  if (!validacion.ok) {
    return res.status(422).json({
      message: 'La foto no cumple el contrato v1.',
      errors: validacion.errores,
      warnings: validacion.avisos,
    });
  }

  try {
    const existe = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);
    if (!existe) return res.status(404).json({ message: 'Foto no encontrada.' });

    await fotoSQL.actualizarCompleta(fotoId, usuarioId, validacion.valor);
    const row = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);

    return res.json({
      message: 'Instantánea actualizada correctamente.',
      foto: mapearFoto(row),
      warnings: validacion.avisos,
    });
  } catch (error) {
    return responderErrorBdd(error, res, 'updateFoto');
  }
}

/** ### Edita metadatos sin modificar captured_at ni el estado del salón. */
async function updateFichaFoto(req, res) {
  const usuarioId = toId(req.user?.id);
  const fotoId = toId(req.params?.id);

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  if (!fotoId) return res.status(400).json({ message: 'ID de foto inválido.' });

  const validacion = validarFichaFoto(req.body, { permitirSlug: true });
  if (!validacion.ok) {
    return res.status(422).json({
      message: 'La ficha no es válida.',
      errors: validacion.errores,
    });
  }

  try {
    const existe = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);
    if (!existe) return res.status(404).json({ message: 'Foto no encontrada.' });

    await fotoSQL.actualizarFicha(fotoId, usuarioId, validacion.valor);
    const row = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);

    return res.json({
      message: 'Ficha actualizada correctamente.',
      foto: mapearFoto(row),
    });
  } catch (error) {
    return responderErrorBdd(error, res, 'updateFichaFoto');
  }
}

/** ### Elimina una foto del usuario actual. */
async function delete_foto(req, res) {
  const usuarioId = toId(req.user?.id);
  const fotoId = toId(req.params?.id);

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  if (!fotoId) return res.status(400).json({ message: 'ID de foto inválido.' });

  try {
    const affectedRows = await fotoSQL.eliminar(fotoId, usuarioId);
    if (!affectedRows) return res.status(404).json({ message: 'Foto no encontrada.' });
    return res.json({ message: 'Foto eliminada correctamente.' });
  } catch (error) {
    return responderErrorBdd(error, res, 'delete_foto');
  }
}

/** ### Comprueba la disponibilidad global del slug sin devolver una foto privada. */
async function select_foto_by_slug(req, res) {
  const usuarioId = toId(req.user?.id);
  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });

  const resultadoSlug = validarSlug(req.body?.slug);
  if (!resultadoSlug.ok) return res.status(400).json({ message: resultadoSlug.error });

  try {
    const exists = await fotoSQL.existeSlug(resultadoSlug.valor);
    return res.json({ slug: resultadoSlug.valor, exists });
  } catch (error) {
    return responderErrorBdd(error, res, 'select_foto_by_slug');
  }
}

/** ### Obtiene las dimensiones directamente desde foto.salon. */
async function get_dimension_foto(req, res) {
  const usuarioId = toId(req.user?.id);
  const fotoId = toId(req.params?.id);

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado.' });
  if (!fotoId) return res.status(400).json({ message: 'ID de foto inválido.' });

  try {
    const row = await fotoSQL.buscarPorIdYUsuario(fotoId, usuarioId);
    if (!row) return res.status(404).json({ message: 'Foto no encontrada.' });

    const salon = parsearJson(row.salon);
    return res.json({ filas: salon.filas, columnas: salon.columnas });
  } catch (error) {
    return responderErrorBdd(error, res, 'get_dimension_foto');
  }
}

module.exports = {
  createFoto,
  read_fotos,
  get_foto_by_id,
  updateFoto,
  updateFichaFoto,
  delete_foto,
  select_foto_by_slug,
  get_dimension_foto,
};
