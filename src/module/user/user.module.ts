import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthMiddleware } from '../../middleware/auth/auth.middleware';
import { PrismaService } from '../../service/prisma.service';
import { BananoWalletModule } from '../wallet/banano.wallet.module';

@Module({
  imports: [ 
    BananoWalletModule
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
