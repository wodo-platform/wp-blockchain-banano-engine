import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TaskManager } from './task.manager.service';
import { BananoBlockchainModule } from '../blockchain/banano.blockchain.module';
import { UtilModule } from '../util/util.module';
import { BananoApiModule } from '../banano/banano.api.module';


@Module({
  imports: [ 
    UtilModule,
    BananoApiModule,
    BananoBlockchainModule
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