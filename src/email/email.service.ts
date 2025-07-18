import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Email } from './interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({
    to,
    from = 'admin@gmail.com',
    subject,
    text,
    html,
  }: Email): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from,
      subject,
      text,
      html,
    });

    console.log('Sent email successfully!');
  }
}
