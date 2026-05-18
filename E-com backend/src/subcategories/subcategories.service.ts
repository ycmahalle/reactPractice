import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory, SubcategoryDocument } from './schemas/subcategory.schema';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<SubcategoryDocument> {
    // Verify category exists
    await this.categoriesService.findOne(createSubcategoryDto.categoryId);

    const existingSubcategory = await this.subcategoryModel.findOne({ 
      name: createSubcategoryDto.name,
      categoryId: createSubcategoryDto.categoryId,
    });
    if (existingSubcategory) {
      throw new ConflictException('Subcategory with this name already exists in this category');
    }

    const subcategory = new this.subcategoryModel(createSubcategoryDto);
    return subcategory.save();
  }

  async findAll(categoryId?: string): Promise<SubcategoryDocument[]> {
    const query = categoryId ? { categoryId } : {};
    return this.subcategoryModel.find(query).populate('categoryId', 'name').exec();
  }

  async findOne(id: string): Promise<SubcategoryDocument> {
    const subcategory = await this.subcategoryModel.findById(id).populate('categoryId', 'name').exec();
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<SubcategoryDocument> {
    if (updateSubcategoryDto.categoryId) {
      await this.categoriesService.findOne(updateSubcategoryDto.categoryId);
    }

    if (updateSubcategoryDto.name) {
      const existingSubcategory = await this.subcategoryModel.findOne({ 
        name: updateSubcategoryDto.name,
        categoryId: updateSubcategoryDto.categoryId || (await this.findOne(id)).categoryId,
        _id: { $ne: id }
      });
      if (existingSubcategory) {
        throw new ConflictException('Subcategory with this name already exists in this category');
      }
    }

    const subcategory = await this.subcategoryModel.findByIdAndUpdate(
      id,
      { $set: updateSubcategoryDto },
      { new: true, runValidators: true },
    ).populate('categoryId', 'name').exec();

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subcategoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Subcategory not found');
    }
  }
}


