import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Notification } from './entity/notification.entity';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connect: ${client.id}`);
  }
  handleDisconnect(client: any) {
    console.log(`Client disconnect: ${client.id}`);
  }

  sendNotification(notification: Notification) {
    this.server.emit('notification', notification);
  }
}
