const passwordSettingsModel = require('../models/passwordSettingModel');
const { updateUserPassword, findUserById } = require('../data/database');
const bcrypt = require('bcryptjs');

exports.updatePasswordSettings = async (req, res) => {
  try {
    const { dosen_id, password_baru, notifikasi_email, notifikasi_sistem } = req.body;

    if (!dosen_id) {
      return res.status(400).json({ success: false, message: 'Dosen ID diperlukan' });
    }

    let hashedPassword = null;
    if (password_baru) {
      // 1. Hash password baru
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password_baru, salt);

      // 2. Cari data user / dosen berdasarkan ID (atau email default)
      const user = findUserById ? findUserById(dosen_id) : null;
      const targetEmail = user ? user.email : 'dosen@eduinsight.ac.id';

      // 3. Update password di sistem auth utama backend (agar login pakai password baru)
      updateUserPassword(targetEmail, hashedPassword);
    }

    // 4. Tetap simpan log/history ke tabel password_setting di MySQL
    await passwordSettingsModel.upsertSettings(dosen_id, {
      password_hash: hashedPassword,
      notifikasi_email,
      notifikasi_sistem,
    });

    res.status(200).json({
      success: true,
      message: 'Pengaturan akun dan kata sandi berhasil disimpan! Silakan login kembali dengan password baru.',
    });
  } catch (err) {
    console.error('[ERROR UPDATE PASSWORD SETTINGS]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};