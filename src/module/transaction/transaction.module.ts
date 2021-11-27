import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../../service/prisma.service';
import { BananoApiModule } from '../banano/banano.api.module';

@Module({
  imports: [
    UserModule,
    BananoApiModule
  ],
  providers: [
    TransactionService,
    PrismaService,
  ],
  controllers: [
    TransactionController
  ],
  exports: [TransactionService]
})

export class TransactionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}
