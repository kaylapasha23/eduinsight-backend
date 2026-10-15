# 🎓 EduInsight — Backend API (Tugas 9 PBL)

Backend API untuk Autentikasi dan Otorisasi (RBAC) berbasis **Node.js** dan **Express.js**.

---

## 📁 Struktur Direktori

```
mobile_backend/
├── .env                          # Konfigurasi Port & Secret JWT
├── package.json                  # Dependencies backend
├── server.js                     # Entry point Express Server
├── data/
│   ├── database.js               # Pengelola data pengguna & token blacklist
│   └── users.json                # Database JSON (otomatis terbuat saat server start)
├── middleware/
│   ├── authMiddleware.js         # Verifikasi JWT Bearer Token & cek token revoked
│   └── roleMiddleware.js         # RBAC Guard middleware (Mahasiswa, Dosen, Admin)
├── controllers/
│   └── authController.js         # Handler register, login, logout, profile, users
└── routes/
    └── authRoutes.js             # Definisi rute & endpoint API
```

---

## 🚀 Cara Menjalankan Server

1. Buka terminal (CMD / PowerShell).
2. Masuk ke direktori backend:
   ```bash
   cd d:\flutter-projects\mobile_backend
   ```
3. Jalankan server:
   ```bash
   node server.js
   ```
4. Server akan aktif di: `http://localhost:3000`

---

## 👥 Akun Dummy untuk Evaluasi / Penilaian Dosen

| Role | Email | Password | Keterangan |
|------|-------|----------|------------|
| **Mahasiswa** | `mahasiswa@eduinsight.ac.id` | `password123` | Akses fitur mahasiswa |
| **Dosen** | `dosen@eduinsight.ac.id` | `password123` | Akses fitur dosen |
| **Admin** | `admin@eduinsight.ac.id` | `admin123` | Akses manajemen user & admin |

---

## 📡 Ringkasan Endpoint API

- `POST /api/auth/register` — Pendaftaran akun baru (password di-hash dengan **Bcrypt**)
- `POST /api/auth/login` — Login pengguna & menghasilkan **JWT Token**
- `POST /api/auth/logout` — Logout & blacklist JWT Token (Proteksi Sesi)
- `GET  /api/auth/profile` — Mendapatkan data profil pengguna yang sedang login
- `GET  /api/auth/users` — Melihat daftar seluruh pengguna (**Khusus Admin**)
- `GET  /api/auth/dashboard/mahasiswa` — Endpoint pengujian RBAC Mahasiswa
- `GET  /api/auth/dashboard/dosen` — Endpoint pengujian RBAC Dosen
- `GET  /api/auth/dashboard/admin` — Endpoint pengujian RBAC Admin
