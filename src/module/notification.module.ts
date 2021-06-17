import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user.module';
import { PaymentNotificationService } from '../service/notification/payment.notification.service';
import { NotificationController } from '../controller/notification/notification.controller';

@Module({
  imports: [
    UserModule,
  ],
  providers: [
    PaymentNotificationService,
  ],
  controllers: [
    NotificationController
  ],
  exports: [PaymentNotificationService]
})

export class NotificationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}