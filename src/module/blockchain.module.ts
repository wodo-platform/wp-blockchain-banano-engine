import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UtilModule } from './util.module';
import { BlockchainEventListenerService } from '../service/blockchain/blockchain.event.listener.service';
import { PaymentService } from '../service/payment/payment.service';
import { PaymentModule } from './payment.module';


@Module({
  imports: [ 
    UtilModule,
    PaymentModule
  ],
  providers: [
    BlockchainEventListenerService,
  ],
  controllers: [
  ],
  exports: [BlockchainEventListenerService]
})
export class BlockChainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
   
  }
}