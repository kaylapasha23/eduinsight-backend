const bcrypt = require('bcryptjs');
const { getUsers, saveUsers, findUserById } = require('../data/database'); 

// ==========================================
// READ (GET All Users)
// ==========================================
exports.getAllUsers = (req, res) => {
  try {
    const users = getUsers();
    // Hilangkan password dari response demi keamanan
    const sanitizedUsers = users.map(({ password, additionalPasswordHashes, ...user }) => user);
    res.status(200).json(sanitizedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// READ (GET User by ID)
// ==========================================
exports.getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Sembunyikan password
    const { password, additionalPasswordHashes, ...sanitizedUser } = user;
    res.status(200).json(sanitizedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// CREATE (Register / Tambah User Baru)
// ==========================================
exports.createUser = (req, res) => {
  try {
    const { name, email, password, role, nim, nip, fakultas, prodi, angkatan } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Field nama, email, password, dan role wajib diisi!' });
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar!' });
    }

    const newUser = {
      id: `user-${role.substring(0, 3)}-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password, 10),
      role,
      ...(nim && { nim }),
      ...(nip && { nip }),
      ...(fakultas && { fakultas }),
      ...(prodi && { prodi }),
      ...(angkatan && { angkatan }),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...sanitizedUser } = newUser;
    res.status(201).json({
      message: 'User berhasil ditambahkan',
      user: sanitizedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// UPDATE (Perbarui Data User)
// ==========================================
exports.updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, fakultas, prodi } = req.body;

    const users = getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Update field yang dikirimkan saja
    users[index] = {
      ...users[index],
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() }),
      ...(role && { role }),
      ...(fakultas && { fakultas }),
      ...(prodi && { prodi }),
      updatedAt: new Date().toISOString()
    };

    saveUsers(users);

    const { password, additionalPasswordHashes, ...sanitizedUser } = users[index];
    res.status(200).json({
      message: 'User berhasil diperbarui',
      user: sanitizedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// DELETE (Hapus User)
// ==========================================
exports.deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    let users = getUsers();
    const initialLength = users.length;

    users = users.filter(u => u.id !== id);

    if (users.length === initialLength) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    saveUsers(users);
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};