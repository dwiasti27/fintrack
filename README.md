<div align="center">

# 💰 FINTRACK
### Personal Financial Advisor & Analytics Platform

![Demo Mode](https://img.shields.io/badge/Status-Demo%20%2F%20Portfolio-F59E0B?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20Node.js%20%7C%20MySQL-00F0FF?style=for-the-badge)
![License](https://img.shields.io/badge/License-Academic%20Only-7000FF?style=for-the-badge)

> **⚠️ DEMO / PORTFOLIO PROJECT** — Aplikasi ini dibuat untuk keperluan akademis dan portofolio. Bukan produk komersial. Dilarang menggunakan, mendistribusikan, atau mengklaim karya ini sebagai milik sendiri tanpa izin.

</div>

---

## ✨ Fitur Utama

| Fitur | Status |
|---|---|
| 🔐 Autentikasi JWT (Register / Login) | ✅ Selesai |
| 📊 Dashboard Keuangan Real-time | ✅ Selesai |
| 💸 Manajemen Transaksi (CRUD) | ✅ Selesai |
| 📁 Manajemen Kategori Dinamis | ✅ Selesai |
| 📈 Analitik & Grafik Arus Kas | ✅ Selesai |
| 🔔 Sistem Notifikasi | ✅ Selesai |
| 👤 Halaman Profil & Pengaturan | ✅ Selesai |
| 📋 Ekspor Data CSV | ✅ Selesai |
| 👑 Admin Dashboard (Command Center) | ✅ Selesai |
| 🖥️ Server Access Logger | ✅ Selesai |

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, Vanilla CSS, JavaScript (ES6+)
- Tailwind CSS (via CDN)
- Google Fonts (Public Sans)
- Material Symbols

**Backend:**
- Node.js + Express.js
- MySQL (via mysql2/promise)
- JWT Authentication (jsonwebtoken)
- bcryptjs (password hashing)

---

## 🚀 Cara Menjalankan (Lokal)

> Pastikan sudah terinstall: **Node.js**, **XAMPP (MySQL)**, dan **Git**

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env sesuai konfigurasi database lokal Anda
```

### 3. Setup Database
```sql
-- Buka phpMyAdmin atau MySQL CLI, lalu jalankan:
CREATE DATABASE fintrack_db;
-- Import file: backend/database/fintrack_db.sql
```

### 4. Jalankan Server
```bash
cd backend
node server.js
# Server berjalan di http://localhost:5000
```

### 5. Buka Frontend
```
Buka file Index.html di browser
atau gunakan Live Server extension di VS Code
```

---

## 📁 Struktur Proyek

```
FINTRACK/
├── 📄 index.html           # Landing page
├── 📄 Login.html           # Halaman login
├── 📄 dashboard.html       # Dashboard utama
├── 📄 transaksi.html       # Daftar transaksi
├── 📄 analitik.html        # Analitik & grafik
├── 📄 admin.html           # Admin Command Center
├── 📂 js/
│   ├── auth.js             # Auth guard & API helper
│   └── demo.js             # Demo mode banner
├── 📂 backend/
│   ├── server.js           # Entry point Express
│   ├── .env.example        # Template environment
│   ├── 📂 controllers/     # Business logic
│   ├── 📂 routes/          # API endpoints
│   ├── 📂 middleware/      # Auth, Admin, Logger
│   ├── 📂 config/          # Database config
│   └── 📂 database/        # SQL schema & seed
└── README.md
```

---

## 🔑 Akun Demo

> Akun ini hanya tersedia jika Anda menjalankan di lokal dengan data seed.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fintrack.id` | `admin123` |
| User | Daftar sendiri | - |

---

## ⚖️ Lisensi & Hak Cipta

```
Copyright © 2026 — Tugas Kuliah Semester 4, Pemrograman Web
Seluruh desain, kode, dan arsitektur adalah karya original penulis.

DILARANG:
✗ Menggunakan proyek ini secara komersial
✗ Mendistribusikan ulang tanpa atribusi
✗ Mengklaim sebagai karya sendiri

DIIZINKAN:
✓ Membaca dan mempelajari kode (referensi)
✓ Fork untuk keperluan belajar pribadi (dengan atribusi)
```

---

<div align="center">
  <sub>Dibuat dengan ❤️ menggunakan Node.js + HTML + MySQL</sub>
</div>
