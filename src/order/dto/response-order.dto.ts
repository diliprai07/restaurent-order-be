import { Expose, Transform } from 'class-transformer';
import { Order } from '../entities/order.entity';

export class ResponseOrderDto {
  @Expose()
  id: number;
  @Expose()
  totalPrice: number;
  @Expose()
  orderStatus: string;
  @Expose()
  shippingAddress: string;
  @Expose()
  shippingMethod: string;
  @Expose()
  createdAt: string;
  @Expose()
  @Transform(({ obj }: { obj: Order }) => obj.user?.id)
  userId: number;

  //   For order detail
  @Expose()
  productName: string;
  @Expose()
  productPrice: number;
  @Expose()
  quantity: number;
  @Expose()
  variant: string;
}
