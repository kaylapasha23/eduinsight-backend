const passwordSettingsModel = require('../models/passwordSettingModel');
const { updateUserPassword } = require('../data/database');
const bcrypt = require('bcryptjs');

exports.updatePasswordSettings = async (req, res) => {
  try {
    const { dosen_id, password_baru, notifikasi_email, notifikasi_sistem } = req.body;

    // Default target email dosen utama
    const targetEmail = 'dosen@eduinsight.ac.id';

    if (password_baru) {
      // 1. Hash password baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_baru, salt);

      // 2. Update password di users.json via helper database.js
      const updatedUser = updateUserPassword(targetEmail, hashedPassword);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Akun dosen tidak ditemukan di sistem auth.',
        });
      }
    }

    // 3. Simpan setting notifikasi ke MySQL
    await passwordSettingsModel.upsertSettings(dosen_id || 1, {
      password_hash: password_baru ? await bcrypt.hash(password_baru, 10) : null,
      notifikasi_email,
      notifikasi_sistem,
    });

    res.status(200).json({
      success: true,
      message: 'Pengaturan akun dan kata sandi berhasil diperbarui! Silakan gunakan password baru untuk login.',
    });
  } catch (err) {
    console.error('[ERROR UPDATE PASSWORD SETTINGS]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};