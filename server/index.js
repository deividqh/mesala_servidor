
// ██████████████████████████████████████████████████████████████████████████████████████████████████████
// Time-Line 1: El Arranque del Servidor.
// ██████████████████████████████████████████████████████████████████████████████████████████████████████
// Node lee este archivo. Carga las librerías (express, dotenv).
//  Node.js ejecuta los middlewares en el orden exacto en que los escribes aquí.
// Luego, cada vez que llega una petición, Node.js analiza la URL y el método (GET, POST, etc.) 
// para decidir qué middlewares y controladores ejecutar en función de las rutas definidas más abajo.
// ██████████████████████████████████████████████████████████████████████████████████████████████████████

// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■
// ■■■ MIDDLEWARES Y RUTAS 
// • Se ejecutan cada vez que llega una petición que coincida con su ruta definida. 
//   Solo se lee al iniciar el servidor.
// • Middlewares globales: (Ej. app.use(express.json())) Se ejecutan una vez por cada petición que entra al servidor, sin excepción.
// • Middlewares de ruta: Solo se ejecutan si la URL coincide. Si una ruta tiene 3 middlewares definidos, 
//   se ejecutarán los tres en orden antes de llegar al controlador. 
// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■

// ┌••••••••••••••••••••••••••••••••••
// ┌•• Cargar     Variables de Entorno     . . . desde el archivo .env
// ┌••••••••••••••••••••••••••••••••••
require('dotenv').config();               

// ┌••••••••••••••••••••••••••••••••••
// ┌•• FrameWork Node.js   ►   Express 
// ┌••••••••••••••••••••••••••••••••••
const express = require('express');                    

// ┌••••••••••••••••••••••••••••••••••••••••••••••••••••••• 
// Módulo nativo de Node.js para manejar rutas y archivos
// ┌••••••••••••••••••••••••••••••••••••••••••••••••••••••• 
const path = require('path');             

// ┌•••••••••••••••••••••••••••••••••••••••••
// ┌••  Funcion Middleware de   Autenticación
// ┌•••••••••••••••••••••••••••••••••••••••••
const authMiddleware = require('./middleware/authMiddleware');    

// ┌• middleware's de Operaciones
const authRoutes = require('./routes/authRoutes');                // la funcion Rutas de autenticación
const fotoRoutes = require('./routes/fotoRoutes');                // rutas para guardar fotos de salón
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// ┌•••••••••••••••••••••••••••••••••••••••••
// ┌•• Crear una instancia de       ► Express
// ┌•••••••••••••••••••••••••••••••••••••••••
const app = express();                    

// ┌•••••••••••••••••••••••••••••••• 
// ┌•• Middleware para parsear JSON  . . . MIDDLEWARES GLOBALES (Se ejecutan en CADA petición)
// ┌•••••••••••••••••••••••••••••••• 
app.use(express.json());                  

// ┌•••••••••••••••••••••••••••••••• Puerto de escucha
const PORT = process.env.PORT || 3000;    

// ┌•••••••••••••••••••••••• 
// ┌•• ARCHIVOS   ESTATICOS . . . para servir el Front-End. 
// • __dirname ► "C:\\Users\\pc\\Desktop\\JAVASCRIPT\\salon_last_dance\\server"
const carpeta_publica = path.join(__dirname, '..', 'cliente_web');    

// ┌•••••••••••••••••••••••• 
// ┌•• MIDDLEWARES      GLOBALES . . . se ejecutan en CADA petición
// • carpeta_publica ► "C:\\Users\\pc\\Desktop\\JAVASCRIPT\\salon_last_dance\\cliente_web"
app.use(express.static(carpeta_publica));       


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■■■■■■ PAGINA DE INICIO DE LA APLICACION ■■■■■■■■■
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
app.get('/', (req, res) => {
  const file_path = path.join(carpeta_publica, 'index.html');
  res.sendFile(file_path);
});


// ┌•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• 
// ┌• Rutas de autenticación. Todaas las rutas empiezan con     /api/auth  tienen su propio archivo de rutas authRoutes.js
// ┌•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• 
app.use('/api/auth' , authRoutes);

// ┌•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• 
// ┌• Rutas para manejar fotos. Todas las rutas empiezan con   /api/fotos  tienen su propio archivo de rutas fotoRoutes.js
// ┌•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• 
app.use('/api/fotos', fotoRoutes);



// ┌•• Middleware para manejar rutas no encontradas
app.use((req, res) => {
  return res.status(404).json({ message: 'Ruta No Encontrada.' });
});

// ┌•• Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor. ' });
});

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████████  RECIBIENDO PETICIONES  DE USUARIO ████████████████████████
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// app.listen(PORT, () => {
//   console.log(`Servidor  escuchando en http://localhost:${PORT}`);
// });
// Escuchar en '0.0.0.0' permite conexiones desde otros dispositivos en el mismo Wi-Fi
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌐 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`     ┌•••••••• Accesible en tu red local en: http://<TU_IP_LOCAL>:${PORT}`);
});

