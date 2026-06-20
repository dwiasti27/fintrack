-- ============================================================
-- FINTRACK — Railway Cloud Database Setup
-- ============================================================

-- Gunakan database railway yang sudah ada di Railway
USE railway;

-- ============================================================
-- Tabel Users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB;

-- ============================================================
-- Tabel Categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL COMMENT 'NULL = kategori default global',
    nama_kategori VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    tipe ENUM('pemasukan', 'pengeluaran') NOT NULL,
    warna VARCHAR(20) DEFAULT '#0284C7',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert Default Categories (Global)
INSERT INTO categories (user_id, nama_kategori, icon, tipe, warna) VALUES
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
(NULL, 'Lainnya', 'category', 'pengeluaran', '#64748B');

-- ============================================================
-- Tabel Transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
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
) ENGINE=InnoDB;

-- ============================================================
-- Tabel Notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(100) NOT NULL,
    pesan TEXT NOT NULL,
    tipe VARCHAR(50) DEFAULT 'info',
    dibaca BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Akun Admin Default
-- Password: admin123 (bcrypt hash)
-- ============================================================
INSERT INTO users (nama_lengkap, email, password, no_hp, role)
VALUES ('Admin FINTRACK', 'admin@fintrack.id', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWu', '08000000000', 'admin');
