import { Injectable, Logger} from '@nestjs/common';
import { Cron, CronExpression,SchedulerRegistry } from '@nestjs/schedule';
import { BananoTransactionEvent } from '../banano/model/banano.transaction.event';
import { BananoBlockchainService } from '../blockchain/banano.blockchain.service';
import { BananoBlockchainTransactionService } from '../blockchain/banano.blockchain.transaction.service';
import { BananoTransactionBlock } from '../banano/model/banano.transaction.block';
import { BananoBlockchainEventListenerService } from '../blockchain/banano.blockchain.event.listener.service';

@Injectable()
export class TaskManager {

    private readonly logger = new Logger(TaskManager.name);

    constructor(private bananoBlockchainEventListenerService: BananoBlockchainEventListenerService,
        private bananoBlockchainService: BananoBlockchainService,
        private schedulerRegistry: SchedulerRegistry){

    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    retrieveBananoTransactions() {
        this.logger.debug(`running the scheduled task to retrive banano transactions for house account[${BananoBlockchainTransactionService.houseAccountAddress}].start time:`+new Date());
        let transCount = 0;
        this.bananoBlockchainService.retrievePendingTransactions(BananoBlockchainTransactionService.houseAccountAddress,10).then( data => {
                let pendingTransactionsBlocks:BananoTransactionBlock[] = data as BananoTransactionBlock[];
                if(pendingTransactionsBlocks && pendingTransactionsBlocks[0].transactions && pendingTransactionsBlocks[0].transactions.length > 0) {
                    let pendingTransactionsBlock = pendingTransactionsBlocks[0]; // TODO: assume there is only one large banano transaction block for the single account.
                    transCount = pendingTransactionsBlock.transactions.length;
                    let event:BananoTransactionEvent = {
                        transactions: [pendingTransactionsBlock],
                        eventType : "blockhain_transaction_received"
                    }
                    this.bananoBlockchainEventListenerService.eventReceived(event);
                }
            } 
        ).catch(error => {
            this.logger.debug(`Scheduled task: An error occurred while retrive banano transactions for house account[${BananoBlockchainTransactionService.houseAccountAddress}].Error:${error}`);
            }
        );
        this.logger.debug(`completed the scheduled task to retrive banano transactions for house account[${BananoBlockchainTransactionService.houseAccountAddress}].transaction count[${transCount}]. End time:`+new Date());
    }

}