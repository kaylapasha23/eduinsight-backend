const bcrypt = require('bcryptjs');
const { getUsers, findUserById, createUser, updateUser, deleteUser } = require('../data/database');

// GET All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    const sanitized = users.map(({ password, ...user }) => user);
    res.status(200).json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const { password, ...sanitized } = user;
    res.status(200).json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, nim, nip, fakultas, prodi, angkatan } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Field nama, email, password, dan role wajib diisi!' });
    }

    const created = await createUser({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role,
      nim,
      nip,
      fakultas,
      prodi,
      angkatan,
    });

    const { password: _, ...sanitized } = created;
    res.status(201).json({
      message: 'User berhasil ditambahkan',
      user: sanitized,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, fakultas, prodi } = req.body;

    const updated = await updateUser(id, {
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() }),
      ...(role && { role }),
      ...(fakultas && { fakultas }),
      ...(prodi && { prodi }),
    });

    const { password, ...sanitized } = updated;
    res.status(200).json({
      message: 'User berhasil diperbarui',
      user: sanitized,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
