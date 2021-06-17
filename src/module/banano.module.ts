import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import {HttpModule} from "@nestjs/common";
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../service/prisma.service';
import { UtilModule } from './util.module';
import { BananoNotificationService } from '../service/banano/banano.notification.service';
import { BananoNodeService } from '../service/banano/banano.node.service';
import { BananoApiService } from '../service/banano/banano.api.service';
import { BananoWalletService } from '../service/banano/banano.wallet.service';


@Module({
  imports: [ 
    HttpModule,
    UtilModule
  ],
  providers: [
    BananoNotificationService,
    BananoNodeService,
    PrismaService,
    BananoApiService,
    BananoWalletService,
  ],
  controllers: [
  ],
  exports: [BananoNotificationService, BananoApiService,BananoNodeService, BananoWalletService]
})
export class BananoModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
   
  }
}