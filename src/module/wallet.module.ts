import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import {HttpModule} from "@nestjs/common";
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../service/prisma.service';
import { UtilModule } from './util.module';
import { BananoModule } from './banano.module';
import { WalletTypeService } from '../service/wallet/wallet.type.service';
import { WalletPersistenceService } from '../service/wallet/wallet.persistence.service';
import { WalletService } from '../service/wallet/wallet.service';
import { WalletTypeController } from '../controller/wallet/wallet.type.controller';
import { WalletController } from '../controller/wallet/wallet.controller';

@Module({
  imports: [ 
    HttpModule,
    UtilModule,
    BananoModule,
  ],
  providers: [
    PrismaService,
    WalletTypeService,
    WalletPersistenceService,
    WalletService
  ],
  controllers: [
    WalletTypeController,
    WalletController
  ],
  exports: [WalletPersistenceService, WalletService]
})
export class WalletModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'wallet-types', method: RequestMethod.GET}, {path: 'wallet-types', method: RequestMethod.PUT},
                {path: 'wallets', method: RequestMethod.GET}, {path: 'wallets', method: RequestMethod.PUT});
  }
}