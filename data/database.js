const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'users.json');

// Default initial dummy users with salted bcrypt hashed passwords
// Plaintext: 'password123' for mahasiswa & dosen, 'admin123' for admin
const DEFAULT_USERS = [
  {
    id: 'user-mhs-001',
    name: 'Nama Mahasiswa',
    email: 'mahasiswa@eduinsight.ac.id',
    // bcrypt hash of 'password123' with 10 salt rounds
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '19746713498174',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-mhs-002',
    name: 'Mahasiswa FILKOM',
    email: 'mahasiswa@gmail.ac.id', // Sesuai profile screen dummy email
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '19746713498174',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-dsn-001',
    name: 'Dr. Ahmad Sahroni, M.Kom.',
    email: 'dosen@eduinsight.ac.id',
    // bcrypt hash of 'password123' with 10 salt rounds
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '198503152010121002',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Pemrograman Web', 'Kecerdasan Buatan', 'Keamanan Siber'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-adm-001',
    name: 'Administrator Akademik',
    email: 'admin@eduinsight.ac.id',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

// Token Blacklist for Revoked Sessions (Logout)
const tokenBlacklist = new Set();

function initDatabase() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
  }
}

function getUsers() {
  initDatabase();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function findUserByEmail(email) {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

function findUserById(id) {
  const users = getUsers();
  return users.find((u) => u.id === id);
}

function createUser(userData) {
  const users = getUsers();
  users.push(userData);
  saveUsers(users);
  return userData;
}

function blacklistToken(token) {
  tokenBlacklist.add(token);
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

module.exports = {
  initDatabase,
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  blacklistToken,
  isTokenBlacklisted,
};
