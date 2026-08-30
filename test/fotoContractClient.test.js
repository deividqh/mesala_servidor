const test = require('node:test');
const assert = require('node:assert/strict');

const FotoContratoV1 = require('../cliente_web/js/fotoContract');
const { validarFotoV1 } = require('../server/domain/fotoValidator');

/** ### Crea los datos mínimos que produce el salón del navegador. */
function crearDatosCliente() {
	return {
		slug: 'Salón Miércoles',
		captured_at: '2026-01-15T10:30:00.123Z',
		nombre_salon: 'Gran_Salon',
		tipo_salon: 'limitado',
		filas: 16,
		columnas: 8,
		configuracion: {
			salon: {
				family: 'Gran_Salon',
				contenedor: '',
				clases_css: { baldosas: 'estiloBaldosas', contenedor: 'estiloSalon' },
			},
		},
		indices: { mesa_0: 15, silla_0: 16 },
		reservas: [{ reservadores: ['mesa_0'], clientes: ['silla_0'] }],
		titulo: 'Miércoles',
		mensaje: '   ',
		es_cerrada: false,
		es_favorita: true,
		mensajes: { mesa_0: 'Principal' },
		alergias: { silla_0: ['soja'] },
		rango_matriz: { values: { B1: 'mesa_0', C1: 'silla_0' } },
	};
}

test('construye el contrato v1 desde el estado interno del cliente', () => {
	const foto = FotoContratoV1.crearDocumento(crearDatosCliente());

	assert.equal(foto.schema_version, 1);
	assert.equal(foto.slug, 'salon_miercoles');
	assert.equal(foto.ficha_foto.mensaje, null);
	assert.deepEqual(foto.app.reservas[0], { central: ['mesa_0'], clientes: ['silla_0'] });
	assert.deepEqual(FotoContratoV1.validarDocumento(foto), []);
	assert.equal(validarFotoV1(foto).ok, true);
});

test('detecta una contradicción entre índices y rango matriz antes de enviar', () => {
	const datos = crearDatosCliente();
	delete datos.rango_matriz.values.C1;
	const foto = FotoContratoV1.crearDocumento(datos);

	assert.ok(FotoContratoV1.validarDocumento(foto).some((error) => error.includes('rango matriz')));
});

test('no envía las celdas vacías del rango matriz al servidor', () => {
	const datos = crearDatosCliente();
	datos.rango_matriz.values.A0 = false;
	datos.rango_matriz.values.D1 = null;
	datos.rango_matriz.values.E2 = '';
	const foto = FotoContratoV1.crearDocumento(datos);

	assert.deepEqual(foto.rangos.rango_matriz.values, { B1: 'mesa_0', C1: 'silla_0' });
	assert.equal(validarFotoV1(foto).ok, true);
});
