const mysql = require('mysql2/promise');

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 
// Este módulo se encargará de crear y exportar el pool de conexiones a MariaDB.
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 

// Crear un pool de conexiones para Express (createPool)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'salon_div_x_div',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar el pool. 'pool.promise()' es el estándar moderno para usar async/await
module.exports = pool;
