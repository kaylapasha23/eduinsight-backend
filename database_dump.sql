CREATE DATABASE IF NOT EXISTS `eduinsight_unified_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `eduinsight_unified_db`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Table structure for table `evaluasi_mahasiswa`
--

CREATE TABLE IF NOT EXISTS `evaluasi_mahasiswa` (
  `id` varchar(191) NOT NULL,
  `dateText` varchar(191) DEFAULT NULL,
  `lecturerName` varchar(191) DEFAULT NULL,
  `messages` text DEFAULT NULL,
  `lecturerNote` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `catatanDosen` text DEFAULT NULL,
  `indikatorRisiko` varchar(191) DEFAULT NULL,
  `insightPerforma` text DEFAULT NULL,
  `kelasId` varchar(191) DEFAULT NULL,
  `nilaiAkhir` double DEFAULT NULL,
  `studentName` varchar(191) DEFAULT NULL,
  `trenKehadiran` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `kehadiran`
--

CREATE TABLE IF NOT EXISTS `kehadiran` (
  `id` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `namaMatkul` varchar(191) DEFAULT NULL,
  `nomor` int(11) NOT NULL DEFAULT 1,
  `topik` varchar(191) NOT NULL,
  `tanggal` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Hadir',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `studentName` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `kelas`
--

CREATE TABLE IF NOT EXISTS `kelas` (
  `id` varchar(191) NOT NULL,
  `kodeGabung` varchar(191) NOT NULL,
  `ruangan` varchar(191) NOT NULL,
  `hari` varchar(191) NOT NULL,
  `jamMulai` varchar(191) NOT NULL,
  `jamSelesai` varchar(191) NOT NULL,
  `semester` int(11) NOT NULL DEFAULT 6,
  `tahunAjaran` varchar(191) NOT NULL DEFAULT '2025/2026 Genap',
  `status` varchar(191) NOT NULL DEFAULT 'Aktif',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `mataKuliahId` varchar(191) NOT NULL,
  `dosenId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kelas_kodeGabung_key` (`kodeGabung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `mata_kuliah`
--

CREATE TABLE IF NOT EXISTS `mata_kuliah` (
  `id` varchar(191) NOT NULL,
  `kode` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `sks` int(11) NOT NULL DEFAULT 3,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mata_kuliah_kode_key` (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `notes`
--

CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text DEFAULT NULL,
  `synced` tinyint(1) NOT NULL DEFAULT 1,
  `updatedAt` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `password_setting`
--

CREATE TABLE IF NOT EXISTS `password_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dosenId` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `notifikasiEmail` tinyint(1) NOT NULL DEFAULT 1,
  `notifikasiSistem` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pengumpulan_tugas`
--

CREATE TABLE IF NOT EXISTS `pengumpulan_tugas` (
  `id` varchar(191) NOT NULL,
  `taskId` varchar(191) NOT NULL,
  `studentId` varchar(191) NOT NULL,
  `fileName` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Diserahkan',
  `submittedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `penilaian`
--

CREATE TABLE IF NOT EXISTS `penilaian` (
  `id` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `studentName` varchar(191) NOT NULL,
  `taskName` varchar(191) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `token_blacklist`
--

CREATE TABLE IF NOT EXISTS `token_blacklist` (
  `id` varchar(191) NOT NULL,
  `token` varchar(500) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_token_key` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `tugas`
--

CREATE TABLE IF NOT EXISTS `tugas` (
  `id` varchar(191) NOT NULL,
  `judul` varchar(191) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `deadline` datetime(3) NOT NULL,
  `lampiran` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'segera',
  `deadlineText` varchar(191) DEFAULT 'Hari ini, 23.59',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `alternativeEmails` text DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'mahasiswa',
  `nim` varchar(191) DEFAULT NULL,
  `nip` varchar(191) DEFAULT NULL,
  `angkatan` varchar(191) DEFAULT '2023',
  `fakultas` varchar(191) DEFAULT 'Ilmu Komputer',
  `prodi` varchar(191) DEFAULT 'Teknik Informatika',
  `mataKuliah` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `semester` int(11) DEFAULT 4,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_nip_key` (`nip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Data insertion
--
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `evaluasi_mahasiswa`;
TRUNCATE TABLE `kehadiran`;
TRUNCATE TABLE `kelas`;
TRUNCATE TABLE `mata_kuliah`;
TRUNCATE TABLE `notes`;
TRUNCATE TABLE `password_setting`;
TRUNCATE TABLE `pengumpulan_tugas`;
TRUNCATE TABLE `penilaian`;
TRUNCATE TABLE `token_blacklist`;
TRUNCATE TABLE `tugas`;
TRUNCATE TABLE `users`;

INSERT INTO `users` (`id`, `name`, `email`, `alternativeEmails`, `password`, `role`, `nim`, `nip`, `angkatan`, `fakultas`, `prodi`, `mataKuliah`, `createdAt`, `updatedAt`, `semester`) VALUES
('user-adm-001', 'Administrator Akademik', 'admin@eduinsight.ac.id', NULL, '$2a$10$DLUQAPLnFkL.DeWPBBR9D.VGQcssyYvf1TdNvaYf7rex0T6MGYrHW', 'admin', NULL, NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-14 15:28:13.936', '2026-11-14 16:39:21.317', 4),
('user-dsn-001', 'Dr. Ahmad Sahroni, M.Kom.', 'dosen@eduinsight.ac.id', '[\"sahroni@eduinsight.ac.id\"]', '$2a$10$zDfpzNBVoEDZf9IFfT5lYO5ixqxZiEpnzIs4aDUkrfS7BGTP4wlOC', 'dosen', NULL, '198503152010121002', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Kecerdasan Buatan\",\"Pemrograman Framework\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.238', 4),
('user-dsn-002', 'Ir. Tri Astuti, M.T.', 'triastuti@eduinsight.ac.id', NULL, '$2a$10$duLsEQ5s3HUGfswTnle68OFbC1n0QehTLdh1SFV1xmTr8odPmDdza', 'dosen', NULL, '198204122008122001', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Pemrograman Web\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.248', 4),
('user-dsn-003', 'Teddy Indra Wijaya, M.Kom.', 'teddy@eduinsight.ac.id', NULL, '$2a$10$9OjwGJnyVBCIvImUCI4V9.CQPGcV420uqISQvfJ96J8.M2nYafLZy', 'dosen', NULL, '198709232014041001', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Basis Data Terdistribusi\",\"Internet of Things (IoT)\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.261', 4),
('user-dsn-004', 'Prof. Bambang Hariyanto, Ph.D.', 'bambang@eduinsight.ac.id', NULL, '$2a$10$x/FKv1cIiQZ2MOoSpSxT4.1rl/H8tUIxnLK0JpTPizSoaJkb6EmJG', 'dosen', NULL, '197105151998031002', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Keamanan Siber & Jaringan\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.272', 4),
('user-dsn-005', 'Ivan Gunawan, M.Ds.', 'ivangunawan@eduinsight.ac.id', NULL, '$2a$10$mwk6SYzX6W2.tQc6nejboeb3xI3MtzNn36H34Nqr/S6Bfpkbgx.Km', 'dosen', NULL, '198911202015041003', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Rekayasa Perangkat Lunak\",\"UI/UX Design\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.286', 4),
('user-dsn-006', 'Dra. Endang Sulistyo, M.Stat.', 'endang@eduinsight.ac.id', NULL, '$2a$10$xvU0hvvbnmzo9LD.Tb3ZHeovgAchdd.uqeX9J5EwsCO.HAxjIOEwO', 'dosen', NULL, '196802101993032001', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Statistika Komputasi\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.298', 4),
('user-dsn-007', 'Dr. Rini Handayani, M.M.', 'rinihandayani@eduinsight.ac.id', NULL, '$2a$10$S8fDOGoxi5b719xVt0Sn3eAba8at4YpPx/Ggre8LLwoFspSzWUc4a', 'dosen', NULL, '197906142005012003', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Kewirausahaan\"]', '2026-10-14 15:28:13.802', '2026-11-14 16:39:21.305', 4),
('user-mhs-001', 'Nama Mahasiswa', 'mahasiswa@eduinsight.ac.id', NULL, '$2a$10$tn3EP8n77cCX5iRk564XROBjlWKXXq86UKlBApaIwZOxbIyVeCqNe', 'mahasiswa', '19746713498174', NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-14 15:28:13.530', '2026-11-14 16:39:21.085', 4),
('user-mhs-002', 'Mahasiswa FILKOM', 'mahasiswa@gmail.ac.id', NULL, '$2a$10$Batr4Z1zP5e0vM2dhdW5AuaE.PCft/7VT0xi.0xiAXiTg/xyFnGMu', 'mahasiswa', '19746713498175', NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-14 15:28:13.659', '2026-11-14 16:39:21.217', 4),
('user-mhs-brooke', 'Brooke Everly', 'brookeverly17@eduinsight.student.ac.id', '[\"brooke.everly@eduinsight.ac.id\",\"brookeverly17@eduinsight.mail.com\"]', '$2a$10$w9/rXdnyEjUWgO1lEMQE8OBmrfvsWQqde3s1iTSRBO2yolck1B7UK', 'mahasiswa', '254076512225017', NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-24 16:18:50.615', '2026-11-14 16:39:21.194', 4),
('user-mhs-chris', 'Chris Redfield', 'redchris@gmail.com', '[\"chris.redfield@eduinsight.student.ac.id\",\"chris@eduinsight.ac.id\"]', '$2a$10$qUGll7GkKebwL849UBKN5eW6dBX5/NWsKqw2K0S02.8do8U.qY4yG', 'mahasiswa', '254076512225018', NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-25 00:51:53.109', '2026-11-14 16:39:21.205', 4),
('user-mhs-sheren', 'Sheren Annabelle', 'sheren@eduinsight.student.ac.id', '[\"sheren@gmail.com\"]', '$2a$10$9BjwTaAGEO8oUoj0iXTZDObyhHYNVR20cBz.Q5JajPM3DNjyWDO/O', 'mahasiswa', '220101001', NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-14 15:28:13.659', '2026-11-14 16:39:21.230', 4);

INSERT INTO `mata_kuliah` (`id`, `kode`, `nama`, `sks`, `createdAt`, `updatedAt`) VALUES
('mk-ai', 'VTI51366', 'Kecerdasan Buatan', 3, '2026-11-12 01:38:25.774', '2026-11-14 16:39:21.325'),
('mk-basdat', 'VTI51250', 'Basis Data Terdistribusi', 4, '2026-11-12 01:38:25.799', '2026-11-14 16:39:21.347'),
('mk-cyber', 'VTI51322', 'Keamanan Siber & Jaringan', 4, '2026-11-12 01:38:25.814', '2026-11-14 16:39:21.357'),
('mk-iot', 'VTI51340', 'Internet of Things (IoT)', 3, '2026-11-12 01:38:25.888', '2026-11-14 16:39:21.404'),
('mk-kwu', 'VTI51310', 'Kewirausahaan', 2, '2026-11-12 01:38:25.857', '2026-11-14 16:39:21.388'),
('mk-pfa', 'PFA3', 'Pemrograman Framework', 3, '2026-11-13 04:31:31.023', '2026-11-14 16:39:21.414'),
('mk-rpl', 'VTI51375', 'Rekayasa Perangkat Lunak', 4, '2026-11-12 01:38:25.824', '2026-11-14 16:39:21.369'),
('mk-stat', 'VTI51389', 'Statistika Komputasi', 3, '2026-11-12 01:38:25.840', '2026-11-14 16:39:21.381'),
('mk-uiux', 'VTI51315', 'UI/UX Design', 3, '2026-11-12 01:38:25.875', '2026-11-14 16:39:21.397'),
('mk-web', 'VTI51329', 'Pemrograman Web', 4, '2026-11-12 01:38:25.790', '2026-11-14 16:39:21.338');

INSERT INTO `kelas` (`id`, `kodeGabung`, `ruangan`, `hari`, `jamMulai`, `jamSelesai`, `semester`, `tahunAjaran`, `status`, `createdAt`, `updatedAt`, `mataKuliahId`, `dosenId`) VALUES
('kelas-ai', 'VTI51366', 'Lantai 7, Ruangan 701', 'Senin', '14.00', '15.20', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:25.912', '2026-11-14 16:39:21.432', 'mk-ai', 'user-dsn-001'),
('kelas-basdat', 'VTI51250', 'Lantai 6, Ruang 606', 'Rabu', '12.00', '14.00', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.065', '2026-11-14 16:39:21.467', 'mk-basdat', 'user-dsn-003'),
('kelas-cyber', 'VTI51322', 'Lab Keamanan, Lantai 4', 'Kamis', '10.00', '12.00', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.091', '2026-11-14 16:39:21.497', 'mk-cyber', 'user-dsn-004'),
('kelas-iot', 'VTI51340', 'Lab Hardware & IoT, Lantai 5', 'Rabu', '15.00', '17.30', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.227', '2026-11-14 16:39:21.587', 'mk-iot', 'user-dsn-003'),
('kelas-kwu', 'VTI51310', 'Lantai 4, Ruang 401', 'Senin', '08.00', '09.40', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.174', '2026-11-14 16:39:21.553', 'mk-kwu', 'user-dsn-007'),
('kelas-pfa', 'PFA3', 'Kelas A', 'Senin', '10.20', '13.00', 6, '2025/2026 Genap', 'Aktif', '2026-11-13 04:31:31.242', '2026-11-14 16:39:21.617', 'mk-pfa', 'user-dsn-001'),
('kelas-rpl', 'VTI51375', 'Lantai 3, Ruang 304', 'Jumat', '08.00', '10.30', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.113', '2026-11-14 16:39:21.519', 'mk-rpl', 'user-dsn-005'),
('kelas-stat', 'VTI51389', 'Lantai 2, Ruang 201', 'Jumat', '13.30', '15.00', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.148', '2026-11-14 16:39:21.534', 'mk-stat', 'user-dsn-006'),
('kelas-uiux', 'VTI51315', 'Lab Multimedia, Lantai 3', 'Selasa', '13.00', '15.30', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.194', '2026-11-14 16:39:21.567', 'mk-uiux', 'user-dsn-005'),
('kelas-web', 'VTI51329', 'Lantai 5, Ruang 502', 'Selasa', '08.00', '10.00', 4, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:25.960', '2026-11-14 16:39:21.451', 'mk-web', 'user-dsn-002');

INSERT INTO `tugas` (`id`, `judul`, `deskripsi`, `deadline`, `lampiran`, `createdAt`, `updatedAt`, `kelasId`, `category`, `deadlineText`) VALUES
('tugas-ai-01', 'Tugas Pengenalan AI', 'Rangkuman pengantar AI, perbedaan antara machine learning dan deep learning, serta implementasi agen cerdas.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-11-07 16:39:20.382', 'Modul_Pengenalan_AI.pdf', '2026-11-12 01:38:26.284', '2026-11-14 16:39:21.681', 'kelas-ai', 'selesai', 'Diserahkan'),
('tugas-ai-02', 'AI Klasik dan Modern', 'Studi kasus perbandingan algoritma pencarian BFS/DFS dan A* Search pada implementasi maze routing.', '2026-11-21 16:39:20.382', NULL, '2026-11-12 01:38:26.297', '2026-11-14 16:39:21.690', 'kelas-ai', 'segera', 'Minggu depan'),
('tugas-basdat-01', 'Latihan SQL Dasar', 'Latihan query DDL & DML, join relasi tabel, dan agregasi data pada MySQL / PostgreSQL.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-11-07 16:39:20.382', 'Soal_Latihan_SQL.pdf', '2026-11-12 01:38:26.307', '2026-11-14 16:39:21.703', 'kelas-basdat', 'selesai', 'Diserahkan'),
('tugas-iot-01', 'Pertemuan Pertama', 'Buat rangkuman singkat mengenai komponen mikrokontroler ESP32 dan protokol MQTT.\n\n• Format: PDF (maksimal 2 halaman)\n• Unggah dokumen hasil resume pada bagian Tugas Saya di bawah.', '2026-11-16 16:39:20.382', NULL, '2026-11-12 01:38:26.274', '2026-11-14 16:39:21.670', 'kelas-iot', 'segera', 'Rabu, 23.59'),
('tugas-iot-02', 'Laporan Praktikum 1', 'Laporan hasil pembacaan sensor DHT22 ke serial monitor dan simulasi Wokwi.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-10-31 16:39:20.382', 'Modul_Praktikum_IoT_1.pdf', '2026-11-12 01:38:26.329', '2026-11-14 16:39:21.723', 'kelas-iot', 'selesai', 'Diserahkan'),
('tugas-kwu-01', 'Tugas 1 - Quiziz', 'Kerjakan kuis Kewirausahaan melalui Quizizz materi BMC (Business Model Canvas).\n\n• Kerjakan tepat waktu sebelum tenggat\n• Screenshot nilai akhir kuis dan lampirkan sebagai bukti pengerjaan tugas.', '2026-11-14 20:39:20.382', 'Panduan_Kuis_Kewirausahaan.pdf', '2026-11-12 01:38:26.241', '2026-11-14 16:39:21.639', 'kelas-kwu', 'segera', 'Hari ini, 23.59'),
('tugas-pfa-01', 'Membuat API Express.js', 'Menyelesaikan modul MVC untuk backend EduInsight', '2026-06-15 23:59:00.000', NULL, '2026-11-13 04:31:31.432', '2026-11-14 16:39:21.733', 'kelas-pfa', 'segera', '15 Juni 2026'),
('tugas-uiux-01', 'Tugas 1 - Analisa Aplikasi', 'Lakukan analisa heuristik pada aplikasi mobile EduTech pilihanmu.\n\n• Identifikasi 5 masalah usability beserta rekomendasi perbaikannya\n• Kumpulkan dalam format PDF rangkuman laporan.', '2026-11-14 21:39:20.382', 'Template_Analisa_Heuristik.pdf', '2026-11-12 01:38:26.262', '2026-11-14 16:39:21.658', 'kelas-uiux', 'segera', 'Hari ini, 23.59'),
('tugas-web-01', 'Tugas Array & Function', 'Implementasi logika manipulasi array dan closure function pada JavaScript ES6+.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-10-31 16:39:20.382', 'Panduan_Array_Function.pdf', '2026-11-12 01:38:26.317', '2026-11-14 16:39:21.714', 'kelas-web', 'selesai', 'Diserahkan');

INSERT INTO `kehadiran` (`id`, `kelasId`, `namaMatkul`, `nomor`, `topik`, `tanggal`, `status`, `createdAt`, `studentName`) VALUES
('khd-ai-1', 'kelas-ai', 'Kecerdasan Buatan', 1, 'Pengenalan AI & Sejarah', 'Senin, 28 Sep 2026', 'Hadir', '2026-11-12 04:14:41.798', 'Brooke Everly'),
('khd-ai-2', 'kelas-ai', 'Kecerdasan Buatan', 2, 'Agen Cerdas & Lingkungan', 'Senin, 5 Okt 2026', 'Hadir', '2026-11-12 04:14:41.772', 'Brooke Everly'),
('khd-ai-3', 'kelas-ai', 'Kecerdasan Buatan', 3, 'Pencarian Buta (BFS/DFS)', 'Senin, 12 Okt 2026', 'Izin', '2026-11-12 04:14:41.765', 'Brooke Everly'),
('khd-ai-4', 'kelas-ai', 'Kecerdasan Buatan', 4, 'Pencarian Heuristik & A*', 'Senin, 19 Okt 2026', 'Hadir', '2026-11-12 04:14:41.748', 'Brooke Everly'),
('khd-ai-5', 'kelas-ai', 'Kecerdasan Buatan', 5, 'Logika Proposisi', 'Senin, 26 Okt 2026', 'Hadir', '2026-11-14 16:39:21.780', 'Brooke Everly'),
('khd-ai-6', 'kelas-ai', 'Kecerdasan Buatan', 6, 'Machine Learning Dasar', 'Senin, 2 Nov 2026', 'Hadir', '2026-11-14 16:39:21.797', 'Brooke Everly'),
('khd-bd-1', 'kelas-basdat', 'Basis Data Terdistribusi', 1, 'Pengenalan Basis Data', 'Rabu, 1 Okt 2026', 'Hadir', '2026-11-12 04:14:41.732', 'Brooke Everly'),
('khd-bd-2', 'kelas-basdat', 'Basis Data Terdistribusi', 2, 'Model Data & ERD', 'Rabu, 8 Okt 2026', 'Hadir', '2026-11-12 04:14:41.714', 'Brooke Everly'),
('khd-bd-3', 'kelas-basdat', 'Basis Data Terdistribusi', 3, 'Normalisasi & Relasi', 'Rabu, 15 Okt 2026', 'Hadir', '2026-11-12 04:14:41.700', 'Brooke Everly'),
('khd-bd-4', 'kelas-basdat', 'Basis Data Terdistribusi', 4, 'Dasar SQL & Query', 'Rabu, 22 Okt 2026', 'Alpa', '2026-11-12 04:14:41.689', 'Brooke Everly'),
('khd-bd-5', 'kelas-basdat', 'Basis Data Terdistribusi', 5, 'Join & Agregasi Tabel', 'Rabu, 29 Okt 2026', 'Sakit', '2026-11-12 04:14:41.679', 'Brooke Everly'),
('khd-bd-6', 'kelas-basdat', 'Basis Data Terdistribusi', 6, 'Replikasi & Sharding', 'Rabu, 5 Nov 2026', 'Hadir', '2026-11-14 16:39:21.924', 'Brooke Everly'),
('khd-cyber-1', 'kelas-cyber', 'Keamanan Siber & Jaringan', 1, 'Pengantar Keamanan Siber', 'Kamis, 2 Okt 2026', 'Hadir', '2026-11-14 16:39:21.937', 'Brooke Everly'),
('khd-cyber-2', 'kelas-cyber', 'Keamanan Siber & Jaringan', 2, 'Kriptografi Simetris', 'Kamis, 9 Okt 2026', 'Hadir', '2026-11-14 16:39:21.947', 'Brooke Everly'),
('khd-cyber-3', 'kelas-cyber', 'Keamanan Siber & Jaringan', 3, 'Kriptografi Asimetris', 'Kamis, 16 Okt 2026', 'Hadir', '2026-11-14 16:39:21.957', 'Brooke Everly'),
('khd-cyber-4', 'kelas-cyber', 'Keamanan Siber & Jaringan', 4, 'Kerentanan Jaringan', 'Kamis, 23 Okt 2026', 'Izin', '2026-11-14 16:39:21.968', 'Brooke Everly'),
('khd-cyber-5', 'kelas-cyber', 'Keamanan Siber & Jaringan', 5, 'Firewall & IDS', 'Kamis, 30 Okt 2026', 'Hadir', '2026-11-14 16:39:21.974', 'Brooke Everly'),
('khd-cyber-6', 'kelas-cyber', 'Keamanan Siber & Jaringan', 6, 'Penetration Testing', 'Kamis, 6 Nov 2026', 'Hadir', '2026-11-14 16:39:21.987', 'Brooke Everly'),
('khd-iot-1', 'kelas-iot', 'Internet of Things (IoT)', 1, 'Pengenalan IoT & Arsitektur', 'Rabu, 1 Okt 2026', 'Hadir', '2026-11-14 16:39:23.298', 'Brooke Everly'),
('khd-iot-2', 'kelas-iot', 'Internet of Things (IoT)', 2, 'Mikrokontroler ESP32', 'Rabu, 8 Okt 2026', 'Hadir', '2026-11-14 16:39:23.317', 'Brooke Everly'),
('khd-iot-3', 'kelas-iot', 'Internet of Things (IoT)', 3, 'Sensor DHT22 & Aktuator', 'Rabu, 15 Okt 2026', 'Hadir', '2026-11-14 16:39:23.333', 'Brooke Everly'),
('khd-iot-4', 'kelas-iot', 'Internet of Things (IoT)', 4, 'Protokol MQTT', 'Rabu, 22 Okt 2026', 'Hadir', '2026-11-14 16:39:23.345', 'Brooke Everly'),
('khd-iot-5', 'kelas-iot', 'Internet of Things (IoT)', 5, 'Konektivitas WiFi & Cloud', 'Rabu, 29 Okt 2026', 'Hadir', '2026-11-14 16:39:23.355', 'Brooke Everly'),
('khd-iot-6', 'kelas-iot', 'Internet of Things (IoT)', 6, 'Dashboard Monitoring IoT', 'Rabu, 5 Nov 2026', 'Izin', '2026-11-14 16:39:23.373', 'Brooke Everly'),
('khd-kwu-1', 'kelas-kwu', 'Kewirausahaan', 1, 'Konsep Dasar Kewirausahaan', 'Senin, 29 Sep 2026', 'Hadir', '2026-11-14 16:39:22.171', 'Brooke Everly'),
('khd-kwu-2', 'kelas-kwu', 'Kewirausahaan', 2, 'Business Model Canvas', 'Senin, 6 Okt 2026', 'Hadir', '2026-11-14 16:39:22.182', 'Brooke Everly'),
('khd-kwu-3', 'kelas-kwu', 'Kewirausahaan', 3, 'Analisis Pasar & Kompetitor', 'Senin, 13 Okt 2026', 'Hadir', '2026-11-14 16:39:22.189', 'Brooke Everly'),
('khd-kwu-4', 'kelas-kwu', 'Kewirausahaan', 4, 'Perencanaan Keuangan', 'Senin, 20 Okt 2026', 'Hadir', '2026-11-14 16:39:22.200', 'Brooke Everly'),
('khd-kwu-5', 'kelas-kwu', 'Kewirausahaan', 5, 'Pitching & Presentasi', 'Senin, 27 Okt 2026', 'Hadir', '2026-11-14 16:39:22.207', 'Brooke Everly'),
('khd-kwu-6', 'kelas-kwu', 'Kewirausahaan', 6, 'Studi Kasus Startup', 'Senin, 3 Nov 2026', 'Izin', '2026-11-14 16:39:22.220', 'Brooke Everly'),
('khd-pfa-1', 'kelas-pfa', 'Pemrograman Framework', 1, 'Pengenalan Express & MVC', '2026-06-07', 'Hadir', '2026-11-13 04:31:31.607', 'Sheren'),
('khd-rpl-1', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 1, 'Pengantar RPL & SDLC', 'Jumat, 3 Okt 2026', 'Hadir', '2026-11-14 16:39:21.996', 'Brooke Everly'),
('khd-rpl-2', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 2, 'Analisis Kebutuhan', 'Jumat, 10 Okt 2026', 'Hadir', '2026-11-14 16:39:22.007', 'Brooke Everly'),
('khd-rpl-3', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 3, 'UML & Use Case Diagram', 'Jumat, 17 Okt 2026', 'Hadir', '2026-11-14 16:39:22.019', 'Brooke Everly'),
('khd-rpl-4', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 4, 'Desain Arsitektur', 'Jumat, 24 Okt 2026', 'Hadir', '2026-11-14 16:39:22.030', 'Brooke Everly'),
('khd-rpl-5', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 5, 'Testing & Validasi', 'Jumat, 31 Okt 2026', 'Sakit', '2026-11-14 16:39:22.036', 'Brooke Everly'),
('khd-rpl-6', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 6, 'Agile & Scrum', 'Jumat, 7 Nov 2026', 'Hadir', '2026-11-14 16:39:22.042', 'Brooke Everly'),
('khd-stat-1', 'kelas-stat', 'Statistika Komputasi', 1, 'Statistika Deskriptif', 'Jumat, 3 Okt 2026', 'Hadir', '2026-11-14 16:39:22.052', 'Brooke Everly'),
('khd-stat-2', 'kelas-stat', 'Statistika Komputasi', 2, 'Distribusi Probabilitas', 'Jumat, 10 Okt 2026', 'Hadir', '2026-11-14 16:39:22.062', 'Brooke Everly'),
('khd-stat-3', 'kelas-stat', 'Statistika Komputasi', 3, 'Uji Hipotesis', 'Jumat, 17 Okt 2026', 'Izin', '2026-11-14 16:39:22.069', 'Brooke Everly'),
('khd-stat-4', 'kelas-stat', 'Statistika Komputasi', 4, 'Regresi Linier', 'Jumat, 24 Okt 2026', 'Hadir', '2026-11-14 16:39:22.081', 'Brooke Everly'),
('khd-stat-5', 'kelas-stat', 'Statistika Komputasi', 5, 'ANOVA & Korelasi', 'Jumat, 31 Okt 2026', 'Hadir', '2026-11-14 16:39:22.118', 'Brooke Everly'),
('khd-stat-6', 'kelas-stat', 'Statistika Komputasi', 6, 'Analisis Cluster', 'Jumat, 7 Nov 2026', 'Hadir', '2026-11-14 16:39:22.163', 'Brooke Everly'),
('khd-uiux-1', 'kelas-uiux', 'UI/UX Design', 1, 'Prinsip Desain UI', 'Selasa, 30 Sep 2026', 'Hadir', '2026-11-14 16:39:22.237', 'Brooke Everly'),
('khd-uiux-2', 'kelas-uiux', 'UI/UX Design', 2, 'User Research & Persona', 'Selasa, 7 Okt 2026', 'Hadir', '2026-11-14 16:39:22.272', 'Brooke Everly'),
('khd-uiux-3', 'kelas-uiux', 'UI/UX Design', 3, 'Wireframing & Prototyping', 'Selasa, 14 Okt 2026', 'Hadir', '2026-11-14 16:39:22.503', 'Brooke Everly'),
('khd-uiux-4', 'kelas-uiux', 'UI/UX Design', 4, 'Heuristic Evaluation', 'Selasa, 21 Okt 2026', 'Hadir', '2026-11-14 16:39:22.606', 'Brooke Everly'),
('khd-uiux-5', 'kelas-uiux', 'UI/UX Design', 5, 'Desain Figma High-Fi', 'Selasa, 28 Okt 2026', 'Alpa', '2026-11-14 16:39:22.994', 'Brooke Everly'),
('khd-uiux-6', 'kelas-uiux', 'UI/UX Design', 6, 'Usability Testing', 'Selasa, 4 Nov 2026', 'Hadir', '2026-11-14 16:39:23.280', 'Brooke Everly'),
('khd-web-1', 'kelas-web', 'Pemrograman Web', 1, 'Dasar HTML & CSS', 'Selasa, 29 Sep 2026', 'Alpa', '2026-11-12 04:14:42.367', 'Brooke Everly'),
('khd-web-2', 'kelas-web', 'Pemrograman Web', 2, 'JavaScript ES6+ & DOM', 'Selasa, 6 Okt 2026', 'Hadir', '2026-11-12 04:14:42.232', 'Brooke Everly'),
('khd-web-3', 'kelas-web', 'Pemrograman Web', 3, 'React: Komponen & Props', 'Selasa, 13 Okt 2026', 'Hadir', '2026-11-12 04:14:41.917', 'Brooke Everly'),
('khd-web-4', 'kelas-web', 'Pemrograman Web', 4, 'React: Routing & State', 'Selasa, 20 Okt 2026', 'Hadir', '2026-11-14 16:39:21.848', 'Brooke Everly'),
('khd-web-5', 'kelas-web', 'Pemrograman Web', 5, 'REST API & Fetch', 'Selasa, 27 Okt 2026', 'Hadir', '2026-11-14 16:39:21.855', 'Brooke Everly'),
('khd-web-6', 'kelas-web', 'Pemrograman Web', 6, 'Deployment & Build', 'Selasa, 3 Nov 2026', 'Sakit', '2026-11-14 16:39:21.868', 'Brooke Everly');

INSERT INTO `penilaian` (`id`, `kelasId`, `studentName`, `taskName`, `score`, `createdAt`) VALUES
('penilaian-01', 'kelas-pfa', 'Sheren', 'Pemrograman Framework - Tugas 1', 90, '2026-11-13 04:31:31.766'),
('penilaian-02', 'kelas-ai', 'Brooke Everly', 'Tugas Pengenalan AI', 95, '2026-11-13 04:31:31.776'),
('penilaian-03', 'kelas-web', 'Brooke Everly', 'Tugas Array & Function', 92, '2026-11-13 04:31:31.792');

INSERT INTO `evaluasi_mahasiswa` (`id`, `dateText`, `lecturerName`, `messages`, `lecturerNote`, `createdAt`, `catatanDosen`, `indikatorRisiko`, `insightPerforma`, `kelasId`, `nilaiAkhir`, `studentName`, `trenKehadiran`) VALUES
('eval-01', 'Senin, 24 Januari 2026', 'Dr. Ahmad Sahroni, M.Kom.', '[{\"text\":\"Kehadiranmu mengalami penurunan dalam beberapa pertemuan terakhir. Usahakan hadir pada pertemuan berikutnya agar tetap memenuhi batas minimum kehadiran.\",\"isPositive\":false},{\"text\":\"Nilai kuis terakhir masih rendah. Coba pelajari kembali materi yang berkaitan dan kerjakan latihan tambahan.\",\"isPositive\":false}]', 'Mohon temui saya di ruang dosen pada hari Rabu jam 10.00 untuk membahas remedial kuis dan perbaikan presensi sebelum UTS.', '2026-11-12 04:14:42.383', 'Mohon temui saya di ruang dosen pada hari Rabu jam 10.00 untuk membahas remedial kuis dan perbaikan presensi sebelum UTS.', 'Sedang', 'Nilai tugas sangat konsisten, namun keaktifan kuis perlu ditingkatkan.', 'kelas-ai', 85, 'Brooke Everly', '88%'),
('eval-02', 'Minggu, 23 Januari 2026', 'Ir. Tri Astuti, M.T.', '[{\"text\":\"Kehadiranmu mulai membaik dibanding minggu sebelumnya. Pertahankan konsistensi kehadiran.\",\"isPositive\":true},{\"text\":\"Nilai kuis terakhir meningkat. Pertahankan pola belajar dan fokus pada materi yang masih belum dikuasai.\",\"isPositive\":true},{\"text\":\"Materi yang perlu dipelajari kembali: array dan function.\",\"isPositive\":false}]', NULL, '2026-11-12 04:14:42.403', 'Bagus, pertahankan!', 'Rendah', 'Performa sangat baik pada tugas routing dan komponen.', 'kelas-web', 90, 'Brooke Everly', '95%'),
('eval-03', 'Sabtu, 22 Januari 2026', 'Prof. Bambang Hariyanto, Ph.D.', '[{\"text\":\"Kehadiran telah memenuhi batas minimum.\",\"isPositive\":true},{\"text\":\"Nilai tugas sudah cukup baik, tetapi hasil kuis masih belum konsisten. Perhatikan kembali materi yang mendapat nilai rendah.\",\"isPositive\":false}]', NULL, '2026-11-12 04:14:42.417', NULL, 'Rendah', 'Hasil tugas lab keamanan baik.', 'kelas-cyber', 82.5, 'Brooke Everly', '90%'),
('eval-web-01', 'Senin, 08 November 2026', 'Dr. Ahmad Sahroni, M.Kom.', '[{\"text\":\"Menunjukkan pemahaman yang sangat baik pada modul praktikum backend dan konsisten mengumpulkan tugas tepat waktu.\",\"isPositive\":true}]', 'Pertahankan performa yang baik, tingkatkan keaktifan di kelas.', '2026-11-13 04:31:31.752', 'Pertahankan performa yang baik, tingkatkan keaktifan di kelas.', 'Rendah', 'Menunjukkan pemahaman yang sangat baik pada modul praktikum backend dan konsisten mengumpulkan tugas tepat waktu.', 'kelas-pfa', 88.5, 'Sheren Annabelle', '95%');

INSERT INTO `password_setting` (`id`, `dosenId`, `passwordHash`, `notifikasiEmail`, `notifikasiSistem`, `createdAt`, `updatedAt`) VALUES
(1, 'user-dsn-001', '$2a$10$zDfpzNBVoEDZf9IFfT5lYO5ixqxZiEpnzIs4aDUkrfS7BGTP4wlOC', 1, 1, '2026-11-13 04:31:31.808', '2026-11-14 16:39:23.484');

INSERT INTO `token_blacklist` (`id`, `token`, `createdAt`) VALUES
('be856511-ffad-422d-820e-724a50d54d4c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItbWhzLWJyb29rZSIsImVtYWlsIjoiYnJvb2tldmVybHkxN0BlZHVpbnNpZ2h0LnN0dWRlbnQuYWMuaWQiLCJyb2xlIjoibWFoYXNpc3dhIiwibmFtZSI6IkJyb29rZSBFdmVybHkiLCJpYXQiOjE3OTQ0NDc1MzMsImV4cCI6MTc5NDUzMzkzM30.o_7LPVcBO6ZbPuGiOXmt9HYy9m33XeaaziH89NuXf3c', '2026-11-12 01:38:53.290');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
