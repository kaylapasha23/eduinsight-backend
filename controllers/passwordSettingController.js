const passwordSettingsModel = require('../models/passwordSettingModel');
const bcrypt = require('bcrypt');

exports.updatePasswordSettings = async (req, res) => {
  try {
    const { dosen_id, password_baru, notifikasi_email, notifikasi_sistem } = req.body;

    if (!dosen_id) {
      return res.status(400).json({ success: false, message: 'Dosen ID diperlukan' });
    }

    let hashedPassword = null;
    if (password_baru) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password_baru, salt);
    }

    await passwordSettingsModel.upsertSettings(dosen_id, {
      password_hash: hashedPassword,
      notifikasi_email,
      notifikasi_sistem
    });

    res.status(200).json({
      success: true,
      message: 'Pengaturan akun dan kata sandi berhasil disimpan secara otomatis!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};