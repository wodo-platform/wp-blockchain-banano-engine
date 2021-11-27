import { Module } from '@nestjs/common';
import { UtilModule } from './module/util/util.module';
import { UserModule } from './module/user/user.module';
import { TransactionModule } from './module/transaction/transaction.module';
import { AccountModule } from './module/account/account.module';
import { BananoWalletModule } from './module/wallet/banano.wallet.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { SchadulerModule } from './module/scheduler/scheduler.module';
import { BananoBlockchainModule } from './module/blockchain/banano.blockchain.module';
import { NotificationModule } from './module/notification/notification.module';
import { GameServerModule } from './module/gameserver/game.server.module';
import { RouterModule, Routes, RouteTree } from '@nestjs/core';
import { BananoApiModule } from './module/banano/banano.api.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    UtilModule,
    UserModule,
    BananoApiModule,
    TransactionModule,
    AccountModule,
    BananoWalletModule,
    BananoBlockchainModule,
    SchadulerModule,
    NotificationModule,
    GameServerModule,
    RouterModule.register([ 
      {
        path: 'api',
        module: GameServerModule
      } as RouteTree,
      {
        path: 'api',
        module: TransactionModule
      } as RouteTree,
      ,
      {
        path: 'api',
        module: BananoWalletModule
      } as RouteTree,
      ,
      {
        path: 'api',
        module: NotificationModule
      } as RouteTree,
      ,
      {
        path: 'api',
        module: BananoBlockchainModule
      } as RouteTree,
    ] as Routes),
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {}