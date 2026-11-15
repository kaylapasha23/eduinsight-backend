const { prisma } = require('../data/database');

// Map jadwal per mata kuliah
const jadwalMap = {
  'Kecerdasan Buatan': '14.00-15.20 Lantai 7, Ruangan 701',
  'Pemrograman Web': '08.00-10.00 Lantai 5, Ruang 502',
  'Basis Data Terdistribusi': '12.00-14.00 Lantai 6, Ruang 606',
  'Keamanan Siber & Jaringan': '10.00-12.00 Lab Keamanan, Lantai 4',
  'Rekayasa Perangkat Lunak': '08.00-10.30 Lantai 3, Ruang 304',
  'Statistika Komputasi': '13.30-15.00 Lantai 2, Ruang 201',
  'Kewirausahaan': '08.00-09.40 Lantai 4, Ruang 401',
  'UI/UX Design': '13.00-15.30 Lab Multimedia, Lantai 3',
  'Internet of Things (IoT)': '15.00-17.30 Lab Hardware & IoT, Lantai 5',
};

// GET /api/kehadiran
const getKehadiran = async (req, res) => {
  try {
    const list = await prisma.kehadiran.findMany({
      orderBy: { nomor: 'desc' },
    });

    // Kelompokkan data per mata kuliah sesuai struktur yang diharapkan Frontend
    const grouped = {};
    for (const item of list) {
      const mkName = item.namaMatkul || 'Mata Kuliah';
      if (!grouped[mkName]) {
        grouped[mkName] = {
          nama: mkName,
          jadwal: jadwalMap[mkName] || '14.00-15.20 Ruang Kuliah',
          riwayat: [],
        };
      }
      grouped[mkName].riwayat.push({
        nomor: item.nomor,
        topik: item.topik,
        tanggal: item.tanggal,
        status: item.status,
      });
    }

    const result = Object.values(grouped);

    return res.status(200).json({
      success: true,
      data: result,
      total_matkul: result.length,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[GET KEHADIRAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kehadiran',
      error: err.message,
    });
  }
};

// POST /api/kehadiran
const createKehadiran = async (req, res) => {
  try {
    const { matkul_name, nomor, topik, tanggal, status, class_id } = req.body;

    let targetKelasId = class_id;
    if (!targetKelasId) {
      const firstKelas = await prisma.kelas.findFirst();
      targetKelasId = firstKelas ? firstKelas.id : 'kelas-ai';
    }

    const newKhd = await prisma.kehadiran.create({
      data: {
        id: `khd-${Date.now()}`,
        kelasId: targetKelasId,
        namaMatkul: matkul_name || 'Basis Data',
        nomor: nomor || 1,
        topik: topik || 'Materi Perkuliahan',
        tanggal: tanggal || new Date().toISOString().split('T')[0],
        status: status || 'Hadir',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Data kehadiran berhasil dicatat',
      data: newKhd,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteKehadiran = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      await prisma.kehadiran.delete({ where: { id } }).catch(() => {});
    }
    return res.status(200).json({ success: true, message: 'Data kehadiran berhasil dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getKehadiran,
  getAllKehadiran: getKehadiran,
  createKehadiran,
  deleteKehadiran,
};
