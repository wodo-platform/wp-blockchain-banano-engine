import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import {HttpModule} from "@nestjs/common";
import { AuthMiddleware } from '../../middleware/auth/auth.middleware';
import { PrismaService } from '../../service/prisma.service';
import { UtilModule } from '../util/util.module';
import { BananoApiModule } from '../banano/banano.api.module';
import { BananoWalletService } from './banano.wallet.service';
import { BananoWalletController } from './banano.wallet.controller';

@Module({
  imports: [ 
    HttpModule,
    UtilModule,
    BananoApiModule,
  ],
  providers: [
    PrismaService,
    BananoWalletService
  ],
  controllers: [
    BananoWalletController
  ],
  exports: [BananoWalletService]
})
export class BananoWalletModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'wallets', method: RequestMethod.GET}, {path: 'wallets', method: RequestMethod.PUT});
  }
}