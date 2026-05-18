import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


