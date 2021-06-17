import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from '../controller/user/user.controller';
import { UserService } from '../service/user/user.service';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../service/prisma.service';
import { WalletService } from '../service/wallet/wallet.service';
import { WalletModule } from './wallet.module';

@Module({
  imports: [ 
    WalletModule
  ],
  providers: [
    UserService,
    PrismaService
  ],
  controllers: [
    UserController
  ],
  exports: [UserService]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT});
  }
}
