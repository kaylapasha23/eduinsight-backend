const { prisma } = require('../data/database');

// Ambil data evaluasi mahasiswa (AI Evaluation Card)
exports.getEvaluasi = async (req, res) => {
  try {
    const list = await prisma.evaluasi.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = list.map((ev) => {
      let messages = [];
      try {
        messages = JSON.parse(ev.messages);
      } catch (_) {
        messages = [{ text: ev.messages, isPositive: true }];
      }

      return {
        id: ev.id,
        dateText: ev.dateText,
        lecturerName: ev.lecturerName,
        messages,
        lecturerNote: ev.lecturerNote,
      };
    });

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Simpan atau update analisis AI / catatan dosen
exports.saveEvaluasi = async (req, res) => {
  try {
    const { dateText, lecturerName, messages, lecturerNote } = req.body;

    const newEval = await prisma.evaluasi.create({
      data: {
        id: `eval-${Date.now()}`,
        dateText: dateText || 'Hari ini',
        lecturerName: lecturerName || 'Dosen Pembimbing',
        messages: typeof messages === 'string' ? messages : JSON.stringify(messages || []),
        lecturerNote: lecturerNote || null,
      },
    });

    res.status(200).json({ success: true, message: 'Data evaluasi berhasil disimpan', data: newEval });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
