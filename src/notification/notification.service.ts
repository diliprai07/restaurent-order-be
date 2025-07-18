import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationPayload } from './interfaces/notification.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationGateway: NotificationGateway,
  ) {}

  async sendNotification(notification: NotificationPayload) {
    console.log('send notification', notification);

    const notificationEntity = new Notification();
    notificationEntity.type = notification.type;
    notificationEntity.message = notification.message;
    const savedNotification = await this.notificationRepository.save(
      notificationEntity,
    );

    await this.notificationGateway.sendNotification(savedNotification);
  }

  async findAll() {
    const notifications = await this.notificationRepository.find();
    return notifications;
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) throw new NotFoundException(`No notification found`);

    notification.isRead = true;
    await this.notificationRepository.save(notification);

    return notification;
  }
}
