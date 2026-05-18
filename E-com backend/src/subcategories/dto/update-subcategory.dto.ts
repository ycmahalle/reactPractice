import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSubcategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


