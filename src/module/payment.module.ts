import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user.module';
import { BananoModule } from './banano.module';
import { PaymentService } from '../service/payment/payment.service';
import { PaymentBananoService } from '../service/payment/payment.banano.service';
import { NotificationModule } from './notification.module';
import { PaymentController } from '../controller/payment/payment.controller';
import { TransactionModule } from './transaction.module';
import { UtilModule } from './util.module';

@Module({
  imports: [
    UserModule,
    UtilModule,
    BananoModule,
    TransactionModule,
    NotificationModule
  ],
  providers: [
    PaymentService,
    PaymentBananoService],
  controllers: [
    PaymentController
  ],
  exports: [PaymentService,PaymentBananoService]
})
export class PaymentModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}