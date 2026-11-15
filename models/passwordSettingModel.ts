import db from '../config/db';

// Interface untuk struktur data Password Setting
export interface PasswordSettingItem {
  id: number;
  dosen_id: number | string;
  password_hash: string;
  notifikasi_email: boolean | number;
  notifikasi_sistem: boolean | number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

// Interface untuk data masukan saat melakukan upsert settings
export interface UpsertPasswordSettingDTO {
  password_hash?: string;
  notifikasi_email?: boolean | number;
  notifikasi_sistem?: boolean | number;
}

export const passwordSettingsModel = {
  // Ambil data pengaturan berdasarkan dosen_id
  getByDosenId: async (dosen_id: number | string): Promise<PasswordSettingItem | undefined> => {
    const [rows] = (await db.query(
      'SELECT * FROM password_setting WHERE dosen_id = ?',
      [dosen_id]
    )) as [PasswordSettingItem[], any];
    return rows[0];
  },

  // Simpan atau Perbarui kata sandi dan preferensi notifikasi secara otomatis
  upsertSettings: async (dosen_id: number | string, data: UpsertPasswordSettingDTO): Promise<any> => {
    const { password_hash, notifikasi_email, notifikasi_sistem } = data;

    // Jika password_hash kosong (tidak ingin diubah), ambil password lama atau string kosong
    const [result] = (await db.query(
      `INSERT INTO password_setting (dosen_id, password_hash, notifikasi_email, notifikasi_sistem)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         password_hash = COALESCE(?, password_hash),
         notifikasi_email = COALESCE(?, notifikasi_email),
         notifikasi_sistem = COALESCE(?, notifikasi_sistem)`,
      [
        dosen_id, 
        password_hash || '', 
        notifikasi_email ?? 1, 
        notifikasi_sistem ?? 1,
        password_hash || null, 
        notifikasi_email ?? null, 
        notifikasi_sistem ?? null
      ]
    )) as [any, any];

    return result;
  }
};

export default passwordSettingsModel;