import { Injectable, Logger} from '@nestjs/common';
import { Cron, CronExpression,SchedulerRegistry } from '@nestjs/schedule';
import { BlockchainEventListenerService } from '../blockchain/blockchain.event.listener.service';
import BlockChainTransactionEvent from '../blockchain/model/blockchain.transaction.event';
import { PaymentService } from '../payment/payment.service';
import { PaymentBananoService } from '../payment/payment.banano.service';
import BananoTransactionBlock from '../blockchain/model/banano.transaction.block';

@Injectable()
export class TaskManager {

    private readonly logger = new Logger(TaskManager.name);
    constructor(private blockchainEventListenerService: BlockchainEventListenerService,
        private paymentService: PaymentService,
        private schedulerRegistry: SchedulerRegistry){

    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    retrieveBananoTransactions() {
        this.logger.debug(`running the scheduled task to retrive banano transactions for house account[${PaymentBananoService.houseAccountAddress}].start time:`+new Date());
        let transCount = 0;
        this.paymentService.retrievePendingTransactions(PaymentBananoService.houseAccountAddress,10).then( data => {
                let pendingTransactionsBlocks:BananoTransactionBlock[] = data as BananoTransactionBlock[];
                if(pendingTransactionsBlocks && pendingTransactionsBlocks[0].transactions && pendingTransactionsBlocks[0].transactions.length > 0) {
                    let pendingTransactionsBlock = pendingTransactionsBlocks[0]; // TODO: assume there is only one large banano transaction block for the single account.
                    transCount = pendingTransactionsBlock.transactions.length;
                    let event:BlockChainTransactionEvent = {
                        transactions: [pendingTransactionsBlock],
                        eventType : "blockhain_transaction_received"
                    }
                    this.blockchainEventListenerService.eventReceived(event);
                }
            } 
        ).catch(error => {
            this.logger.debug(`Scheduled task: An error occurred while retrive banano transactions for house account[${PaymentBananoService.houseAccountAddress}].Error:${error}`);
            }
        );
        this.logger.debug(`completed the scheduled task to retrive banano transactions for house account[${PaymentBananoService.houseAccountAddress}].transaction count[${transCount}]. End time:`+new Date());
    }

}