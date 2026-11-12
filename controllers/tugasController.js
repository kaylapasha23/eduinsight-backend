const { prisma } = require('../data/database');

// Mengambil semua data tugas
exports.getAllTugas = async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const tugasList = await prisma.tugas.findMany({
      where,
      include: {
        kelas: {
          include: {
            mataKuliah: true,
            dosen: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    const formatted = tugasList.map((t) => ({
      id: t.id,
      class_id: t.kelasId,
      class_name: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      class_code: t.kelas?.kodeGabung || '',
      dosen_name: t.kelas?.dosen?.name || 'Dosen Pengampu',
      title: t.judul,
      description: t.deskripsi,
      deadline_text: t.deadlineText || 'Hari ini, 23.59',
      category: t.category,
      attachment_name: t.lampiran,
      created_at: t.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mengambil detail tugas berdasarkan ID
exports.getTugasById = async (req, res) => {
  try {
    const { id } = req.params;
    const t = await prisma.tugas.findUnique({
      where: { id },
      include: {
        kelas: {
          include: {
            mataKuliah: true,
            dosen: true,
          },
        },
      },
    });

    if (!t) {
      return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    }

    const formatted = {
      id: t.id,
      class_id: t.kelasId,
      class_name: t.kelas?.mataKuliah?.nama || 'Mata Kuliah',
      class_code: t.kelas?.kodeGabung || '',
      dosen_name: t.kelas?.dosen?.name || 'Dosen Pengampu',
      title: t.judul,
      description: t.deskripsi,
      deadline_text: t.deadlineText || 'Hari ini, 23.59',
      category: t.category,
      attachment_name: t.lampiran,
      created_at: t.createdAt,
    };

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Menambah tugas baru
exports.createTugas = async (req, res) => {
  try {
    const { class_id, title, description, deadline, deadline_text, category, attachment_name } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title wajib diisi!' });
    }

    let targetKelasId = class_id;
    if (!targetKelasId) {
      const firstKelas = await prisma.kelas.findFirst();
      targetKelasId = firstKelas ? firstKelas.id : 'kelas-ai';
    }

    const newTugas = await prisma.tugas.create({
      data: {
        id: `tugas-${Date.now()}`,
        kelasId: targetKelasId,
        judul: title,
        deskripsi: description || '',
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        deadlineText: deadline_text || 'Hari ini, 23.59',
        category: category || 'segera',
        lampiran: attachment_name || null,
      },
    });

    res.status(201).json({ success: true, message: 'Tugas berhasil ditambahkan', id: newTugas.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mengubah kategori status tugas
exports.updateTugasCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Field category wajib diisi!' });
    }

    await prisma.tugas.update({
      where: { id },
      data: { category },
    });

    res.status(200).json({ success: true, message: 'Status tugas berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Menghapus tugas
exports.deleteTugas = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tugas.delete({ where: { id } });
    res.status(200).json({ success: true, message: `Tugas dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
