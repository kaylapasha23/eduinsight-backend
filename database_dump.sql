-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2026 at 07:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduinsight_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `evaluasi_mahasiswa`
--

CREATE TABLE `evaluasi_mahasiswa` (
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
  `trenKehadiran` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evaluasi_mahasiswa`
--

INSERT INTO `evaluasi_mahasiswa` (`id`, `dateText`, `lecturerName`, `messages`, `lecturerNote`, `createdAt`, `catatanDosen`, `indikatorRisiko`, `insightPerforma`, `kelasId`, `nilaiAkhir`, `studentName`, `trenKehadiran`) VALUES
('eval-user-mhs-brooke-kelas-basdat', 'Senin, 23 November 2026', 'Dr. Ahmad Sahroni, M.Kom.', '[{\"text\":\"Mahasiswa Brooke Everly menunjukkan performa akademik yang sangat baik dan konsisten pada mata kuliah Basis Data Terdistribusi. Tingkat kehadiran mencapai 100% (1 dari 1 pertemuan) dengan rata-rata nilai 90. Pemahaman konsep dan partisipasi penugasan dinilai sangat memuaskan.\",\"isPositive\":true},{\"text\":\"Pertahankan ritme belajar dan keaktifan diskusi di kelas. Disarankan untuk mengeksplorasi studi kasus lanjutan atau proyek pengayaan mandiri untuk memaksimalkan potensi akademik. Catatan tindak lanjut dosen: \\\"hai\\\".\",\"isPositive\":false}]', 'hai', '2026-11-23 16:23:08.336', 'hai', 'Aman', 'Mahasiswa Brooke Everly menunjukkan performa akademik yang sangat baik dan konsisten pada mata kuliah Basis Data Terdistribusi. Tingkat kehadiran mencapai 100% (1 dari 1 pertemuan) dengan rata-rata nilai 90. Pemahaman konsep dan partisipasi penugasan dinilai sangat memuaskan.', 'kelas-basdat', 90, 'Brooke Everly', '100%');

-- --------------------------------------------------------

--
-- Table structure for table `kehadiran`
--

CREATE TABLE `kehadiran` (
  `id` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `namaMatkul` varchar(191) DEFAULT NULL,
  `nomor` int(11) NOT NULL DEFAULT 1,
  `topik` varchar(191) NOT NULL,
  `tanggal` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Hadir',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `studentName` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kehadiran`
--

INSERT INTO `kehadiran` (`id`, `kelasId`, `namaMatkul`, `nomor`, `topik`, `tanggal`, `status`, `createdAt`, `studentName`) VALUES
('khd-1795441899602-331', 'kelas-ai', 'Kecerdasan Buatan', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:51:39.602', 'Sheren Annabelle'),
('khd-1795441899614-71', 'kelas-ai', 'Kecerdasan Buatan', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:51:39.614', 'Chris Redfield'),
('khd-1795441899633-221', 'kelas-ai', 'Kecerdasan Buatan', 1, 'Pertemuan 1', '2026-11-23', 'Izin', '2026-11-23 13:51:39.633', 'Brooke Everly'),
('khd-1795441899668-344', 'kelas-ai', 'Kecerdasan Buatan', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:51:39.668', 'Nareswari Ayu'),
('khd-1795441921548-846', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:52:01.548', 'Brooke Everly'),
('khd-1795441921550-434', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:52:01.550', 'Chris Redfield'),
('khd-1795441921551-667', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:52:01.551', 'Sheren Annabelle'),
('khd-1795441921553-344', 'kelas-rpl', 'Rekayasa Perangkat Lunak', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 13:52:01.553', 'Nareswari Ayu'),
('khd-1795444221526-449', 'kelas-basdat', 'Basis Data Terdistribusi', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 14:30:21.526', 'Nareswari Ayu'),
('khd-1795444221527-429', 'kelas-basdat', 'Basis Data Terdistribusi', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 14:30:21.528', 'Brooke Everly'),
('khd-1795444221528-900', 'kelas-basdat', 'Basis Data Terdistribusi', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 14:30:21.528', 'Chris Redfield'),
('khd-1795444221529-436', 'kelas-basdat', 'Basis Data Terdistribusi', 1, 'Pertemuan 1', '2026-11-23', 'Hadir', '2026-11-23 14:30:21.529', 'Sheren Annabelle');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
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
  `dosenId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `kodeGabung`, `ruangan`, `hari`, `jamMulai`, `jamSelesai`, `semester`, `tahunAjaran`, `status`, `createdAt`, `updatedAt`, `mataKuliahId`, `dosenId`) VALUES
('kelas-ai', 'VTI51366', 'Lantai 7, Ruangan 701', 'Senin', '14.00', '15.20', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:25.912', '2026-11-23 16:08:03.660', 'mk-ai', 'user-dsn-001'),
('kelas-basdat', 'VTI51250', 'Lantai 6, Ruang 606', 'Rabu', '12.00', '14.00', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.065', '2026-11-23 16:08:03.660', 'mk-basdat', 'user-dsn-001'),
('kelas-cyber', 'VTI51322', 'Lab Keamanan, Lantai 4', 'Kamis', '10.00', '12.00', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.091', '2026-11-23 16:08:03.660', 'mk-cyber', 'user-dsn-001'),
('kelas-iot', 'VTI51340', 'Lab Hardware & IoT, Lantai 5', 'Rabu', '15.00', '17.30', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.227', '2026-11-23 16:08:03.660', 'mk-iot', 'user-dsn-001'),
('kelas-kwu', 'VTI51310', 'Lantai 4, Ruang 401', 'Senin', '08.00', '09.40', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.174', '2026-11-23 16:08:03.660', 'mk-kwu', 'user-dsn-001'),
('kelas-pfa', 'PFA3', 'Kelas A', 'Senin', '10.20', '13.00', 1, '2025/2026 Genap', 'Aktif', '2026-11-13 04:31:31.242', '2026-11-23 16:08:03.660', 'mk-pfa', 'user-dsn-001'),
('kelas-rpl', 'VTI51375', 'Lantai 3, Ruang 304', 'Jumat', '08.00', '10.30', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.113', '2026-11-23 16:08:03.660', 'mk-rpl', 'user-dsn-001'),
('kelas-stat', 'VTI51389', 'Lantai 2, Ruang 201', 'Jumat', '13.30', '15.00', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.148', '2026-11-23 16:08:03.660', 'mk-stat', 'user-dsn-001'),
('kelas-uiux', 'VTI51315', 'Lab Multimedia, Lantai 3', 'Selasa', '13.00', '15.30', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:26.194', '2026-11-23 16:08:03.660', 'mk-uiux', 'user-dsn-001'),
('kelas-web', 'VTI51329', 'Lantai 5, Ruang 502', 'Selasa', '08.00', '10.00', 1, '2025/2026 Genap', 'Aktif', '2026-11-12 01:38:25.960', '2026-11-23 16:08:03.660', 'mk-web', 'user-dsn-001');

-- --------------------------------------------------------

--
-- Table structure for table `mata_kuliah`
--

CREATE TABLE `mata_kuliah` (
  `id` varchar(191) NOT NULL,
  `kode` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `sks` int(11) NOT NULL DEFAULT 3,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mata_kuliah`
--

INSERT INTO `mata_kuliah` (`id`, `kode`, `nama`, `sks`, `createdAt`, `updatedAt`) VALUES
('mk-ai', 'VTI51366', 'Kecerdasan Buatan', 3, '2026-11-12 01:38:25.774', '2026-11-23 16:07:24.774'),
('mk-basdat', 'VTI51250', 'Basis Data Terdistribusi', 4, '2026-11-12 01:38:25.799', '2026-11-23 16:07:24.806'),
('mk-cyber', 'VTI51322', 'Keamanan Siber & Jaringan', 4, '2026-11-12 01:38:25.814', '2026-11-23 16:07:24.816'),
('mk-iot', 'VTI51340', 'Internet of Things (IoT)', 3, '2026-11-12 01:38:25.888', '2026-11-23 16:07:24.858'),
('mk-kwu', 'VTI51310', 'Kewirausahaan', 2, '2026-11-12 01:38:25.857', '2026-11-23 16:07:24.840'),
('mk-pfa', 'PFA3', 'Pemrograman Framework', 3, '2026-11-13 04:31:31.023', '2026-11-23 16:07:24.865'),
('mk-rpl', 'VTI51375', 'Rekayasa Perangkat Lunak', 4, '2026-11-12 01:38:25.824', '2026-11-23 16:07:24.823'),
('mk-stat', 'VTI51389', 'Statistika Komputasi', 3, '2026-11-12 01:38:25.840', '2026-11-23 16:07:24.830'),
('mk-uiux', 'VTI51315', 'UI/UX Design', 3, '2026-11-12 01:38:25.875', '2026-11-23 16:07:24.848'),
('mk-web', 'VTI51329', 'Pemrograman Web', 4, '2026-11-12 01:38:25.790', '2026-11-23 16:07:24.795');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text DEFAULT NULL,
  `synced` tinyint(1) NOT NULL DEFAULT 1,
  `updatedAt` bigint(20) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'tugas',
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `targetId` varchar(191) DEFAULT NULL,
  `targetType` varchar(191) DEFAULT NULL,
  `payload` text DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `type`, `title`, `body`, `targetId`, `targetType`, `payload`, `isRead`, `createdAt`) VALUES
('26bb0eb4-6feb-4394-9cbb-553537b54981', 'user-mhs-brooke', 'kehadiran', 'Kehadiran Diperbarui: Basis Data Terdistribusi', 'Status kehadiran Brooke Everly pada Pertemuan 1 tercatat: Hadir.', 'khd-1795444221527-429', 'kehadiran', '{\"matkul\":\"Basis Data Terdistribusi\",\"status\":\"Hadir\",\"studentName\":\"Brooke Everly\",\"nomor\":1}', 1, '2026-11-23 14:30:21.662'),
('3d98da30-cf7e-4f1d-8ecd-275301753803', 'user-mhs-brooke', 'penilaian', 'Nilai Baru: Penilaian Akhir', 'Dosen telah merilis nilai untuk Penilaian Akhir (Keamanan Siber & Jaringan): 87', 'penilaian-1795444007584-813', 'penilaian', '{\"studentName\":\"Brooke Everly\",\"taskName\":\"Penilaian Akhir\",\"score\":87,\"matkul\":\"Keamanan Siber & Jaringan\"}', 1, '2026-11-23 14:26:47.686'),
('cc6f44cb-b586-4e59-bf58-64108c450619', 'user-mhs-brooke', 'evaluasi', 'Evaluasi AI Akademik Diperbarui', 'Dosen memberikan catatan: \"hai\"', 'eval-user-mhs-brooke-kelas-basdat', 'evaluasi', '{\"evalId\":\"eval-user-mhs-brooke-kelas-basdat\",\"studentName\":\"Brooke Everly\",\"kelasId\":\"kelas-basdat\"}', 1, '2026-11-23 16:23:08.440');

-- --------------------------------------------------------

--
-- Table structure for table `password_setting`
--

CREATE TABLE `password_setting` (
  `id` int(11) NOT NULL,
  `dosenId` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `notifikasiEmail` tinyint(1) NOT NULL DEFAULT 1,
  `notifikasiSistem` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_setting`
--

INSERT INTO `password_setting` (`id`, `dosenId`, `passwordHash`, `notifikasiEmail`, `notifikasiSistem`, `createdAt`, `updatedAt`) VALUES
(1, 'user-dsn-001', '$2a$10$zDfpzNBVoEDZf9IFfT5lYO5ixqxZiEpnzIs4aDUkrfS7BGTP4wlOC', 1, 1, '2026-11-13 04:31:31.808', '2026-11-23 16:07:25.097');

-- --------------------------------------------------------

--
-- Table structure for table `pengumpulan_tugas`
--

CREATE TABLE `pengumpulan_tugas` (
  `id` varchar(191) NOT NULL,
  `taskId` varchar(191) NOT NULL,
  `studentId` varchar(191) NOT NULL,
  `fileName` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Diserahkan',
  `submittedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `fileUrl` varchar(191) DEFAULT NULL,
  `linkRepo` varchar(191) DEFAULT NULL,
  `nilai` int(11) DEFAULT NULL,
  `statusPenilaian` varchar(191) NOT NULL DEFAULT 'Belum Dinilai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengumpulan_tugas`
--

INSERT INTO `pengumpulan_tugas` (`id`, `taskId`, `studentId`, `fileName`, `status`, `submittedAt`, `fileUrl`, `linkRepo`, `nilai`, `statusPenilaian`) VALUES
('sub-tugas-pfa-01-user-mhs-brooke', 'tugas-pfa-01', 'user-mhs-brooke', 'Laporan_Tugas_Brooke.pdf', 'Diserahkan', '2026-11-22 03:38:41.339', '/uploads/Laporan_Tugas_Brooke.pdf', 'https://github.com/brooke-everly/tugas-pemrograman', 95, 'Sudah Dinilai'),
('sub-tugas-pfa-01-user-mhs-chris', 'tugas-pfa-01', 'user-mhs-chris', 'Dokumentasi_Chris_R.pdf', 'Terlambat', '2026-11-21 03:38:41.594', '/uploads/Dokumentasi_Chris_R.pdf', 'https://github.com/chris-red/algorithm-study', 85, 'Sudah Dinilai'),
('sub-tugas-pfa-01-user-mhs-nareswari', 'tugas-pfa-01', 'user-mhs-nareswari', 'Tugas_Nareswari_Ayu.pdf', 'Diserahkan', '2026-11-23 03:38:41.642', '/uploads/Tugas_Nareswari_Ayu.pdf', 'https://github.com/nareswari-ayu/eduinsight-tasks', 90, 'Sudah Dinilai'),
('sub-tugas-pfa-01-user-mhs-sheren', 'tugas-pfa-01', 'user-mhs-sheren', 'Tugas_Sheren_Annabelle.pdf', 'Diserahkan', '2026-11-23 03:38:41.463', '/uploads/Tugas_Sheren_Annabelle.pdf', 'https://github.com/sheren-ann/tugas-ai-expert', NULL, 'Belum Dinilai'),
('sub-tugas-ai-01-user-mhs-brooke', 'tugas-ai-01', 'user-mhs-brooke', 'Laporan_Proyek_Klasifikasi_Brooke.pdf', 'Diserahkan', '2026-11-22 03:38:41.339', '/uploads/tugas/Laporan_Proyek_Klasifikasi_Brooke.pdf', 'https://github.com/brooke-everly/klasifikasi', 95, 'Sudah Dinilai'),
('sub-tugas-ai-01-user-mhs-chris', 'tugas-ai-01', 'user-mhs-chris', 'Dokumentasi_AI_Chris.pdf', 'Terlambat', '2026-11-21 03:38:41.594', '/uploads/tugas/Dokumentasi_AI_Chris.pdf', 'https://github.com/chris-red/klasifikasi', 85, 'Sudah Dinilai'),
('sub-tugas-ai-01-user-mhs-nareswari', 'tugas-ai-01', 'user-mhs-nareswari', 'Laporan_Klasifikasi_Nareswari.pdf', 'Diserahkan', '2026-11-23 03:38:41.642', '/uploads/tugas/Laporan_Klasifikasi_Nareswari.pdf', 'https://github.com/nareswari-ayu/klasifikasi', 90, 'Sudah Dinilai'),
('sub-tugas-ai-01-user-mhs-sheren', 'tugas-ai-01', 'user-mhs-sheren', 'Laporan_Proyek_Klasifikasi.pdf', 'Diserahkan', '2026-11-23 03:38:41.463', '/uploads/tugas/Laporan_Proyek_Klasifikasi.pdf', 'https://github.com/sheren-ann/klasifikasi', NULL, 'Belum Dinilai');

-- --------------------------------------------------------

--
-- Table structure for table `penilaian`
--

CREATE TABLE `penilaian` (
  `id` varchar(191) NOT NULL,
  `kelasId` varchar(191) NOT NULL,
  `studentName` varchar(191) NOT NULL,
  `taskName` varchar(191) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penilaian`
--

INSERT INTO `penilaian` (`id`, `kelasId`, `studentName`, `taskName`, `score`, `createdAt`) VALUES
('penilaian-1795402351024-830', 'kelas-ai', 'Sheren Annabelle', 'Penilaian Akhir', 89, '2026-11-23 03:37:18.254'),
('penilaian-1795402351030-278', 'kelas-ai', 'Brooke Everly', 'Penilaian Akhir', 92, '2026-11-23 03:37:18.256'),
('penilaian-1795402351045-20', 'kelas-ai', 'Chris Redfield', 'Penilaian Akhir', 84, '2026-11-23 03:37:18.256'),
('penilaian-1795402351045-406', 'kelas-ai', 'Nareswari Ayu', 'Penilaian Akhir', 89, '2026-11-23 03:37:18.257'),
('penilaian-1795444007574-660', 'kelas-cyber', 'Sheren Annabelle', 'Penilaian Akhir', 84, '2026-11-23 14:26:47.576'),
('penilaian-1795444007578-780', 'kelas-cyber', 'Chris Redfield', 'Penilaian Akhir', 81, '2026-11-23 14:26:47.578'),
('penilaian-1795444007582-655', 'kelas-cyber', 'Nareswari Ayu', 'Penilaian Akhir', 89, '2026-11-23 14:26:47.582'),
('penilaian-1795444007584-813', 'kelas-cyber', 'Brooke Everly', 'Penilaian Akhir', 87, '2026-11-23 14:26:47.584');

-- --------------------------------------------------------

--
-- Table structure for table `token_blacklist`
--

CREATE TABLE `token_blacklist` (
  `id` varchar(191) NOT NULL,
  `token` varchar(500) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `token_blacklist`
--

INSERT INTO `token_blacklist` (`id`, `token`, `createdAt`) VALUES
('be856511-ffad-422d-820e-724a50d54d4c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItbWhzLWJyb29rZSIsImVtYWlsIjoiYnJvb2tldmVybHkxN0BlZHVpbnNpZ2h0LnN0dWRlbnQuYWMuaWQiLCJyb2xlIjoibWFoYXNpc3dhIiwibmFtZSI6IkJyb29rZSBFdmVybHkiLCJpYXQiOjE3OTQ0NDc1MzMsImV4cCI6MTc5NDUzMzkzM30.o_7LPVcBO6ZbPuGiOXmt9HYy9m33XeaaziH89NuXf3c', '2026-11-12 01:38:53.290'),
('dfe01915-1126-4e4b-90ae-42b0267d5eaf', '', '2026-11-18 17:42:38.096');

-- --------------------------------------------------------

--
-- Table structure for table `tugas`
--

CREATE TABLE `tugas` (
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
  `lampiranNama` varchar(191) DEFAULT NULL,
  `lampiranUrl` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tugas`
--

INSERT INTO `tugas` (`id`, `judul`, `deskripsi`, `deadline`, `lampiran`, `createdAt`, `updatedAt`, `kelasId`, `category`, `deadlineText`, `lampiranNama`, `lampiranUrl`) VALUES
('tugas-ai-01', 'Tugas Pengenalan AI', 'Rangkuman pengantar AI, perbedaan antara machine learning dan deep learning, serta implementasi agen cerdas.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-11-16 16:07:23.383', 'Modul_Pengenalan_AI.pdf', '2026-11-23 02:48:24.447', '2026-11-23 16:07:25.045', 'kelas-ai', 'selesai', 'Diserahkan', NULL, NULL),
('tugas-ai-02', 'AI Klasik dan Modern', 'Studi kasus perbandingan algoritma pencarian BFS/DFS dan A* Search pada implementasi maze routing.', '2026-11-30 16:07:23.383', NULL, '2026-11-23 02:48:24.452', '2026-11-23 16:07:25.056', 'kelas-ai', 'segera', 'Minggu depan', NULL, NULL),
('tugas-basdat-01', 'Latihan SQL Dasar', 'Latihan query DDL & DML, join relasi tabel, dan agregasi data pada MySQL / PostgreSQL.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-11-16 16:07:23.383', 'Soal_Latihan_SQL.pdf', '2026-11-23 02:48:24.461', '2026-11-23 16:07:25.063', 'kelas-basdat', 'selesai', 'Diserahkan', NULL, NULL),
('tugas-iot-01', 'Pertemuan Pertama', 'Buat rangkuman singkat mengenai komponen mikrokontroler ESP32 dan protokol MQTT.\n\n• Format: PDF (maksimal 2 halaman)\n• Unggah dokumen hasil resume pada bagian Tugas Saya di bawah.', '2026-11-25 16:07:23.383', NULL, '2026-11-23 02:48:24.431', '2026-11-23 16:07:25.038', 'kelas-iot', 'segera', 'Rabu, 23.59', NULL, NULL),
('tugas-iot-02', 'Laporan Praktikum 1', 'Laporan hasil pembacaan sensor DHT22 ke serial monitor dan simulasi Wokwi.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-11-09 16:07:23.383', 'Modul_Praktikum_IoT_1.pdf', '2026-11-23 02:48:24.480', '2026-11-23 16:07:25.079', 'kelas-iot', 'selesai', 'Diserahkan', NULL, NULL),
('tugas-kwu-01', 'Tugas 1 - Quiziz', 'Kerjakan kuis Kewirausahaan melalui Quizizz materi BMC (Business Model Canvas).\n\n• Kerjakan tepat waktu sebelum tenggat\n• Screenshot nilai akhir kuis dan lampirkan sebagai bukti pengerjaan tugas.', '2026-11-23 20:07:23.383', 'Panduan_Kuis_Kewirausahaan.pdf', '2026-11-23 02:48:24.400', '2026-11-23 16:07:25.016', 'kelas-kwu', 'segera', 'Hari ini, 23.59', NULL, NULL),
('tugas-pfa-01', 'Membuat API Express.js', 'Menyelesaikan modul MVC untuk backend EduInsight', '2026-06-15 23:59:00.000', NULL, '2026-11-23 02:48:24.493', '2026-11-23 16:07:25.090', 'kelas-pfa', 'segera', '15 Juni 2026', NULL, NULL),
('tugas-uiux-01', 'Tugas 1 - Analisa Aplikasi', 'Lakukan analisa heuristik pada aplikasi mobile EduTech pilihanmu.\n\n• Identifikasi 5 masalah usability beserta rekomendasi perbaikannya\n• Kumpulkan dalam format PDF rangkuman laporan.', '2026-11-23 21:07:23.383', 'Template_Analisa_Heuristik.pdf', '2026-11-23 02:48:24.424', '2026-11-23 16:07:25.028', 'kelas-uiux', 'segera', 'Hari ini, 23.59', NULL, NULL),
('tugas-web-01', 'Tugas Array & Function', 'Implementasi logika manipulasi array dan closure function pada JavaScript ES6+.\n\nStatus: Sudah diserahkan tepat waktu.', '2026-11-09 16:07:23.383', 'Panduan_Array_Function.pdf', '2026-11-23 02:48:24.471', '2026-11-23 16:07:25.072', 'kelas-web', 'selesai', 'Diserahkan', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
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
  `fcmToken` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `alternativeEmails`, `password`, `role`, `nim`, `nip`, `angkatan`, `fakultas`, `prodi`, `mataKuliah`, `createdAt`, `updatedAt`, `semester`, `fcmToken`) VALUES
('user-adm-001', 'Administrator Akademik', 'admin@eduinsight.ac.id', NULL, '$2a$10$DLUQAPLnFkL.DeWPBBR9D.VGQcssyYvf1TdNvaYf7rex0T6MGYrHW', 'admin', NULL, NULL, '2023', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-14 15:28:13.936', '2026-11-23 16:07:24.760', 4, NULL),
('user-dsn-001', 'Dr. Ahmad Sahroni, M.Kom.', 'dosen@eduinsight.ac.id', '[\"sahroni@eduinsight.ac.id\"]', '$2a$10$zDfpzNBVoEDZf9IFfT5lYO5ixqxZiEpnzIs4aDUkrfS7BGTP4wlOC', 'dosen', NULL, '198503152010121002', '2023', 'Ilmu Komputer', 'Teknik Informatika', '[\"Kecerdasan Buatan\",\"Pemrograman Web\",\"Basis Data Terdistribusi\",\"Keamanan Siber & Jaringan\",\"Rekayasa Perangkat Lunak\",\"Statistika Komputasi\",\"Kewirausahaan\",\"UI/UX Design\",\"Internet of Things (IoT)\",\"Pemrograman Framework\"]', '2026-10-14 15:28:13.802', '2026-11-23 16:07:24.747', 4, NULL),
('user-mhs-brooke', 'Brooke Everly', 'brookeverly17@eduinsight.student.ac.id', NULL, '$2a$10$w9/rXdnyEjUWgO1lEMQE8OBmrfvsWQqde3s1iTSRBO2yolck1B7UK', 'mahasiswa', '254076512225017', NULL, '2026', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-24 16:18:50.615', '2026-11-23 16:07:24.626', 1, NULL),
('user-mhs-chris', 'Chris Redfield', 'redchris@eduinsight.student.ac.id', NULL, '$2a$10$qUGll7GkKebwL849UBKN5eW6dBX5/NWsKqw2K0S02.8do8U.qY4yG', 'mahasiswa', '254076512225018', NULL, '2026', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-25 00:51:53.109', '2026-11-23 16:07:24.710', 1, NULL),
('user-mhs-nareswari', 'Nareswari Ayu', 'nareswari@eduinsight.student.ac.id', NULL, '$2a$10$CEAZ6fvp4CiYsTpiTXLQ/OYM3tRBURVNo.h5HKMAHNVGhq6u9D7lK', 'mahasiswa', '220101004', NULL, '2026', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-26 08:00:00.000', '2026-11-23 16:07:24.739', 1, NULL),
('user-mhs-sheren', 'Sheren Annabelle', 'sheren@eduinsight.student.ac.id', NULL, '$2a$10$9BjwTaAGEO8oUoj0iXTZDObyhHYNVR20cBz.Q5JajPM3DNjyWDO/O', 'mahasiswa', '220101001', NULL, '2026', 'Ilmu Komputer', 'Teknik Informatika', NULL, '2026-10-14 15:28:13.659', '2026-11-23 16:07:24.722', 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `evaluasi_mahasiswa`
--
ALTER TABLE `evaluasi_mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluasi_mahasiswa_kelasId_fkey` (`kelasId`);

--
-- Indexes for table `kehadiran`
--
ALTER TABLE `kehadiran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kehadiran_kelasId_fkey` (`kelasId`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kelas_kodeGabung_key` (`kodeGabung`),
  ADD KEY `kelas_mataKuliahId_fkey` (`mataKuliahId`),
  ADD KEY `kelas_dosenId_fkey` (`dosenId`);

--
-- Indexes for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mata_kuliah_kode_key` (`kode`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notes_userId_fkey` (`userId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_setting`
--
ALTER TABLE `password_setting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_setting_dosenId_fkey` (`dosenId`);

--
-- Indexes for table `pengumpulan_tugas`
--
ALTER TABLE `pengumpulan_tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengumpulan_tugas_taskId_fkey` (`taskId`),
  ADD KEY `pengumpulan_tugas_studentId_fkey` (`studentId`);

--
-- Indexes for table `penilaian`
--
ALTER TABLE `penilaian`
  ADD PRIMARY KEY (`id`),
  ADD KEY `penilaian_kelasId_fkey` (`kelasId`);

--
-- Indexes for table `token_blacklist`
--
ALTER TABLE `token_blacklist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_blacklist_token_key` (`token`);

--
-- Indexes for table `tugas`
--
ALTER TABLE `tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tugas_kelasId_fkey` (`kelasId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_nip_key` (`nip`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_setting`
--
ALTER TABLE `password_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `evaluasi_mahasiswa`
--
ALTER TABLE `evaluasi_mahasiswa`
  ADD CONSTRAINT `evaluasi_mahasiswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kehadiran`
--
ALTER TABLE `kehadiran`
  ADD CONSTRAINT `kehadiran_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kelas`
--
ALTER TABLE `kelas`
  ADD CONSTRAINT `kelas_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `kelas_mataKuliahId_fkey` FOREIGN KEY (`mataKuliahId`) REFERENCES `mata_kuliah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `password_setting`
--
ALTER TABLE `password_setting`
  ADD CONSTRAINT `password_setting_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pengumpulan_tugas`
--
ALTER TABLE `pengumpulan_tugas`
  ADD CONSTRAINT `pengumpulan_tugas_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pengumpulan_tugas_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tugas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `penilaian`
--
ALTER TABLE `penilaian`
  ADD CONSTRAINT `penilaian_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tugas`
--
ALTER TABLE `tugas`
  ADD CONSTRAINT `tugas_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
