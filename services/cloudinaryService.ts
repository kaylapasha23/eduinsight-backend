import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('[Cloudinary] Cloudinary SDK configured successfully for cloud:', cloudName);
} else {
  console.log('[Cloudinary] Cloudinary credentials not fully set in .env. Local storage fallback will be used.');
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId?: string;
}

/**
 * Upload file lokal ke Cloudinary (mendukung Dokumen, PDF, Gambar, Media)
 */
export async function uploadFileToCloudinary(
  filePath: string,
  folder = 'eduinsight/tugas'
): Promise<CloudinaryUploadResult | null> {
  if (!isConfigured) {
    return null;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    let resourceType: 'auto' | 'image' | 'raw' | 'video' = 'auto';
    if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.txt', '.zip', '.rar', '.7z'].includes(ext)) {
      resourceType = 'raw';
    } else if (['.mp4', '.mov', '.mkv', '.avi', '.webm', '.mp3', '.wav', '.m4a', '.aac', '.ogg'].includes(ext)) {
      resourceType = 'video';
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
      resourceType = 'image';
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      type: 'upload',
      access_mode: 'public',
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err: any) {
    console.error('[Cloudinary] Gagal upload file ke Cloudinary:', err?.message || err);
    return null;
  }
}

export { cloudinary, isConfigured as isCloudinaryConfigured };
