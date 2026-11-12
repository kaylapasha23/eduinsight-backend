const mysql = require('mysql2/promise');

const seedScript = async () => {
  let connection;
  try {
    console.log('🔄 Menghubungkan ke MySQL server lokal...');

    // 1. Hubungkan ke MySQL server tanpa menentukan database terlebih dahulu
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('📦 Membuat database db_eduinsight jika belum ada...');
    await connection.query('CREATE DATABASE IF NOT EXISTS `db_eduinsight` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    await connection.query('USE `db_eduinsight`;');

    console.log('🔄 Menyiapkan tabel skema...');

    // 2. Matikan Foreign Keys sementara
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DROP TABLE IF EXISTS pengumpulan_tugas');
    await connection.query('DROP TABLE IF EXISTS tugas');
    await connection.query('DROP TABLE IF EXISTS kelas');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 3. Buat Tabel Users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_uid VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('mahasiswa', 'dosen', 'admin') NOT NULL DEFAULT 'mahasiswa',
        nim_nip VARCHAR(50) NULL,
        angkatan VARCHAR(10) NULL,
        fakultas VARCHAR(100) DEFAULT 'Ilmu Komputer',
        prodi VARCHAR(100) DEFAULT 'Teknik Informatika',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Buat Tabel Kelas (Jadwal)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kelas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL,
        sks INT DEFAULT 3,
        semester INT DEFAULT 4,
        dosen_id INT NULL,
        dosen_name VARCHAR(150) NULL,
        class_room VARCHAR(100) NULL,
        schedule_day VARCHAR(20) NOT NULL,
        schedule_time VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dosen_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Buat Tabel Tugas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tugas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NULL,
        deadline_text VARCHAR(50) NOT NULL,
        category ENUM('segera', 'selesai', 'terlambat') DEFAULT 'segera',
        attachment_name VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (class_id) REFERENCES kelas(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Buat Tabel Pengumpulan Tugas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pengumpulan_tugas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        student_id INT NOT NULL,
        file_name VARCHAR(255) NULL,
        status ENUM('Diserahkan', 'Terlambat', 'Belum Diserahkan') DEFAULT 'Diserahkan',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tugas(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Berhasil membuat tabel: users, kelas, tugas, pengumpulan_tugas!');

    // 7. Masukkan Data Users
    await connection.query(`
      INSERT INTO users (id, user_uid, name, email, password_hash, role, nim_nip, angkatan, fakultas, prodi) VALUES
      (1, 'user-mhs-brooke', 'Brooke Everly', 'brookeverly17@eduinsight.student.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'mahasiswa', '254076512225017', '2023', 'Ilmu Komputer', 'Teknik Informatika'),
      (2, 'user-mhs-chris', 'Chris Redfield', 'redchris@gmail.com', '$2a$10$AQbxzsY/W9BFHCdCx3MmluSKrFguO.DyCDQyYRdQtuX7NWCMk6Yn.', 'mahasiswa', '254076512225018', '2023', 'Ilmu Komputer', 'Teknik Informatika'),
      (3, 'user-dsn-sahroni', 'Dr. Ahmad Sahroni, M.Kom.', 'sahroni@eduinsight.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'dosen', '198503152010121002', NULL, 'Ilmu Komputer', 'Teknik Informatika'),
      (4, 'user-dsn-astuti', 'Ir. Tri Astuti, M.T.', 'astuti@eduinsight.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'dosen', '197908222005012001', NULL, 'Ilmu Komputer', 'Teknik Informatika'),
      (5, 'user-dsn-teddy', 'Teddy Indra Wijaya, M.Kom.', 'teddy@eduinsight.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'dosen', '198811042014041001', NULL, 'Ilmu Komputer', 'Teknik Informatika'),
      (6, 'user-dsn-bambang', 'Prof. Bambang Hariyanto, Ph.D.', 'bambang@eduinsight.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'dosen', '196504121990031003', NULL, 'Ilmu Komputer', 'Teknik Informatika'),
      (7, 'user-dsn-ivan', 'Ivan Gunawan, M.Ds.', 'ivan@eduinsight.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'dosen', '198902182015041002', NULL, 'Ilmu Komputer', 'Desain Komunikasi Visual'),
      (8, 'user-adm-001', 'Administrator Akademik', 'admin@eduinsight.ac.id', '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6', 'admin', '198001012006041001', NULL, 'Ilmu Komputer', 'Sistem Informasi');
    `);

    // 8. Masukkan Data Kelas (Jadwal)
    await connection.query(`
      INSERT INTO kelas (id, code, name, sks, semester, dosen_id, dosen_name, class_room, schedule_day, schedule_time) VALUES
      (1, 'VTI51366', 'Kecerdasan Buatan', 3, 4, 3, 'Dr. Ahmad Sahroni, M.Kom.', 'Lantai 7, Ruangan 701', 'Senin', '14.00 - 15.20 WIB'),
      (2, 'VTI51329', 'Pemrograman Web', 4, 4, 4, 'Ir. Tri Astuti, M.T.', 'Lantai 5, Ruang 502', 'Selasa', '08.00 - 10.00 WIB'),
      (3, 'VTI51250', 'Basis Data Terdistribusi', 4, 4, 5, 'Teddy Indra Wijaya, M.Kom.', 'Lantai 6, Ruang 606', 'Rabu', '12.00 - 14.00 WIB'),
      (4, 'VTI51322', 'Keamanan Siber & Jaringan', 4, 4, 6, 'Prof. Bambang Hariyanto, Ph.D.', 'Lab Keamanan, Lantai 4', 'Kamis', '10.00 - 12.00 WIB'),
      (5, 'VTI51375', 'Rekayasa Perangkat Lunak', 4, 4, 7, 'Ivan Gunawan, M.Ds.', 'Lantai 3, Ruang 304', 'Jumat', '08.00 - 10.30 WIB'),
      (6, 'VTI51389', 'Statistika Komputasi', 3, 4, 3, 'Dr. Rini Handayani, M.M.', 'Lantai 4, Ruang 402', 'Jumat', '13.30 - 15.30 WIB'),
      (7, 'VTI51301', 'Kewirausahaan', 2, 4, 7, 'Dr. Rini Handayani, M.M.', 'Lantai 2, Ruang 201', 'Senin', '10.00 - 11.40 WIB'),
      (8, 'VTI51302', 'UI/UX Design', 3, 4, 7, 'Ivan Gunawan, M.Ds.', 'Lab Multimedia, Lantai 5', 'Selasa', '13.00 - 15.30 WIB'),
      (9, 'VTI51303', 'Internet of Things (IoT)', 3, 4, 5, 'Teddy Indra Wijaya, M.Kom.', 'Lab IoT, Lantai 6', 'Rabu', '15.00 - 17.30 WIB');
    `);

    // 9. Masukkan Data Tugas
    await connection.query(`
      INSERT INTO tugas (id, class_id, title, description, deadline_text, category, attachment_name) VALUES
      (1, 7, 'Tugas 1 - Quiziz', 'Kerjakan kuis mingguan melalui platform Quiziz dengan materi Bab 1 - 3.', 'Hari ini, 23.59', 'segera', 'Panduan_Kuis_Kwu.pdf'),
      (2, 8, 'Tugas 1 - Analisa Aplikasi', 'Lakukan analisis usability dan heuristik pada salah satu aplikasi mobile e-commerce.', 'Hari ini, 23.59', 'segera', 'Template_Analisa_UIUX.docx'),
      (3, 9, 'Pertemuan Pertama', 'Pelajari modul arsitektur IoT dan sensor, rangkum dalam format PDF 2 halaman.', 'Rabu, 23.59', 'segera', 'Modul_IoT_Dasar.pdf'),
      (4, 1, 'Tugas Pengenalan AI', 'Resume sejarah AI dan perbedaan metode klasifikasi modern.', 'Diserahkan', 'selesai', 'Materi_Intro_AI.pdf'),
      (5, 3, 'Latihan SQL Dasar', 'Latihan query DDL dan DML pada skema database perpustakaan kampus.', 'Diserahkan', 'selesai', 'Soal_SQL_Lab.sql'),
      (6, 2, 'Tugas Array & Function', 'Implementasi algoritma pemrosesan array dan fungsi rekursif JavaScript.', 'Diserahkan', 'selesai', 'Tugas_JS_Array.pdf'),
      (7, 9, 'Laporan Praktikum 1', 'Laporan instalasi mikrokontroler ESP32 dan pembacaan sensor DHT11.', 'Diserahkan', 'selesai', 'Format_Laporan_IoT.docx');
    `);

    // 10. Masukkan Data Pengumpulan Contoh
    await connection.query(`
      INSERT INTO pengumpulan_tugas (task_id, student_id, file_name, status) VALUES
      (4, 1, 'Tugas_Pengenalan_AI_Brooke.pdf', 'Diserahkan'),
      (5, 1, 'Latihan_SQL_Dasar_Brooke.sql', 'Diserahkan'),
      (6, 1, 'Tugas_Array_Function_Brooke.zip', 'Diserahkan'),
      (7, 1, 'Laporan_Praktikum_1_IoT_Brooke.pdf', 'Diserahkan');
    `);

    console.log('🎉 Database db_eduinsight dan seluruh data Users, Kelas, dan Tugas BERHASIL dibuat!');
    if (connection) await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal menjalankan seed database:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
};

seedScript();
