import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
