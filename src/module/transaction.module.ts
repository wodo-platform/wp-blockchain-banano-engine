import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user.module';
import { TransactionService } from '../service/transaction/transaction.service';
import { TransactionController } from '../controller/transaction/transaction.controller';
import { PrismaService } from '../service/prisma.service';
import { BananoModule } from './banano.module';

@Module({
  imports: [
    UserModule,
    BananoModule
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
