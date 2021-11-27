import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BananoApiModule } from '../banano/banano.api.module';
import { BananoBlockchainService } from './banano.blockchain.service';
import { NotificationModule } from '../notification/notification.module';
import { BananoBlockchainPaymentController } from './banano.blockchain.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { UtilModule } from '../util/util.module';
import { BananoBlockchainEventListenerService } from './banano.blockchain.event.listener.service';
import { BananoBlockchainTransactionService } from './banano.blockchain.transaction.service';

@Module({
  imports: [
    UserModule,
    UtilModule,
    BananoApiModule,
    TransactionModule,
    NotificationModule
  ],
  providers: [
    BananoBlockchainService,
    BananoBlockchainService,
    BananoBlockchainEventListenerService,
    BananoBlockchainTransactionService
  ],
  controllers: [
    BananoBlockchainPaymentController
  ],
  exports: [BananoBlockchainService,BananoBlockchainService,BananoBlockchainEventListenerService,BananoBlockchainTransactionService]
})
export class BananoBlockchainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}