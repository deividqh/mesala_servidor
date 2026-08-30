// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████  CONTRATO V1 DE FOTO
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const LIMITES = Object.freeze({
  filas: 50,
  columnas: 25,
  elementos: 1250,
  reservas: 1250,
  alergiasPorElemento: 32,
  titulo: 160,
  mensaje: 2000,
  slug: 190,
  nombreSalon: 160,
  textoCorto: 100,
});

const CLAVES_FOTO = new Set([
  'schema_version',
  'slug',
  'captured_at',
  'salon',
  'app',
  'ficha_foto',
  'motores',
  'rangos',
]);

const CLAVES_SALON = new Set([
  'nombre_salon',
  'tipo_salon',
  'filas',
  'columnas',
  'contenedor',
  'css',
]);

const CLAVES_APP = new Set(['d_indices', 'reservas']);
const CLAVES_FICHA = new Set(['titulo', 'mensaje', 'es_cerrada', 'es_favorita']);
const CLAVES_MOTORES = new Set(['motor_mensajes', 'motor_alergias',]);
const CLAVES_RANGOS = new Set(['rango_reservas', 'rango_matriz', 'rango_otros']);

/** ### Comprueba si un valor es un diccionario JSON ordinario. */
function esObjeto(valor) {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
}

/** ### Registra propiedades que no pertenecen al contrato. */
function validarClaves(objeto, clavesPermitidas, ruta, errores) {
  if (!esObjeto(objeto)) return;

  for (const clave of Object.keys(objeto)) {
    if (!clavesPermitidas.has(clave)) {
      errores.push(`${ruta}/${clave}: propiedad no permitida.`);
    }
  }
}

/** ### Valida una cadena y devuelve su versión sin espacios exteriores. */
function validarTexto(valor, ruta, errores, opciones = {}) {
  const { obligatorio = true, maximo = LIMITES.textoCorto } = opciones;

  if (typeof valor !== 'string') {
    errores.push(`${ruta}: debe ser texto.`);
    return '';
  }

  const texto = valor.trim();
  if (obligatorio && texto.length === 0) errores.push(`${ruta}: no puede estar vacío.`);
  if (texto.length > maximo) errores.push(`${ruta}: supera el máximo de ${maximo} caracteres.`);
  return texto;
}

/** ### Valida el slug global de una foto. */
function validarSlug(slug) {
  if (typeof slug !== 'string') return { ok: false, valor: '', error: 'El slug debe ser texto.' };

  const valor = slug.trim();
  if (valor.length < 3 || valor.length > LIMITES.slug) {
    return { ok: false, valor, error: `El slug debe tener entre 3 y ${LIMITES.slug} caracteres.` };
  }

  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(valor)) {
    return { ok: false, valor, error: 'El slug sólo admite minúsculas, números y guiones bajos.' };
  }

  return { ok: true, valor };
}

/** ### Valida una fecha ISO-8601 que incluya zona horaria. */
function validarFechaCaptura(valor, errores) {
  const formatoIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

  if (typeof valor !== 'string' || !formatoIso.test(valor)) {
    errores.push('/captured_at: debe ser una fecha ISO-8601 con zona horaria.');
    return null;
  }

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    errores.push('/captured_at: contiene una fecha imposible.');
    return null;
  }

  const limiteFuturo = Date.now() + (5 * 60 * 1000);
  if (fecha.getTime() > limiteFuturo) {
    errores.push('/captured_at: no puede estar más de 5 minutos en el futuro.');
  }

  return fecha;
}

/** ### Valida los datos físicos del salón. */
function validarSalon(salon, errores) {
  if (!esObjeto(salon)) {
    errores.push('/salon: debe ser un objeto.');
    return null;
  }

  validarClaves(salon, CLAVES_SALON, '/salon', errores);

  const nombreSalon = validarTexto(salon.nombre_salon, '/salon/nombre_salon', errores, {
    maximo: LIMITES.nombreSalon,
  });
  const tipoSalon = validarTexto(salon.tipo_salon, '/salon/tipo_salon', errores);
  const contenedor = validarTexto(salon.contenedor, '/salon/contenedor', errores, {
    obligatorio: false,
  });

  if (!Number.isInteger(salon.filas) || salon.filas < 1 || salon.filas > LIMITES.filas) {
    errores.push(`/salon/filas: debe ser un entero entre 1 y ${LIMITES.filas}.`);
  }
  if (!Number.isInteger(salon.columnas) || salon.columnas < 1 || salon.columnas > LIMITES.columnas) {
    errores.push(`/salon/columnas: debe ser un entero entre 1 y ${LIMITES.columnas}.`);
  }
  if (!esObjeto(salon.css)) errores.push('/salon/css: debe ser un objeto.');

  return {
    nombre_salon: nombreSalon,
    tipo_salon: tipoSalon,
    filas: salon.filas,
    columnas: salon.columnas,
    contenedor,
    css: salon.css,
  };
}

/** ### Valida el diccionario id_elemento -> índice. */
function validarIndices(indices, salon, errores) {
  if (!esObjeto(indices)) {
    errores.push('/app/d_indices: debe ser un objeto.');
    return {};
  }

  const entradas = Object.entries(indices);
  if (entradas.length > LIMITES.elementos) {
    errores.push(`/app/d_indices: supera el máximo de ${LIMITES.elementos} elementos.`);
  }

  const indicesUsados = new Set();
  const maximoIndice = Number.isInteger(salon?.filas) && Number.isInteger(salon?.columnas)
    ? (salon.filas * salon.columnas) - 1
    : -1;

  for (const [idElemento, indice] of entradas) {
    if (!/^[A-Za-z][A-Za-z0-9_-]{0,99}$/.test(idElemento)) {
      errores.push(`/app/d_indices/${idElemento}: identificador no válido.`);
    }
    if (!Number.isInteger(indice) || indice < 0 || indice > maximoIndice) {
      errores.push(`/app/d_indices/${idElemento}: índice fuera de la matriz.`);
    }
    if (indicesUsados.has(indice)) {
      errores.push(`/app/d_indices/${idElemento}: el índice ${indice} está repetido.`);
    }
    indicesUsados.add(indice);
  }

  return indices;
}

/** ### Extrae los ids canónicos desde rango_matriz.values. */
function validarRangos(rangos, errores) {
  if (!esObjeto(rangos)) {
    errores.push('/rangos: debe ser un objeto.');
    return { rangos: null, idsCanonicos: new Set() };
  }

  validarClaves(rangos, CLAVES_RANGOS, '/rangos', errores);

  if (!Array.isArray(rangos.rango_reservas)) {
    errores.push('/rangos/rango_reservas: debe ser un array.');
  }
  if (!esObjeto(rangos.rango_matriz)) {
    errores.push('/rangos/rango_matriz: debe ser un objeto.');
  }
  if (!Array.isArray(rangos.rango_otros)) {
    errores.push('/rangos/rango_otros: debe ser un array.');
  }

  const values = esObjeto(rangos.rango_matriz?.values) ? rangos.rango_matriz.values : null;
  if (!values) errores.push('/rangos/rango_matriz/values: debe ser un objeto.');

  const idsCanonicos = new Set();
  for (const [celda, idElemento] of Object.entries(values || {})) {
    if (!/^[A-Z]+\d+$/.test(celda)) {
      errores.push(`/rangos/rango_matriz/values/${celda}: celda no válida.`);
    }
    if (typeof idElemento !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]{0,99}$/.test(idElemento)) {
      errores.push(`/rangos/rango_matriz/values/${celda}: identificador no válido.`);
      continue;
    }
    if (idsCanonicos.has(idElemento)) {
      errores.push(`/rangos/rango_matriz/values/${celda}: ${idElemento} ocupa más de una celda.`);
    }
    idsCanonicos.add(idElemento);
  }

  if (idsCanonicos.size > LIMITES.elementos) {
    errores.push(`/rangos/rango_matriz/values: supera el máximo de ${LIMITES.elementos} elementos.`);
  }

  return { rangos, idsCanonicos };
}

/** ### Comprueba que índices y rango_matriz describen los mismos elementos. */
function validarFuentesCanonicas(indices, idsCanonicos, errores) {
  const idsIndices = new Set(Object.keys(indices));

  for (const idElemento of idsIndices) {
    if (!idsCanonicos.has(idElemento)) {
      errores.push(`/app/d_indices/${idElemento}: no aparece en rangos.rango_matriz.values.`);
    }
  }

  for (const idElemento of idsCanonicos) {
    if (!idsIndices.has(idElemento)) {
      errores.push(`/rangos/rango_matriz/values: ${idElemento} no aparece en app.d_indices.`);
    }
  }
}

/** ### Elimina referencias inexistentes sin descartar la reserva completa. */
function sanearReservas(reservas, idsValidos, errores, avisos) {
  if (!Array.isArray(reservas)) {
    errores.push('/app/reservas: debe ser un array.');
    return [];
  }

  if (reservas.length > LIMITES.reservas) {
    errores.push(`/app/reservas: supera el máximo de ${LIMITES.reservas} reservas.`);
  }

  const idsReservados = new Set();
  const reservasLimpias = [];

  reservas.forEach((reserva, indiceReserva) => {
    const rutaReserva = `/app/reservas/${indiceReserva}`;
    if (!esObjeto(reserva) || !Array.isArray(reserva.central) || !Array.isArray(reserva.clientes)) {
      errores.push(`${rutaReserva}: debe contener arrays central y clientes.`);
      return;
    }

    const limpiarGrupo = (elementos, nombreGrupo) => {
      const resultado = [];
      elementos.forEach((idElemento, indiceElemento) => {
        const ruta = `${rutaReserva}/${nombreGrupo}/${indiceElemento}`;
        if (typeof idElemento !== 'string' || !idsValidos.has(idElemento)) {
          avisos.push({ code: 'ELEMENT_REFERENCE_REMOVED', path: ruta, value: idElemento });
          return;
        }
        if (idsReservados.has(idElemento)) {
          errores.push(`${ruta}: ${idElemento} ya pertenece a otra posición de reserva.`);
          return;
        }
        idsReservados.add(idElemento);
        resultado.push(idElemento);
      });
      return resultado;
    };

    const reservaLimpia = {
      central: limpiarGrupo(reserva.central, 'central'),
      clientes: limpiarGrupo(reserva.clientes, 'clientes'),
    };

    if (reservaLimpia.central.length === 0 && reservaLimpia.clientes.length === 0) {
      avisos.push({ code: 'EMPTY_RESERVATION_REMOVED', path: rutaReserva });
      return;
    }
    reservasLimpias.push(reservaLimpia);
  });

  return reservasLimpias;
}

/** ### Elimina claves de motor que no apuntan a elementos de la matriz. */
function sanearMotores(motores, idsValidos, errores, avisos) {
  if (!esObjeto(motores)) {
    errores.push('/motores: debe ser un objeto.');
    return null;
  }

  validarClaves(motores, CLAVES_MOTORES, '/motores', errores);

  if (!esObjeto(motores.motor_mensajes)) {
    errores.push('/motores/motor_mensajes: debe ser un objeto.');
  }
  if (!esObjeto(motores.motor_alergias)) {
    errores.push('/motores/motor_alergias: debe ser un objeto.');
  }
  

  const mensajes = {};
  for (const [idElemento, mensaje] of Object.entries(motores.motor_mensajes || {})) {
    if (!idsValidos.has(idElemento)) {
      avisos.push({ code: 'ELEMENT_REFERENCE_REMOVED', path: `/motores/motor_mensajes/${idElemento}`, value: idElemento });
      continue;
    }
    if (typeof mensaje !== 'string' || mensaje.length > LIMITES.mensaje) {
      errores.push(`/motores/motor_mensajes/${idElemento}: mensaje no válido.`);
      continue;
    }
    mensajes[idElemento] = mensaje;
  }

  const alergias = {};
  for (const [idElemento, lista] of Object.entries(motores.motor_alergias || {})) {
    if (!idsValidos.has(idElemento)) {
      avisos.push({ code: 'ELEMENT_REFERENCE_REMOVED', path: `/motores/motor_alergias/${idElemento}`, value: idElemento });
      continue;
    }
    if (!Array.isArray(lista) || lista.length > LIMITES.alergiasPorElemento) {
      errores.push(`/motores/motor_alergias/${idElemento}: lista de alergias no válida.`);
      continue;
    }
    const listaValida = lista.every((alergia) => typeof alergia === 'string' && alergia.trim().length > 0 && alergia.length <= LIMITES.textoCorto);
    if (!listaValida) {
      errores.push(`/motores/motor_alergias/${idElemento}: contiene una alergia no válida.`);
      continue;
    }
    alergias[idElemento] = [...new Set(lista.map((alergia) => alergia.trim()))];
  }

  return {
    motor_mensajes: mensajes,
    motor_alergias: alergias,
  };
}

/** ### Valida y normaliza los metadatos editables de una foto. */
function validarFichaFoto(ficha, opciones = {}) {
  const { permitirSlug = false } = opciones;
  const errores = [];

  if (!esObjeto(ficha)) {
    return { ok: false, errores: ['/ficha_foto: debe ser un objeto.'] };
  }

  const claves = permitirSlug ? new Set([...CLAVES_FICHA, 'slug']) : CLAVES_FICHA;
  validarClaves(ficha, claves, '/ficha_foto', errores);

  const titulo = validarTexto(ficha.titulo, '/ficha_foto/titulo', errores, { maximo: LIMITES.titulo });
  let mensaje = null;
  if (ficha.mensaje !== null && ficha.mensaje !== undefined) {
    mensaje = validarTexto(ficha.mensaje, '/ficha_foto/mensaje', errores, {
      obligatorio: false,
      maximo: LIMITES.mensaje,
    }) || null;
  }

  if (typeof ficha.es_cerrada !== 'boolean') errores.push('/ficha_foto/es_cerrada: debe ser booleano.');
  if (typeof ficha.es_favorita !== 'boolean') errores.push('/ficha_foto/es_favorita: debe ser booleano.');

  let slug;
  if (permitirSlug) {
    const resultadoSlug = validarSlug(ficha.slug);
    if (!resultadoSlug.ok) errores.push(`/ficha_foto/slug: ${resultadoSlug.error}`);
    slug = resultadoSlug.valor;
  }

  return {
    ok: errores.length === 0,
    errores,
    valor: {
      titulo,
      mensaje,
      es_cerrada: ficha.es_cerrada,
      es_favorita: ficha.es_favorita,
      ...(permitirSlug ? { slug } : {}),
    },
  };
}

/** ### Valida y sanea el documento completo antes de guardarlo. */
function validarFotoV1(payload) {
  const errores = [];
  const avisos = [];

  if (!esObjeto(payload)) {
    return { ok: false, errores: ['El cuerpo debe ser un objeto JSON.'], avisos };
  }

  validarClaves(payload, CLAVES_FOTO, '', errores);

  if (payload.schema_version !== 1) errores.push('/schema_version: la única versión admitida actualmente es 1.');

  const resultadoSlug = validarSlug(payload.slug);
  if (!resultadoSlug.ok) errores.push(`/slug: ${resultadoSlug.error}`);
  const capturedAt = validarFechaCaptura(payload.captured_at, errores);
  const salon = validarSalon(payload.salon, errores);

  if (!esObjeto(payload.app)) {
    errores.push('/app: debe ser un objeto.');
  } else {
    validarClaves(payload.app, CLAVES_APP, '/app', errores);
  }

  const indices = validarIndices(payload.app?.d_indices, salon, errores);
  const { rangos, idsCanonicos } = validarRangos(payload.rangos, errores);
  validarFuentesCanonicas(indices, idsCanonicos, errores);

  const reservas = sanearReservas(payload.app?.reservas, idsCanonicos, errores, avisos);
  const resultadoFicha = validarFichaFoto(payload.ficha_foto);
  errores.push(...resultadoFicha.errores);
  const motores = sanearMotores(payload.motores, idsCanonicos, errores, avisos);

  return {
    ok: errores.length === 0,
    errores,
    avisos,
    valor: {
      schema_version: 1,
      slug: resultadoSlug.valor,
      captured_at: capturedAt,
      salon,
      app: {
        d_indices: indices,
        reservas,
      },
      ficha_foto: resultadoFicha.valor,
      motores,
      rangos,
    },
  };
}

module.exports = {
  LIMITES,
  validarFotoV1,
  validarFichaFoto,
  validarSlug,
};
