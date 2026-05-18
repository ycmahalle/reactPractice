import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadPath = join(process.cwd(), 'public', 'images', 'products');

  constructor() {
    // Ensure base directory exists
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadProductImages(productId: string, files: Express.Multer.File[]): Promise<string[]> {
    const productPath = join(this.uploadPath, productId);

    // Create product-specific directory if it doesn't exist
    if (!existsSync(productPath)) {
      mkdirSync(productPath, { recursive: true });
    }

    const imagePaths: string[] = [];

    for (const file of files) {
      // If file is in temp folder, move it to product folder
      if (file.path.includes('temp')) {
        const newPath = join(productPath, file.filename);
        renameSync(file.path, newPath);
      }

      // Path relative to public folder
      const relativePath = `/public/images/products/${productId}/${file.filename}`;
      imagePaths.push(relativePath);
    }

    return imagePaths;
  }
}

