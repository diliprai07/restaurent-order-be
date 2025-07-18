import { Expose, Transform } from 'class-transformer';
import { ShippingAddress } from '../entities/shipping-address.entity';

export class ResponseShippingAddressDto {
  @Expose()
  id: number;
  @Expose()
  value: string;
  @Expose()
  phoneNumber: string;

  @Expose()
  @Transform(({ obj }: { obj: ShippingAddress }) => obj.user?.id)
  userId: number;
}
