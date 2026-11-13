const { prisma } = require('../data/database');

// Ambil semua data penilaian semester (mendukung format Web & Mobile)
exports.getAllPenilaian = async (req, res) => {
  try {
    const list = await prisma.penilaian.findMany({
      include: {
        kelas: {
          include: {
            mataKuliah: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: list,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tambah data penilaian baru
exports.createPenilaian = async (req, res) => {
  try {
    const { class_id, student_name, task_name, score } = req.body;

    if (!student_name || !task_name) {
      return res.status(400).json({ success: false, message: 'student_name dan task_name wajib diisi!' });
    }

    let targetKelasId = class_id;
    if (!targetKelasId) {
      const firstKelas = await prisma.kelas.findFirst();
      targetKelasId = firstKelas ? firstKelas.id : 'kelas-pfa';
    }

    const created = await prisma.penilaian.create({
      data: {
        id: `penilaian-${Date.now()}`,
        kelasId: targetKelasId,
        studentName: student_name,
        taskName: task_name,
        score: score ? parseInt(score, 10) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Data penilaian berhasil ditambahkan',
      data: created,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hapus data penilaian
exports.deletePenilaian = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.penilaian.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Data penilaian berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
