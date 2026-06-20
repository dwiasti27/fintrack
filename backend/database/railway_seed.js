/**
 * FINTRACK — Railway Database Seeder
 * Menjalankan script ini akan membuat semua tabel dan data awal
 * di database Railway MySQL secara langsung via Node.js.
 */

const mysql = require('mysql2/promise');

const config = {
    host: 'thomas.proxy.rlwy.net',
    port: 13752,
    user: 'root',
    password: 'pttLcDAmornfeoZKWXmDLYPXKBZrWZBJ',
    database: 'railway',
    ssl: { rejectUnauthorized: false }
};

const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        no_hp VARCHAR(20) NOT NULL,
        kode_negara VARCHAR(10) DEFAULT '+62',
        password VARCHAR(255) NOT NULL,
        tema_pilihan VARCHAR(50) DEFAULT 'theme-dark',
        avatar VARCHAR(255) DEFAULT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`,

    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        nama_kategori VARCHAR(50) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        tipe ENUM('pemasukan', 'pengeluaran') NOT NULL,
        warna VARCHAR(20) DEFAULT '#0284C7',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,

    // Transactions table
    `CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category_id INT NOT NULL,
        judul VARCHAR(100) NOT NULL,
        nominal DECIMAL(15,2) NOT NULL,
        tipe ENUM('pemasukan', 'pengeluaran') NOT NULL,
        catatan TEXT DEFAULT NULL,
        tanggal DATE NOT NULL,
        lampiran VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,

    // Notifications table
    `CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        judul VARCHAR(100) NOT NULL,
        pesan TEXT NOT NULL,
        tipe VARCHAR(50) DEFAULT 'info',
        dibaca BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
];

const seedCategories = `
    INSERT IGNORE INTO categories (user_id, nama_kategori, icon, tipe, warna) VALUES
    (NULL, 'Gaji', 'payments', 'pemasukan', '#10B981'),
    (NULL, 'Bonus', 'redeem', 'pemasukan', '#3B82F6'),
    (NULL, 'Investasi', 'trending_up', 'pemasukan', '#8B5CF6'),
    (NULL, 'Makanan', 'restaurant', 'pengeluaran', '#F59E0B'),
    (NULL, 'Minuman', 'local_cafe', 'pengeluaran', '#F97316'),
    (NULL, 'Transportasi', 'directions_car', 'pengeluaran', '#3B82F6'),
    (NULL, 'Belanja', 'shopping_bag', 'pengeluaran', '#EC4899'),
    (NULL, 'Tagihan', 'receipt_long', 'pengeluaran', '#EF4444'),
    (NULL, 'Hiburan', 'movie', 'pengeluaran', '#8B5CF6'),
    (NULL, 'Kesehatan', 'medical_services', 'pengeluaran', '#10B981'),
    (NULL, 'Pendidikan', 'school', 'pengeluaran', '#F59E0B'),
    (NULL, 'Tabungan', 'savings', 'pengeluaran', '#0284C7'),
    (NULL, 'Lainnya', 'category', 'pengeluaran', '#64748B')
`;

const seedAdmin = `
    INSERT IGNORE INTO users (nama_lengkap, email, password, no_hp, role)
    VALUES ('Admin FINTRACK', 'admin@fintrack.id', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWu', '08000000000', 'admin')
`;

async function seed() {
    let conn;
    try {
        console.log('🔌 Menghubungkan ke Railway MySQL...');
        conn = await mysql.createConnection(config);
        console.log('✅ Terhubung ke Railway!');

        for (const q of queries) {
            const tableName = q.match(/TABLE IF NOT EXISTS (\w+)/)?.[1] || 'tabel';
            await conn.execute(q);
            console.log(`  ✅ Tabel "${tableName}" siap`);
        }

        await conn.execute(seedCategories);
        console.log('  ✅ Kategori default berhasil diisi');

        await conn.execute(seedAdmin);
        console.log('  ✅ Akun admin berhasil dibuat');

        // Verify
        const [tables] = await conn.execute('SHOW TABLES');
        console.log('\n📋 Tabel yang tersedia di Railway:');
        tables.forEach(t => console.log('  —', Object.values(t)[0]));

        console.log('\n🎉 Setup Railway berhasil! Database siap digunakan.');
        console.log('\n📌 Kredensial admin:');
        console.log('   Email   : admin@fintrack.id');
        console.log('   Password: admin123');

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.code) console.error('   Code:', err.code);
    } finally {
        if (conn) await conn.end();
        process.exit(0);
    }
}

seed();
