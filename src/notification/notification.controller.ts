import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { API_VERSION } from 'src/_cores/constants/app.constant';
import { NotificationService } from './notification.service';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseNotificationDto } from './dto/response-notification.dto';

@Controller(`${API_VERSION}/notifications`)
@TransformDTO(ResponseNotificationDto)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }
}
