import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AccountController } from '../controller/account/account.controller';
import { AccountService } from '../service/account/account.service';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { UserModule } from './user.module';
import { PrismaService } from '../service/prisma.service';

@Module({
  imports: [
    UserModule
  ],
  providers: [
    AccountService,
    PrismaService
  ],
  controllers: [
    AccountController
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
