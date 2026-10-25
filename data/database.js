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
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '19746713498174',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-14T15:28:13.530Z',
  },
  {
    id: 'user-mhs-brooke',
    name: 'Brooke Everly',
    email: 'brookeverly17@eduinsight.student.ac.id',
    alternativeEmails: ['brooke.everly@eduinsight.ac.id', 'brookeverly17@eduinsight.mail.com'],
    password: bcrypt.hashSync('password123', 10),
    additionalPasswordHashes: [
      '$2a$10$msMygjukI1KIr5NxivcF4e3iER2CilTNjew.9xZgGVBC0CAw8yTs6',
      '$2a$10$pF7Offjebjzva6uWj97g0.xPx1.IKgvK7uiEbhI3B7YUlwJZ7GnGK',
    ],
    role: 'mahasiswa',
    nim: '254076512225017',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-24T16:18:50.615Z',
  },
  {
    id: 'user-mhs-chris',
    name: 'Chris Redfield',
    email: 'redchris@gmail.com',
    alternativeEmails: ['chris.redfield@eduinsight.student.ac.id', 'chris@eduinsight.ac.id'],
    password: bcrypt.hashSync('password123', 10),
    additionalPasswordHashes: [
      '$2a$10$AQbxzsY/W9BFHCdCx3MmluSKrFguO.DyCDQyYRdQtuX7NWCMk6Yn.',
    ],
    role: 'mahasiswa',
    nim: '254076512225018',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-25T00:51:53.109Z',
  },
  {
    id: 'user-mhs-002',
    name: 'Mahasiswa FILKOM',
    email: 'mahasiswa@gmail.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '19746713498174',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-14T15:28:13.659Z',
  },
  {
    id: 'user-dsn-001',
    name: 'Dr. Ahmad Sahroni, M.Kom.',
    email: 'dosen@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '198503152010121002',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Pemrograman Web', 'Kecerdasan Buatan', 'Keamanan Siber'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-adm-001',
    name: 'Administrator Akademik',
    email: 'admin@eduinsight.ac.id',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: '2026-10-14T15:28:13.936Z',
  },
];

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
  const target = email.trim().toLowerCase();
  return users.find((u) => {
    if (u.email && u.email.toLowerCase() === target) return true;
    if (Array.isArray(u.alternativeEmails) && u.alternativeEmails.some((e) => e.toLowerCase() === target)) return true;
    return false;
  });
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

function updateUserPassword(email, newHashedPassword) {
  const users = getUsers();
  const target = email.trim().toLowerCase();
  const userIndex = users.findIndex((u) => {
    if (u.email && u.email.toLowerCase() === target) return true;
    if (Array.isArray(u.alternativeEmails) && u.alternativeEmails.some((e) => e.toLowerCase() === target)) return true;
    return false;
  });

  if (userIndex === -1) {
    return null;
  }

  users[userIndex].password = newHashedPassword;
  if (users[userIndex].additionalPasswordHashes) {
    delete users[userIndex].additionalPasswordHashes;
  }
  users[userIndex].updatedAt = new Date().toISOString();

  saveUsers(users);
  return users[userIndex];
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
  saveUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  blacklistToken,
  isTokenBlacklisted,
  DEFAULT_USERS,
};

