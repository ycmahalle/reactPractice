import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CategoriesService } from '../categories/categories.service';
import { SubcategoriesService } from '../subcategories/subcategories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<ProductDocument> {
    // Verify category exists
    await this.categoriesService.findOne(createProductDto.categoryId);

    // Verify subcategory exists if provided
    if (createProductDto.subcategoryId) {
      await this.subcategoriesService.findOne(createProductDto.subcategoryId);
    }

    const product = new this.productModel({
      ...createProductDto,
      createdBy: userId,
    });
    return product.save();
  }

  async findAll(query: ProductQueryDto): Promise<{ products: ProductDocument[]; total: number }> {
    const { page = 1, limit = 10, categoryId, subcategoryId, search, isActive } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (subcategoryId) filter.subcategoryId = subcategoryId;
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('categoryId', 'name')
        .populate('subcategoryId', 'name')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { products, total };
  }

  async findOne(id: string, requireAuth: boolean = false): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product requires authentication for private links
    if (requireAuth && !product.isPublic) {
      throw new NotFoundException('Product not found or requires authentication');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    if (updateProductDto.categoryId) {
      await this.categoriesService.findOne(updateProductDto.categoryId);
    }

    if (updateProductDto.subcategoryId) {
      await this.subcategoriesService.findOne(updateProductDto.subcategoryId);
    }

    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductDto },
      { new: true, runValidators: true },
    )
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateImages(id: string, images: string[]): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $set: { images } },
      { new: true },
    ).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }
}


