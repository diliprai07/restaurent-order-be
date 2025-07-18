import { Expose } from 'class-transformer';

export class ResponseNotificationDto {
  @Expose()
  id: number;
  @Expose()
  type: string;
  @Expose()
  message: string;
  @Expose()
  isRead: boolean;
}
