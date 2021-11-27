import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import {HttpModule} from "@nestjs/common";
import { AuthMiddleware } from '../../middleware/auth/auth.middleware';
import { PrismaService } from '../../service/prisma.service';
import { UtilModule } from '../util/util.module';
import { BananoApiNotificationService } from './banano.api.notification.service';
import { BananoApiNodeService } from './banano.api.node.service';
import { BananoApiService } from './banano.api.service';
import { BananoApiWalletService } from './banano.api.wallet.service';


@Module({
  imports: [ 
    HttpModule,
    UtilModule
  ],
  providers: [
    BananoApiNotificationService,
    BananoApiNodeService,
    PrismaService,
    BananoApiService,
    BananoApiWalletService
  ],
  controllers: [
  ],
  exports: [BananoApiNotificationService, BananoApiService,BananoApiNodeService, BananoApiWalletService]
})
export class BananoApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
   
  }
}