import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma, getUsers, findUserById, createUser, updateUser, deleteUser } from '../data/database.js';

// GET All Users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: any[] = await getUsers();
    const sanitized = users.map(({ password, ...user }) => user);
    return res.status(200).json(sanitized);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || err });
  }
};

// GET User by ID
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const user: any = await findUserById(String(id));

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const { password, ...sanitized } = user;
    return res.status(200).json(sanitized);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || err });
  }
};

// CREATE User
export const createNewUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role, nim, nip, fakultas, prodi, angkatan } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Field nama, email, password, dan role wajib diisi!' });
    }

    const created: any = await createUser({
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
    return res.status(201).json({
      message: 'User berhasil ditambahkan',
      user: sanitized,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || err });
  }
};

// BULK CREATE USERS – accepts an array of user objects (same shape as single create)
export const bulkCreateUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: any[] = req.body; // expect [{name,email,password,role,...}, ...]
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Request body harus berupa array user non‑kosong' });
    }
    // Prepare data: hash passwords, enforce required fields
    const prepared = users.map((u) => {
      const { name, email, password, role, nim, nip, fakultas, prodi, angkatan } = u;
      if (!email || !password || !name || !role) {
        throw new Error('Setiap user harus memiliki name, email, password, dan role');
      }
      return {
        id: u.id, // optional – prisma will generate if omitted
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        nim,
        nip,
        fakultas,
        prodi,
        angkatan,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // Use Prisma createMany for efficiency, skip duplicate email/NIP
    const result = await prisma.user.createMany({
      data: prepared,
      skipDuplicates: true,
    });
    return res.status(201).json({
      message: `Bulk insert selesai – ${result.count} user ditambahkan (duplikat dilewati)`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || err });
  }
};

// UPDATE User
export const updateExistingUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, email, role, fakultas, prodi } = req.body;

    const updated: any = await updateUser(String(id), {
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() }),
      ...(role && { role }),
      ...(fakultas && { fakultas }),
      ...(prodi && { prodi }),
    });

    const { password, ...sanitized } = updated;
    return res.status(200).json({
      message: 'User berhasil diperbarui',
      user: sanitized,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || err });
  }
};

// DELETE User
export const removeUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteUser(String(id));
    return res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || err });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser: createNewUser,
  bulkCreateUsers,
  updateUser: updateExistingUser,
  deleteUser: removeUser,
};