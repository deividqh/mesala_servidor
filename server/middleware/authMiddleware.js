const jwt = require('jsonwebtoken');                    // Para la autenticación JWT.

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Para proteger las rutas que requieren que el usuario esté logueado (como guardar fotos),
// necesitamos un middleware que verifique el JWT.
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

/** ⬜ Backend ⬜​
 * @description Middleware para verificar si el JWT es válido.
 * Si es válido, adjunta el usuario decodificado a `req.user`.
 */
function authMiddleware(req, res, next) {
    // const authHeader = req.headers.authorization;
    const authHeader = req.get('authorization');

    if ( !authHeader || !authHeader.startsWith('Bearer ') ) {
      return res.status(401).json({ message:  'Token no proporcionado.' });
    }
    // El formato esperado es: Authorization: Bearer <TOKEN>
    // Eliminar 'Bearer ' del inicio de la cadena
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        // 2. Verificar el token JWT
        const payload = jwt.verify(token, JWT_SECRET);

        // Adjuntar el payload del usuario al objeto request
        // El `payload` contiene `{ id: user.id, username: user.username }`
        req.user = payload;
        
        return next();                    // Continuar con la ruta

    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}

module.exports = authMiddleware;
