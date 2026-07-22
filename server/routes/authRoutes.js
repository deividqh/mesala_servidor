// NODE.js
const express = require('express');
// Hay que importar las funciones que se van a usar aqui de puente hacia ../controllers/authController
const { register, login } = require('../controllers/authController');

// Hay que importar las funciones que se van a usar aqui de puente hacia ../middleware/authController
const authMiddleware = require('../middleware/authMiddleware');


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Este archivo mapea las URLs a las funciones del controlador
// • Cuando alguien intenta acceder a /registro mediante una solicitud POST, el servidor sabe exactamente 
// qué bloque de código debe ejecutar para manejar esa solicitud, gracias a este "mapeo" o enrutamiento (routing).
// • En resumen, "mapear" es el proceso de definir qué hace el servidor con cada solicitud web que recibe.
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para que un usuario existente inicie sesión
router.post('/login', login);

// Ruta para obtener los datos del usuario autenticado
router.get('/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • 
// • El término "mapea" en el contexto de  JavaScript significa que el código está conectando
//  o asociando URLs específicas (las rutas) con funciones de JavaScript específicas (los controladores)
//  que se ejecutarán cuando un usuario visite esa URL o envíe datos a ella

// • Es como crear un índice o un mapa de carreteras donde:
// La "dirección" es la URL (por ejemplo, /registro).
// El "destino" es la función del controlador (por ejemplo, authController.register).
// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • 
