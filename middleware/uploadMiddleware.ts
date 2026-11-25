import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Buat direktori uploads/tugas jika belum ada
const uploadDir = path.join(process.cwd(), 'uploads', 'tugas');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const allowedExtensions = [
  // Dokumen, Spreadsheet, Presentasi, Teks
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.txt', '.rtf',
  // Arsip & Kompresi
  '.zip', '.rar', '.7z', '.tar', '.gz',
  // Media Gambar
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.bmp',
  // Media Video
  '.mp4', '.mov', '.mkv', '.avi', '.webm', '.flv',
  // Media Audio
  '.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac',
  // Kode Program, Database & Konfigurasi
  '.sql', '.json', '.xml', '.py', '.js', '.ts', '.html', '.css', '.c', '.cpp', '.java', '.kt', '.dart'
];

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe file tidak didukung (${ext}). Harap unggah file dokumen, media (audio/video/gambar), arsip, spreadsheet, atau kode program.`));
  }
};

export const uploadTugas = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});
