const passwordSettingsModel = require('../models/passwordSettingModel');
const { updateUserPassword, findUserByEmail, getUsers } = require('../data/database');
const bcrypt = require('bcryptjs');

exports.updatePasswordSettings = async (req, res) => {
  try {
    const { dosen_id, password_baru, notifikasi_email, notifikasi_sistem, email } = req.body;

    console.log('[PASSWORD UPDATE] Memproses perubahan password...');

    // 1. Tentukan email target (Utamakan dari req.body, atau cari dosen utama)
    let targetEmail = email;

    if (!targetEmail) {
      // Cari akun dosen dari users.json / database
      const allUsers = getUsers ? getUsers() : [];
      const dosenUser = allUsers.find(u => u.role === 'dosen' || u.id === 'user-dsn-001');
      targetEmail = dosenUser ? dosenUser.email : 'dosen@eduinsight.ac.id';
    }

    let hashedPassword = null;
    if (password_baru) {
      // 2. Hash password baru
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password_baru, salt);

      // 3. Update password di users.json secara eksplisit menggunakan email target
      const updatedUser = updateUserPassword(targetEmail, hashedPassword);

      if (!updatedUser) {
        console.error(`[PASSWORD UPDATE FAILED] User '${targetEmail}' tidak ditemukan di system auth database!`);
        return res.status(404).json({
          success: false,
          message: `Akun (${targetEmail}) tidak ditemukan di sistem auth.`,
        });
      }

      console.log(`[PASSWORD UPDATE SUCCESS] Password berhasil diperbarui di users.json untuk: ${targetEmail}`);
    }

    // 4. Simpan preferensi notifikasi ke MySQL (jika tabel password_setting terpasang)
    try {
      await passwordSettingsModel.upsertSettings(dosen_id || 1, {
        password_hash: hashedPassword,
        notifikasi_email,
        notifikasi_sistem,
      });
    } catch (dbErr) {
      console.warn('[MYSQL UPSERT WARN] Gagal menyimpan log MySQL (diabaikan agar auth tetap berjalan):', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Pengaturan akun dan kata sandi berhasil disimpan! Silakan login kembali dengan password baru Anda.',
    });
  } catch (err) {
    console.error('[ERROR UPDATE PASSWORD SETTINGS]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};