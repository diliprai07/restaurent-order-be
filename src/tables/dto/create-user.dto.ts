import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { TableStatus } from '../entities/tables.entity';

export class CreateTableDto {
  @IsNotEmpty()
  @IsNumber()
  table_number: string;

  @IsOptional()
  @IsString()
  qr_code?: string;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}
