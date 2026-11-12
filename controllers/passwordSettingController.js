const { updateUserPassword, findUserByEmail, getUsers } = require('../data/database');
const bcrypt = require('bcryptjs');

exports.updatePasswordSettings = async (req, res) => {
  try {
    const { password_baru, email } = req.body;

    let targetEmail = email;

    if (!targetEmail) {
      const allUsers = await getUsers();
      const dosenUser = allUsers.find((u) => u.role === 'dosen' || u.id === 'user-dsn-001');
      targetEmail = dosenUser ? dosenUser.email : 'dosen@eduinsight.ac.id';
    }

    if (password_baru) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_baru, salt);

      const updatedUser = await updateUserPassword(targetEmail, hashedPassword);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: `Akun (${targetEmail}) tidak ditemukan di sistem auth.`,
        });
      }
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
