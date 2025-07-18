import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateShippingRuleDto {
  @IsOptional()
  @IsNumber()
  cost: number;
  @IsOptional()
  @IsInt()
  estimateDay: number;
}
