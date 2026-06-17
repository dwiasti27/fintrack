const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fintrack_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL Database (fintrack_db)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error connecting to MySQL:');
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database "fintrack_db" tidak ditemukan! Silakan jalankan file SQL di phpMyAdmin.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Koneksi ditolak! Pastikan XAMPP/MySQL Anda sudah menyala.');
        } else {
            console.error(err.message);
        }
    });

module.exports = pool;
