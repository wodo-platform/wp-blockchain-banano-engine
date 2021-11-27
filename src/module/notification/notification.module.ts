import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PaymentNotificationService } from './payment.notification.service';
import { NotificationController } from './notification.controller';

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