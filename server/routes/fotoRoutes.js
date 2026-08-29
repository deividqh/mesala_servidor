// ████████████████████████████████████████████
// ██ Llamada desde server/index.js
// ████████████████████████████████████████████
// Router: Se ejecuta Una vez x petición entrante
// El sistema de rutas actúa como un "conmutador". Node.js analiza la URL y el método (GET, POST, etc.) 
// una vez por petición para decidir qué controlador debe manejarla

// ■■■■■■■■ Importar Express para crear el enrutador
const express = require('express');

// ■■■■■■■■ Importar el middleware de autenticación y el controlador de fotos
const authMiddleware = require('../middleware/authMiddleware');

// ■■■■■■■■ Definir las funciones
// Importar la función para crear/actualizar una nueva foto de salón
const {
  createFoto,
  updateFoto,
  updateFichaFoto,
  select_foto_by_slug,
  read_fotos, 
  delete_foto,
  get_foto_by_id,
  get_dimension_foto,
} = require('../controllers/fotoController');

// ■■■■■■■■ Enrutador de Express para las rutas de fotos
const router = express.Router();

// ■■■■■■■■ Definir las rutas

// Ruta para obtener la lista de fotos del usuario (protegida por authMiddleware)
router.get('/mis-fotos', authMiddleware, read_fotos);

// Ruta para obtener datos de una foto (protegida por authMiddleware)
router.get('/:id', authMiddleware, get_foto_by_id);

// Ruta para obtener las dimensiones de un Salon a través del id de la foto.
router.get('/:id/dimensiones', authMiddleware, get_dimension_foto);

// Ruta para crear una nueva foto de salón (protegida por authMiddleware)
router.post('/', authMiddleware, createFoto);

// Ruta para verificar si una foto con un slug público ya existe (protegida por authMiddleware)
router.post('/check-existing', authMiddleware, select_foto_by_slug); 

// Ruta para SOBRESCRIBIR una instantánea completa. Cambia captured_at.
router.put('/:id', authMiddleware, updateFoto);

// Ruta para EDITAR sólo título, mensaje, slug y marcas. Conserva captured_at.
router.patch('/:id/ficha', authMiddleware, updateFichaFoto);

// Ruta para eliminar una foto del usuario (protegida por authMiddleware)
router.delete('/:id', authMiddleware, delete_foto);


// ■■■■■■■■ Exportar el enrutador
module.exports = router;
