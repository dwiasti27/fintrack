const mysql = require('mysql2/promise');
require('dotenv').config();

// Support both MYSQL_URL (Railway) and individual env vars (local)
let poolConfig;

if (process.env.MYSQL_URL) {
    // Railway provides a full connection URL
    poolConfig = {
        uri: process.env.MYSQL_URL,
        ssl: { rejectUnauthorized: false },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
} else {
    poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'fintrack_db',
        ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}

const pool = mysql.createPool(poolConfig);

// Test connection
pool.getConnection()
    .then(connection => {
        const host = process.env.DB_HOST || process.env.MYSQL_URL ? 'Railway Cloud' : 'localhost';
        console.log(`✅ Connected to MySQL Database (${host})`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error connecting to MySQL:');
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database tidak ditemukan! Silakan jalankan file SQL setup terlebih dahulu.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Koneksi ditolak! Pastikan MySQL server sudah menyala.');
        } else {
            console.error(err.message);
        }
    });

module.exports = pool;
