import { Router } from 'express';
import {
  uploadVideo,
  uploadAttachment,
  uploadCoverImage,
} from '@/utils/cloudinary';
import { auth } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(auth);

// Upload video
router.post(
  '/video',
  (uploadVideo as any).single('video'),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: { message: 'No video file uploaded', statusCode: 400 },
        });
      }
      return res.status(200).json({
        success: true,
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (error: any) {
      console.error('Video upload error:', error);
      return res.status(500).json({
        error: {
          message: error?.message || 'Video upload failed',
          stack:
            process.env['NODE_ENV'] === 'development'
              ? error?.stack
              : undefined,
          statusCode: 500,
        },
      });
    }
  }
);

// Upload attachment
router.post(
  '/attachment',
  (uploadAttachment as any).single('attachment'),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: { message: 'No attachment file uploaded', statusCode: 400 },
        });
      }
      return res.status(200).json({
        success: true,
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (error: any) {
      console.error('Attachment upload error:', error);
      return res.status(500).json({
        error: {
          message: error?.message || 'Attachment upload failed',
          stack:
            process.env['NODE_ENV'] === 'development'
              ? error?.stack
              : undefined,
          statusCode: 500,
        },
      });
    }
  }
);

// Upload course cover image
router.post(
  '/cover-image',
  (uploadCoverImage as any).single('coverImage'),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: { message: 'No image file uploaded', statusCode: 400 },
        });
      }
      return res.status(200).json({
        success: true,
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (error: any) {
      console.error('Cover image upload error:', error);
      return res.status(500).json({
        error: {
          message: error?.message || 'Cover image upload failed',
          stack:
            process.env['NODE_ENV'] === 'development'
              ? error?.stack
              : undefined,
          statusCode: 500,
        },
      });
    }
  }
);

export default router;
