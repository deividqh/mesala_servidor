// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████████  LOGICA DEL NEGOCIO DE FOTOS
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Controlador (Controller): Una vez
// El método específico del controlador asociado a esa ruta se ejecuta exactamente una vez por petición. 
// Es el encargado de procesar la lógica de negocio y, finalmente, enviar la respuesta al cliente (res.send, res.json).
// Una vez que el controlador envía la respuesta, el ciclo de vida de esa petición para ese archivo termina. 

// ┌•••••••••••••••••••••••••••••••••••••••••••••
// ┌•• Importar la conexión a la BASE DE DATOS
// ┌•••••••••••••••••••••••••••••••••••••••••••••
const pool = require('../config/db');

/** ## Guarda un salón y su foto asociada en la base de datos.  */
async function createFoto(req, res) {
    const usuarioId = req.user?.id;
    const { salon, foto } = req.body || {};
    // Validar datos obligatorios
    if (!usuarioId || !salon || !foto) return res.status(400).json({ message: 'Datos incompletos' });
    // Obtener conexión a la base de datos
    const connection = await pool.getConnection();

    try {
      // ■■■■■■■■ INICIAR una TRANSACCION
      await connection.beginTransaction();

      // ■■■■■■■■ 
      const clasesJson = JSON.stringify(salon.clases_json || {});
      const rutasJson = JSON.stringify(salon.rutas_json || {});
      const configuracionJson = JSON.stringify(salon.configuracion_json || {});
      const rangosJson = JSON.stringify(foto.rangos || []);
      
      const tiposJson = JSON.stringify(salon.tipos_json || {});

      // ■■■■■■■■ Verificar si el slug público ya existe para este usuario
      const [slugRows] = await connection.query(
        `SELECT 1 FROM foto
         INNER JOIN salon ON foto.salon_id = salon.id
         WHERE foto.slug_publico = ? AND salon.usuario_id = ?
         LIMIT 1`,
        [foto.slug_publico, usuarioId]
      );

      if (slugRows.length > 0) {
        await connection.rollback();
        return res.status(409).json({ message: '⚠️Fallo al Actualizar. El slug público ya existe... Desde la BDD' });
      }

      // // ■■■■■■■■ Buscar si el salón ya existe para el usuario y configuración base
      const [existingSalonRows] = await connection.query(
        `SELECT id FROM salon 
         WHERE usuario_id=? AND family=? AND columnas=? AND filas=? AND clases_json=? AND tipos_json=?  LIMIT 1`,
        [
          usuarioId, 
          salon.family, 
          salon?.columnas , 
          salon?.filas,
          clasesJson, 
          tiposJson
        ]
      );
      
      // ■■■■■■■■■■■4■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
      // Guardo el ID del salón (nuevo o existente)
      let salon_id = null;
      //    • Si existe (existingSalonRows)    ► Update fecha de la tabla Salon 
      //    • si no existe (existingSalonRows) ► Insert un NUEVO SALON
      if (existingSalonRows.length > 0) {
          salon_id = existingSalonRows[0].id;
          await connection.query(
            `UPDATE salon SET updated_at = NOW(3) WHERE id = ?`,  [salon_id]
          );
      } else {
        const [resSalon] = await connection.query(
          `INSERT INTO salon SET 
            usuario_id = ?, nombre = ?, columnas = ?, filas = ?, 
            family = ?, configuracion_json = ?, clases_json = ?, rutas_json = ?, 
            tipos_json = ?, created_at = NOW(3), updated_at = NOW(3)`,
          [
            usuarioId, salon.nombre,salon.columnas || 0,salon.filas || 0,
            salon.family, configuracionJson , clasesJson , rutasJson, tiposJson
          ]
        );
        salon_id = resSalon.insertId;
      }

      // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
      // ■■■■■■■■■■■■■■■■■■■ 2. Insertar Foto 
      // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
      const [resFoto] = await connection.query(
        `INSERT INTO foto SET 
          salon_id = ?, 
          titulo = ?, 
          dicc_reservas = ?, 
          dicc_indices = ?, 
          dicc_mensajes = ?, 
          dicc_alergias = ?,
          dicc_configuracion = ?, 
          rangos = ?,
          es_plantilla = ?, 
          es_publica = ?, 
          slug_publico = ?, 
          mensaje_publico = ?, 
          captured_at = NOW(3), 
          created_at = NOW(3), 
          publicada_at = NOW(3)`,
        [
          salon_id,
          foto.titulo,
          JSON.stringify(foto.dicc_reservas || []),
          JSON.stringify(foto.dicc_indices || {}),
          JSON.stringify(foto.dicc_mensajes || {}),
          JSON.stringify(foto.dicc_alergias || {}),
          JSON.stringify(foto.dicc_configuracion || {}),
          JSON.stringify(foto.rangos || {}),

          foto.es_plantilla ? 1 : 0,
          foto.es_publica ? 1 : 0,
          foto.slug_publico,
          foto.mensaje_publico || null
        ]
      );

      await connection.commit();
      res.status(201).json({ message: '¡Guardado!', id: resFoto.insertId });

    } catch (error) {
      await connection.rollback();
      console.error("Detalle del error:", error);
      res.status(500).json({ message: 'Error interno del servidor' });
    } finally {
      connection.release();
    }
}

/** ## Recupera el listado de fotos (salones guardados) del usuario actual.  */
async function read_fotos(req, res) {
  const usuarioId = req.user?.id;

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado' });

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        f.id, 
        f.titulo, 
        f.slug_publico, 
        f.mensaje_publico, 
        f.captured_at,
        f.dicc_configuracion,
        f.dicc_mensajes,
        f.dicc_alergias,
        f.dicc_indices,
        f.dicc_reservas,
        f.es_publica,
        f.es_plantilla,
        f.filas,
        f.columnas,
        f.rangos
       FROM foto f
       INNER JOIN salon s ON f.salon_id = s.id
       WHERE s.usuario_id = ?
       ORDER BY f.captured_at DESC`,
      [usuarioId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error en read_fotos:", error);
    res.status(500).json({ message: 'Error al recuperar la galería.' });
  } finally {
    connection.release();
  }
}

/** ## Actualiza una foto existente y su salón asociado usando el slug público.  */
async function updateFoto(req, res) {
  
  // ┌•• Cacho los datos de entrada que me envia el Front:
  const usuarioId = req.user?.id;
  const { salon, foto } = req.body || {};
  
  if (!usuarioId || !salon || !foto) return res.status(400).json({ message: 'Datos incompletos' });
  
  // ┌•• Init Conexion
  const connection = await pool.getConnection();
  try {
    // ┌•• Init Transaccion
    await connection.beginTransaction();


    const [fotoRows] = await connection.query(
      `SELECT foto.id AS foto_id, salon.id AS salon_id
       FROM foto
       INNER JOIN salon ON foto.salon_id = salon.id
       WHERE foto.slug_publico = ? AND salon.usuario_id = ?
       LIMIT 1`,
      [foto.slug_publico, usuarioId]
    );

    if (fotoRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Foto no encontrada para este slug.' });
    }

    // ┌•• Cacho los id's de foto y salon x el slug 
    const { foto_id, salon_id } = fotoRows[0];

    const clasesJson = JSON.stringify(salon.clases_json || {});
    const rutasJson = JSON.stringify(salon.rutas_json || {});
    const tiposJson = JSON.stringify(salon.tipos_json || {});
    const configuracionJson = JSON.stringify(salon.configuracion_json || {});

    await connection.query(
      `UPDATE salon SET 
        nombre = ?, columnas = ?, filas = ?, 
        family = ?, configuracion_json = ?, clases_json = ?, rutas_json = ?, 
        tipos_json = ?, updated_at = NOW(3)
       WHERE id = ?`,
      [
        salon.nombre,
        salon.columnas || 0,
        salon.filas || 0,
        salon.family,
        configuracionJson,
        clasesJson,
        rutasJson,
        tiposJson,

        salon_id
      ]
    );

    const es_publica = foto.es_publica ? 1 : 0;
    await connection.query(
      `UPDATE foto SET
        titulo = ?,
        filas = ?, 
        columnas = ?,
        dicc_reservas = ?,
        dicc_indices = ?,
        dicc_mensajes = ?,
        dicc_alergias = ?,
        dicc_configuracion = ?,
        rangos = ?,
        es_plantilla = ?,
        es_publica = ?,
        slug_publico = ?,
        mensaje_publico = ?,
        captured_at = NOW(3),
        publicada_at = CASE WHEN ? = 1 THEN NOW(3) ELSE NULL END
       WHERE id = ?`,
      [
        foto.titulo,
        salon.filas,
        salon.columnas,
        JSON.stringify(foto.dicc_reservas || []),
        JSON.stringify(foto.dicc_indices || {}),
        JSON.stringify(foto.dicc_mensajes || {}),
        JSON.stringify(foto.dicc_alergias || {}),
        JSON.stringify(foto.dicc_configuracion || {}),
        JSON.stringify(foto.rangos || {}),
        foto.es_plantilla ? 1 : 0,
        es_publica,
        foto.slug_publico,
        foto.mensaje_publico || null,
        es_publica,
        foto_id
      ]
    );

    await connection.commit();
    res.status(200).json({ message: 'Foto actualizada.' });
  } catch (error) {
    await connection.rollback();
    console.error("Detalle del error:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
}

/** ## Elimina una foto del usuario actual.  */
async function delete_foto(req, res) {
  const usuarioId = req.user?.id;
  const foto_id = Number(req.params?.id);

  if (!usuarioId) return res.status(401).json({ message: 'Usuario no autenticado' });
  if (!Number.isFinite(foto_id)) return res.status(400).json({ message: 'ID de foto inválido' });

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `DELETE f FROM foto f
       INNER JOIN salon s ON f.salon_id = s.id
       WHERE f.id = ? AND s.usuario_id = ?`,
      [foto_id, usuarioId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    res.json({ message: 'Foto eliminada correctamente' });
  } catch (error) {
    console.error("Error en delete_foto:", error);
    res.status(500).json({ message: 'Error al eliminar la foto.' });
  } finally {
    connection.release();
  }
}

/** ## Actualiza la ficha(titulo, slug, plantilla, publica, mensaje, captured_at) de una foto ► {@link ../../cliente_web/js/div_x_div. abrir_ventana_updt}   */
async function update_ficha_foto(req, res){  

  const foto_id = Number(req.params?.id);
  const ficha_foto = req?.body?.ficha_foto ?? req?.body;
  if (!Number.isFinite(foto_id)) return res.status(400).json({ message: 'ID de foto inválido' });
  if (!ficha_foto) return res.status(400).json({ message: '⭕ Ficha de Foto Vacía' });

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    // ┌•• Asigno los valores.ficha_foto se establece en _set_payload_updt() [ div_x_div.js ]
    const ficha = {
      titulo: String(ficha_foto.titulo).trim(),
      slug_publico: String(ficha_foto.slug_publico).trim(),
      mensaje_publico: String(ficha_foto.mensaje_publico || '').trim(),
      es_plantilla: Boolean(ficha_foto.es_plantilla),
      es_publica: Boolean(ficha_foto.es_publica),
    }
    await connection.query(
      `UPDATE foto SET
        titulo = ?,
        slug_publico = ?,
        mensaje_publico = ?,
        es_plantilla = ?,
        es_publica = ?
       WHERE id = ?`,
      [
        ficha.titulo,
        ficha.slug_publico,
        ficha.mensaje_publico || null,
        ficha.es_plantilla ? 1 : 0,
        ficha.es_publica ? 1 : 0,
        foto_id
      ]
    );

    await connection.commit();
    res.status(200).json({ message: 'Foto Actualizada ✔️' });
  }catch(error){
     await connection.rollback();
    console.log(`Error ::: update_ficha_foto ::: ${error}`);
    res.status(500).json({ message: '⭕ Error interno del servidor' });
  }finally {
    connection.release();
  }
}

/**  ## Verifica si una foto con un slug público ya existe. */
async function select_foto_by_slug(req, res) {
  // const { slug } = String(req.params.slug || '').trim();
  const usuarioId = req.user?.id;
  
  // Ajuste para obtener el slug desde el cuerpo de la solicitud
  const { slug } = req.body || {};
  if (!slug || !usuarioId) {
    return res.status(400).json({ message: 'Slug requerido' });
  }
  // Obtener conexión a la base de datos
  const connection = await pool.getConnection();
  try {
    // Consulta para verificar si el slug existe
    const [rows] = await connection.query( 
      // `SELECT 1 FROM foto WHERE slug_publico = ? LIMIT 1`, [slug]
      `SELECT * FROM foto 
       INNER JOIN salon ON foto.salon_id = salon.id 
       WHERE foto.slug_publico = ? AND salon.usuario_id = ? 
       LIMIT 1`,
      [slug, usuarioId]
    );

    // ┌• Responder con el resultado
    if(rows.length > 0 ) 
      res.json(rows[0]);
    else 
      // res.json({ exists: rows.length > 0 });
      res.json(false);

  } catch (error) {
    console.error("Detalle del error:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
}

/**  ## Obtiene una foto del salon BY foto.id */
async function get_foto_by_id(req, res){
  const {id} = req.params;

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM foto WHERE id = ?', [id]);
    if( rows.length === 0 ) return res.status(404).json({error: 'Foto no encontrada.'})

    const foto = rows[0];    

    // Devolvemos la foto procesada: el frontend ya no tiene que preocuparse por JSON.parse
    res.json( {
        id: foto.id,        
        titulo: foto.titulo,
        slug_publico: foto.slug_publico,
        mensaje_publico: foto.mensaje_publico,
        captured_at: foto.captured_at,
        es_plantilla: foto.es_plantilla,
        es_publica: foto.es_publica,
        dicc_mensajes: foto.dicc_mensajes ? JSON.parse(foto.dicc_mensajes) : {},
        dicc_alergias: foto.dicc_alergias ? JSON.parse(foto.dicc_alergias) : {},
        dicc_indices: foto.dicc_indices ? JSON.parse(foto.dicc_indices) : {},
        dicc_reservas: foto.dicc_reservas ? JSON.parse(foto.dicc_reservas) : {},
        filas: foto.filas,
        columnas: foto.columnas,
        rangos: foto.rangos ? JSON.parse(foto.rangos) : {},
        
    } );

  } catch (error) {
    console.error("Error en get_foto__by_id:", error);
    res.status(500).json({ message: 'Error al recuperar una foto.' });
  } finally {
    connection.release();
  }
}


/** # Obtener la dimension con la que fue guardada una foto.  
 * ### MOTIVOS POR LOS QUE PUEDE CAMBIAR UNA DIMENSION:
 * #### • El usuario cambia la dimension by-Hand en el panel de configuracion.
 * #### • El usuario abre el salon en un Escritorio/Tablet y guarda una foto, luego la abre desde el MOVIL. . . y viceversa
 * ### Explicación:
 * #### • La dimension con la que fue guardada la foto NO está en la tabla 'foto' (error?). Está guardada en la tabla 'salon'.
 */
async function get_dimension_foto(req, res){
  // ┌••••••••••••••••••••••
  // ┌•• RECOJO LOS DATOS.
  // ┌••••••••••••••••••••••
  const foto_id = Number(req.params?.id);
  // ┌••••••••••••
  // ┌•• VALIDO
  // ┌••••••••••••
  if (!Number.isFinite(foto_id)) return res.status(400).json({ message: 'ID de foto inválido' });
  // ┌••••••••••••••••••••••••••••
  // ┌•• 🔌🔌 EMPIEZA LA CONEXION
  // ┌••••••••••••••••••••••••••••
  const connection = await pool.getConnection();
  // ┌•••••••••••••••••••••••••••••••••
  // ┌•• 🔓🔓 EMPIEZA LA   TRANSACCION:
  // ┌•••••••••••••••••••••••••••••••••
  try {
    await connection.beginTransaction();        
    const [rows] = await connection.query(
      `SELECT salon.filas, salon.columnas 
      FROM salon, foto  
      WHERE foto.salon_id = salon.id AND foto.id = ? 
      `, [ foto_id ]
    );
    if( rows.length === 0 ) return res.status(404).json({error: 'Foto no encontrada.'})
    const dimension = rows[0];
    // res.json({filas: dimension.filas, clumnas: dimension.columnas});
    // ┌•••••••••••••••••••••••••••••••••••
    // ┌••🔒🔒 TERMINA LA   TRANSACCION ✔️
    // ┌•••••••••••••••••••••••••••••••••••
    await connection.commit();
    res.status(200).json({ ok: true, filas: dimension.filas, columnas:dimension.columnas , message: '✔️ Operacion Realizada'});    
    
  }catch(error){
    // ┌•••••••••••••••••••••••••••••••••••
    // ┌••🔒⭕ TERMINA LA   TRANSACCION ⭕
    // ┌•••••••••••••••••••••••••••••••••••
     await connection.rollback();
    console.log(`Error ::: get_dimension_foto ::: ${error}`);
    res.status(500).json({ ok: false, filas: null, columnas: null, message: '⭕ Error interno del servidor' });
  }finally {
  // ┌••••••••••••••••••••••••••••
  // ┌•• 🔌🔌 TERMINA LA CONEXION
  // ┌••••••••••••••••••••••••••••
    connection.release();
  }
}

// ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██    EXPORTS    ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ 

module.exports = {
  createFoto,
  updateFoto,
  update_ficha_foto,
  select_foto_by_slug,
  read_fotos,
  delete_foto,
  get_foto_by_id, 
  get_dimension_foto
};
