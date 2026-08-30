const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validarFotoV1,
  validarFichaFoto,
  validarSlug,
} = require('../server/domain/fotoValidator');

/** ### Crea un documento mínimo y coherente para cada prueba. */
function crearFotoValida() {
  return {
    schema_version: 1,
    slug: 'salon_miercoles',
    captured_at: '2026-01-15T10:30:00.123Z',
    salon: {
      nombre_salon: 'Gran_Salon',
      tipo_salon: 'limitado',
      filas: 16,
      columnas: 8,
      contenedor: 'salon_app',
      css: {
        baldosas: 'estilo_baldosas',
        salon: 'estilo_salon',
      },
    },
    app: {
      d_indices: {
        mesa_0: 15,
        silla_0: 16,
      },
      reservas: [
        {
          central: ['mesa_0'],
          clientes: ['silla_0'],
        },
      ],
    },
    ficha_foto: {
      titulo: 'Miércoles',
      mensaje: null,
      es_cerrada: false,
      es_favorita: false,
    },
    motores: {
      motor_mensajes: {
        mesa_0: 'Mesa principal',
      },
      motor_alergias: {
        silla_0: ['pescado'],
      },
    },
    rangos: {
      rango_reservas: [],
      rango_matriz: {
        values: {
          B1: 'mesa_0',
          C1: 'silla_0',
        },
      },
      rango_otros: [],
    },
  };
}

test('acepta y normaliza una foto v1 coherente', () => {
  const resultado = validarFotoV1(crearFotoValida());

  assert.equal(resultado.ok, true);
  assert.deepEqual(resultado.errores, []);
  assert.deepEqual(resultado.avisos, []);
  assert.equal(resultado.valor.ficha_foto.mensaje, null);
  assert.ok(resultado.valor.captured_at instanceof Date);
});

test('rechaza dimensiones superiores al contrato', () => {
  const foto = crearFotoValida();
  foto.salon.filas = 51;

  const resultado = validarFotoV1(foto);

  assert.equal(resultado.ok, false);
  assert.ok(resultado.errores.some((error) => error.includes('/salon/filas')));
});

test('elimina un elemento inexistente sin eliminar la reserva válida', () => {
  const foto = crearFotoValida();
  foto.app.reservas[0].clientes.push('silla_23');

  const resultado = validarFotoV1(foto);

  assert.equal(resultado.ok, true);
  assert.deepEqual(resultado.valor.app.reservas[0], {
    central: ['mesa_0'],
    clientes: ['silla_0'],
  });
  assert.equal(resultado.avisos[0].code, 'ELEMENT_REFERENCE_REMOVED');
});

test('rechaza la contradicción entre índices y rango_matriz', () => {
  const foto = crearFotoValida();
  delete foto.rangos.rango_matriz.values.C1;

  const resultado = validarFotoV1(foto);

  assert.equal(resultado.ok, false);
  assert.ok(resultado.errores.some((error) => error.includes('no aparece en rangos.rango_matriz.values')));
});

test('normaliza un mensaje vacío como null al editar la ficha', () => {
  const resultado = validarFichaFoto({
    slug: 'salon_miercoles',
    titulo: 'Miércoles',
    mensaje: '   ',
    es_cerrada: true,
    es_favorita: false,
  }, { permitirSlug: true });

  assert.equal(resultado.ok, true);
  assert.equal(resultado.valor.mensaje, null);
});

test('rechaza un slug que no sea snake_case minúsculo', () => {
  const resultado = validarSlug('Salón Miércoles');

  assert.equal(resultado.ok, false);
});
