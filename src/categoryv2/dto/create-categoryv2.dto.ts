import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryV2Dto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
