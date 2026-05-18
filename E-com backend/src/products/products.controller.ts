import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileUploadService } from './file-upload.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const tempPath = join(process.cwd(), 'public', 'images', 'products', 'temp');
          if (!existsSync(tempPath)) {
            mkdirSync(tempPath, { recursive: true });
          }
          cb(null, tempPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `product-${uniqueSuffix}.${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const product = await this.productsService.create(createProductDto, req.user.userId);
    
    if (files && files.length > 0) {
      const imagePaths = await this.fileUploadService.uploadProductImages(
        product._id.toString(),
        files,
      );
      return this.productsService.updateImages(product._id.toString(), imagePaths);
    }
    
    return product;
  }

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('share/:id')
  async findOnePublic(@Param('id') id: string) {
    return this.productsService.findOne(id, false);
  }

  @Get('private/:id')
  @UseGuards(JwtAuthGuard)
  async findOnePrivate(@Param('id') id: string) {
    return this.productsService.findOne(id, true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id, false);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const productId = req.params.id;
          const productPath = join(process.cwd(), 'public', 'images', 'products', productId);
          if (!existsSync(productPath)) {
            mkdirSync(productPath, { recursive: true });
          }
          cb(null, productPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `product-${uniqueSuffix}.${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      const imagePaths = await this.fileUploadService.uploadProductImages(id, files);
      updateProductDto = { ...updateProductDto, images: imagePaths } as any;
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

