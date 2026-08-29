// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████  CONTRATO CLIENTE FOTO V1
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

(function iniciarFotoContratoV1(globalScope) {
	'use strict';

	const LIMITES = Object.freeze({
		filas: 50,
		columnas: 25,
		elementos: 1250,
		reservas: 1250,
		titulo: 160,
		mensaje: 2000,
		slug: 190,
	});

	/** ### Comprueba si un valor es un diccionario JSON ordinario. */
	function esObjeto(valor) {
		return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
	}

	/** ### Genera el slug snake_case admitido por el servidor. */
	function normalizarSlug(valor) {
		return String(valor || '')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '_')
			.replace(/^_+|_+$/g, '');
	}

	/** ### Convierte la descripción vacía en null según el contrato. */
	function normalizarMensaje(valor) {
		const mensaje = typeof valor === 'string' ? valor.trim() : '';
		return mensaje || null;
	}

	/** ### Traduce las reservas internas del salón al nombre público `central`. */
	function normalizarReservas(reservas = []) {
		if (!Array.isArray(reservas)) return [];

		return reservas.map((reserva) => ({
			central: [...(reserva?.central || reserva?.reservadores || reserva?.mesas || [])],
			clientes: [...(reserva?.clientes || reserva?.sillas || [])],
		}));
	}

	/** ### Construye exclusivamente las propiedades del contrato JSON v1. */
	function crearDocumento(datos = {}) {
		const configuracion = datos.configuracion || {};
		const configSalon = configuracion.salon || configuracion;
		const clasesCss = configSalon.clases_css || {};

		return {
			schema_version: 1,
			slug: normalizarSlug(datos.slug),
			captured_at: datos.captured_at || new Date().toISOString(),
			salon: {
				nombre_salon: String(datos.nombre_salon || configSalon.family || 'Salon'),
				tipo_salon: String(datos.tipo_salon || 'limitado'),
				filas: datos.filas,
				columnas: datos.columnas,
				contenedor: String(configSalon.contenedor || ''),
				css: {
					baldosas: String(clasesCss.baldosas || ''),
					salon: String(clasesCss.contenedor || ''),
				},
			},
			app: {
				d_indices: datos.indices || {},
				reservas: normalizarReservas(datos.reservas),
			},
			ficha_foto: {
				titulo: String(datos.titulo || '').trim(),
				mensaje: normalizarMensaje(datos.mensaje),
				es_cerrada: Boolean(datos.es_cerrada),
				es_favorita: Boolean(datos.es_favorita),
			},
			motores: {
				motor_mensajes: datos.mensajes || {},
				motor_alergias: datos.alergias || {},
				app_compatible: datos.app_compatible || { contrato_foto: 1 },
			},
			rangos: {
				rango_reservas: datos.rango_reservas || [],
				rango_matriz: datos.rango_matriz || { values: {} },
				rango_otros: datos.rango_otros || [],
			},
		};
	}

	/** ### Valida en el navegador los errores que el usuario puede corregir. */
	function validarDocumento(foto) {
		const errores = [];
		if (!esObjeto(foto)) return ['La foto no es un documento JSON válido.'];

		if (foto.schema_version !== 1) errores.push('La versión del contrato debe ser 1.');
		if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(foto.slug || '')) errores.push('El slug sólo admite minúsculas, números y guiones bajos.');
		if ((foto.slug || '').length < 3 || foto.slug.length > LIMITES.slug) errores.push(`El slug debe tener entre 3 y ${LIMITES.slug} caracteres.`);
		if (!foto.ficha_foto?.titulo) errores.push('El título es obligatorio.');
		if ((foto.ficha_foto?.titulo || '').length > LIMITES.titulo) errores.push(`El título supera ${LIMITES.titulo} caracteres.`);
		if ((foto.ficha_foto?.mensaje || '').length > LIMITES.mensaje) errores.push(`La descripción supera ${LIMITES.mensaje} caracteres.`);
		if (!Number.isInteger(foto.salon?.filas) || foto.salon.filas < 1 || foto.salon.filas > LIMITES.filas) errores.push(`Las filas deben estar entre 1 y ${LIMITES.filas}.`);
		if (!Number.isInteger(foto.salon?.columnas) || foto.salon.columnas < 1 || foto.salon.columnas > LIMITES.columnas) errores.push(`Las columnas deben estar entre 1 y ${LIMITES.columnas}.`);

		const indices = esObjeto(foto.app?.d_indices) ? foto.app.d_indices : {};
		const values = esObjeto(foto.rangos?.rango_matriz?.values) ? foto.rangos.rango_matriz.values : {};
		const idsIndices = Object.keys(indices).sort();
		const idsMatriz = Object.values(values).filter((id) => typeof id === 'string').sort();
		if (idsIndices.length > LIMITES.elementos) errores.push(`La foto supera ${LIMITES.elementos} elementos.`);
		if ((foto.app?.reservas || []).length > LIMITES.reservas) errores.push(`La foto supera ${LIMITES.reservas} reservas.`);
		if (JSON.stringify(idsIndices) !== JSON.stringify(idsMatriz)) errores.push('Los índices y el rango matriz no contienen los mismos elementos.');

		return errores;
	}

	const api = Object.freeze({ LIMITES, crearDocumento, normalizarMensaje, normalizarReservas, normalizarSlug, validarDocumento });
	globalScope.FotoContratoV1 = api;
	if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof globalThis !== 'undefined' ? globalThis : window));
