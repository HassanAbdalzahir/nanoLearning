import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Use CLOUDINARY_URL if available, otherwise fall back to separate variables
const cloudinaryUrl = process.env['CLOUDINARY_URL'];

if (cloudinaryUrl) {
  // Parse the URL format: cloudinary://api_key:api_secret@cloud_name
  cloudinary.config({
    url: cloudinaryUrl,
  });
} else {
  // Fallback to separate environment variables
  const cloudName = process.env['CLOUDINARY_CLOUD_NAME'] || '';
  const apiKey = process.env['CLOUDINARY_API_KEY'] || '';
  const apiSecret = process.env['CLOUDINARY_API_SECRET'] || '';

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

// Storage for images and documents
export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'nanoLearning',
    format: 'png', // fallback format
    public_id: file.originalname.split('.')[0],
  }),
});

// Storage for videos
export const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'nanoLearning/videos',
    resource_type: 'video',
    format: 'mp4', // fallback format
    public_id: file.originalname.split('.')[0],
    transformation: [
      { width: 1280, height: 720, crop: 'limit' }, // max resolution
      { quality: 'auto' }, // optimize quality
    ],
  }),
});

// Multer upload for images and documents
export const upload = multer({ storage });

// Multer upload for videos
export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
  fileFilter: (_req, file, cb) => {
    // Accept video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

// Multer upload for attachments (PDFs, documents)
export const uploadAttachment = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for attachments
  },
  fileFilter: (_req, file, cb) => {
    // Accept common document types
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only PDF, Word, Excel, text, and image files are allowed'
        )
      );
    }
  },
});

// Multer upload specifically for cover images
export const uploadCoverImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for cover images
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files for cover images
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed for cover images'
        )
      );
    }
  },
});

export { cloudinary };
