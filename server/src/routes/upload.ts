import { Router, Request, Response } from 'express';
import {
  uploadVideo,
  uploadAttachment,
  uploadCoverImage,
} from '../utils/cloudinary';
import { auth } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// All routes require authentication
router.use(auth);

// Upload video
router.post(
  '/video',
  (uploadVideo as any).single('video'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file as any;
      if (!file) {
        res.status(400).json({
          error: { message: 'No video file uploaded', statusCode: 400 },
        });
        return;
      }
      res.status(200).json({
        success: true,
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        size: file.size,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Video upload failed';
      logger.error('Video upload error:', error);
      res.status(500).json({
        error: {
          message: errorMessage,
          stack:
            process.env['NODE_ENV'] === 'development'
              ? error instanceof Error
                ? error.stack
                : undefined
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
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file as any;
      if (!file) {
        res.status(400).json({
          error: { message: 'No attachment file uploaded', statusCode: 400 },
        });
        return;
      }
      res.status(200).json({
        success: true,
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        size: file.size,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Attachment upload failed';
      logger.error('Attachment upload error:', error);
      res.status(500).json({
        error: {
          message: errorMessage,
          stack:
            process.env['NODE_ENV'] === 'development'
              ? error instanceof Error
                ? error.stack
                : undefined
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
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file as any;
      if (!file) {
        res.status(400).json({
          error: { message: 'No image file uploaded', statusCode: 400 },
        });
        return;
      }
      res.status(200).json({
        success: true,
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        size: file.size,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Cover image upload failed';
      logger.error('Cover image upload error:', error);
      res.status(500).json({
        error: {
          message: errorMessage,
          stack:
            process.env['NODE_ENV'] === 'development'
              ? error instanceof Error
                ? error.stack
                : undefined
              : undefined,
          statusCode: 500,
        },
      });
    }
  }
);

export default router;
