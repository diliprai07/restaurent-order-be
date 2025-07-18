import { IsIn, IsNotEmpty } from 'class-validator';
import { Status } from '../entities/order-detail.entity';

export class ChangeOrderStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'success', 'cancel'])
  status: Status;
}
