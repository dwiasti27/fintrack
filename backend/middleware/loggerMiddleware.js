const fs = require('fs');
const path = require('path');

// Log file path — ditulis di folder backend/logs/access.log
const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'access.log');

// Pastikan folder logs ada
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * FINTRACK Access Logger Middleware
 * Mencatat setiap request yang masuk ke server:
 * Waktu, IP, Method, URL, dan Status Code.
 */
const accessLogger = (req, res, next) => {
    const startTime = Date.now();

    // Jalankan setelah response selesai dikirim
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const method = req.method;
        const url = req.originalUrl;
        const status = res.statusCode;
        const timestamp = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        // Warna di terminal berdasarkan status code
        const statusColor = status >= 500 ? '\x1b[31m' // Merah
            : status >= 400 ? '\x1b[33m'               // Kuning
            : status >= 300 ? '\x1b[36m'               // Cyan
            : '\x1b[32m';                               // Hijau
        const reset = '\x1b[0m';
        const dim = '\x1b[2m';

        // Tampilkan di terminal
        console.log(
            `${dim}[${timestamp}]${reset} ` +
            `\x1b[34m${ip.padEnd(18)}${reset} ` +
            `\x1b[1m${method.padEnd(7)}${reset}` +
            `${url.padEnd(40)} ` +
            `${statusColor}${status}${reset} ` +
            `${dim}${duration}ms${reset}`
        );

        // Simpan ke file log (plain text tanpa warna ANSI)
        const logLine = `[${timestamp}] IP: ${ip} | ${method} ${url} | Status: ${status} | ${duration}ms\n`;
        fs.appendFile(logFile, logLine, (err) => {
            if (err) console.error('Log write error:', err.message);
        });
    });

    next();
};

module.exports = accessLogger;
