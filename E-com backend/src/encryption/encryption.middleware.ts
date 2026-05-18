import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EncryptionService } from './encryption.service';

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const encryptionService = this.encryptionService;
    
    // Skip encryption for multipart/form-data (file uploads)
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return next();
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Decrypt request body if encrypted
    if (req.body && typeof req.body === 'object' && req.body.encrypted) {
      try {
        req.body = encryptionService.decryptObject(req.body.encrypted);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid encrypted request',
        });
      }
    }

    // Override res.json to encrypt response
    res.json = function (body: any) {
      // Check if encryption is disabled via header
      if (req.headers['x-no-encryption'] === 'true') {
        return originalJson(body);
      }

      // Encrypt the response
      try {
        const encrypted = encryptionService.encryptObject(body);
        return originalJson({ encrypted });
      } catch (error) {
        // If encryption fails, return original response
        return originalJson(body);
      }
    };

    next();
  }
}

