// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ████████████████████████  LOGICA DEL NEGOCIO DE LOGIN Y REGISTRO
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// CONFIGURA EL JWT Y LA LOGICA DEL NEGOCIO PARA  REGISTRO Y LOGIN
// ■ Lógica de Autenticación (Controller) 🔐
//    • Usaremos la librería bcrypt (deberías instalarla: npm install bcrypt) para manejar los hashes
//    de las contraseñas, ya que la columna password_hash de tu schema.sql lo requiere.
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    // • Permite a los usuarios loguearse Y registrarse.
const pool = require('../config/db');   // • Importar el pool de conexiones a la base de datos MariaDB

const saltRounds = 10;              // Número recomendado de rondas de sal para bcrypt

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
// ███████████████████████████████████████████████████████████████████████████████████████████ REGISTRO:

/**
 * Construir el payload/(ficha) del usuario para el token JWT 
 * @param {object} user = {id: string , username: string , email: string , role: string}
 * @returns 
 */
const set_payload_usuario = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role
});

/**
 * @description Construir la respuesta de autenticación con el token JWT y el usuario.
 * @param {object} user = {id: string , username: string , email: string , role: string}
 * @returns {object} = { user: {id: string , username: string , email: string , role: string}, 
 *                       token: string }
 */
const set_response_authentication = (user) => {
  // ■ Genera el "payload" limpio.
  const payload = set_payload_usuario(user);
  
  // ■■■■■■■■■■■■■■■■■■■■■■■■■
  // Firma el Token (JWT): Crea la "llave digital" (token) que el usuario usará para futuras peticiones.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  // ■ Retorno   
  return { user: payload, token };
};

/**
 * @description Maneja el registro de nuevos usuarios.
 *              Ruta: POST /api/usuario/registro
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
async function register(req, res) {
    // Extrae username, email y password del cuerpo de la petición (req.body).
    const { username, email, password } = req.body || {};
    // ¿Falta algún dato? Si es así, responde con error 400 y detente.
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email y password son obligatorios.' });
    }
    try {
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // ■■■ Verificar si el usuario o correo ya existen 
        const [existing] = await pool.query(
          'SELECT id FROM usuario WHERE username = ? OR email = ? LIMIT 1',
          [username, email]
        );
        // ► Si ya existe un usuario con ese nombre o correo, devolver un error
        if (existing.length > 0) {
          return res.status(409).json({ message: 'Ya existe un usuario con ese nombre o correo.' });
        }

        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // ■■■ Crear el hash de la contraseña ■■■
        const password_hash = await bcrypt.hash(password, saltRounds);
        
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // ■■■ Insertar el nuevo usuario en la base de datos (El nacimiento del usuario)
        //      • Guardo el password_hash, no el original.
        //      • Aquí es donde la base de datos genera el ID único y lo pone en result.
        const [result] = await pool.query(
          'INSERT INTO usuario (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, password_hash]
        );
        
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // ■■■ Construir el objeto del nuevo usuario insertado
        const newUser = {
          id: result.insertId,
          username,
          email,
          role: 'staff'
        };
        
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // ■■■ Devolver la respuesta con el token JWT 
        //      • Código 201 significa "Created"
        return res.status(201).json(set_response_authentication(newUser));

    } catch (error) {
        // Manejo de errores (ej. duplicidad de email o username)
        // if (error.code === 'ER_DUP_ENTRY') {
        //     return res.status(409).json({ message: "El usuario o email ya existe." });
        // }
        console.error('Error en register:', error);
        return res.status(500).json({ message: 'No se pudo completar el registro.' });
    }
}
// ███████████████████████████████████████████████████████████████████████████████████████████ LOGIN:
/**
 * @description Maneja el inicio de sesión de usuarios.
 *              Ruta: POST /api/usuario/login
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
async function login(req, res) {
    const { identifier, password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier y password son obligatorios.' });
    }

    try {
        // ■■■ Buscar el usuario por username o email ■■■
        const [rows] = await pool.query(
          'SELECT * FROM usuario WHERE (username = ? OR email = ?) LIMIT 1',
          [identifier, identifier]
        );
        
        // ► Usuario NO ENCONTRADO :(   • • • • devolver un error 401
        if (rows.length === 0) {
          return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
        }
        // ► Usuario ENCONTRADO :)      • • • obtener el primer resultado
        const user = rows[0];
        
        // ■■■ Verificar si la cuenta está activa ■■■
        if (!user.is_active) {
          return res.status(403).json({ message: 'La cuenta está desactivada.' });
        }
        // ■■■ Verificar la contraseña ■■■
        const passwordOk = await bcrypt.compare(password, user.password_hash);
        if (!passwordOk) {
          return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
        }
        // ■■■ Actualizar la fecha y hora del último login ■■■
        await pool.query('UPDATE usuario SET last_login_at = CURRENT_TIMESTAMP(3) WHERE id = ?', [user.id]);
        
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        // ■■■ Devolver la respuesta con el token JWT ■■■
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        return res.json(set_response_authentication(user));

    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ message: 'No se pudo completar el login.' });
    }
}
// ███████████████████████████████████████████████████████████████████████████████████████████ EXPORTAR:
module.exports = {
  register,
  login
};
