import { IsInt, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;
  @IsNotEmpty()
  @IsInt()
  variantItemId: number;
  @IsNotEmpty()
  @IsInt()
  productId: number;
}
