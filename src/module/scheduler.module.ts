import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TaskManager } from '../service/scheduler/task.manager.service';
import { BlockChainModule } from './blockchain.module';
import { PaymentModule } from './payment.module';
import { UtilModule } from './util.module';


@Module({
  imports: [ 
    UtilModule,
    BlockChainModule,
    PaymentModule
  ],
  providers: [
    TaskManager
  ],
  controllers: [
  ],
  exports: [TaskManager]
})
export class SchadulerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
   
  }
}