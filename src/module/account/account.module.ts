import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BananoAccountController } from './banano.account.controller';
import { BananoAccountService } from './banano.account.service';
import { AuthMiddleware } from '../../middleware/auth/auth.middleware';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../../service/prisma.service';

@Module({
  imports: [
    UserModule
  ],
  providers: [
    BananoAccountService,
    PrismaService
  ],
  controllers: [
    BananoAccountController
  ]
})
export class AccountModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'accounts', method: RequestMethod.POST},
        {path: 'accounts', method: RequestMethod.GET},
        {path: 'accounts/:id', method: RequestMethod.GET},
        {path: 'accounts/:id', method: RequestMethod.DELETE},
        {path: 'accounts/:id', method: RequestMethod.PUT}
      )
  }
}
