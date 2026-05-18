import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { CategoriesModule } from '../categories/categories.module';
import { SubcategoriesModule } from '../subcategories/subcategories.module';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoriesModule,
    SubcategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FileUploadService],
  exports: [ProductsService],
})
export class ProductsModule {}


