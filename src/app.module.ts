import { Module } from '@nestjs/common';
import { UtilModule } from './module/util.module';
import { UserModule } from './module/user.module';
import { TransactionModule } from './module/transaction.module';
import { AccountModule } from './module/account.module';
import { WalletModule } from './module/wallet.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockChainModule } from './module/blockchain.module';
import { SchadulerModule } from './module/scheduler.module';
import { PaymentModule } from './module/payment.module';
import { NotificationModule } from './module/notification.module';
import { GameServerModule } from './module/game.server.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UtilModule,
    BlockChainModule,
    UserModule,
    TransactionModule,
    AccountModule,
    WalletModule,
    PaymentModule,
    SchadulerModule,
    NotificationModule,
    GameServerModule
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {}