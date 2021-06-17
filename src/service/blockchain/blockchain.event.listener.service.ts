import { Injectable,Logger} from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ASSET_BANANO } from '../../common/asset.type';
import { BLOCKCHAIN_TRANSACTION_RECEIVED } from '../../common/event/event.interface';
import PaymentReceivePendingParams from '../payment/model/payment.receive.pending.params';
import { PaymentService } from '../payment/payment.service';
import BananoTransaction from './model/banano.transaction';
import BananoTransactionBlock from './model/banano.transaction.block';
import BlockChainTransactionEvent from './model/blockchain.transaction.event';


@Injectable()
export class BlockchainEventListenerService {

    private readonly logger = new Logger(BlockchainEventListenerService.name);

    constructor(private paymentService:PaymentService) {

    }

    public retriveEvents() {

    }

    public async eventReceived(event:BlockChainTransactionEvent) : Promise<void> {
        this.logger.debug(JSON.stringify(event));
        try {
            if( BLOCKCHAIN_TRANSACTION_RECEIVED.eventType == event.eventType) {
                let transactions = event.transactions;
                transactions.forEach(transaction => {
                    let bananoTransactionBlock:BananoTransactionBlock = transaction as BananoTransactionBlock;
                    let toAddress = bananoTransactionBlock.accountAddress;
                    let bananoTransactions = bananoTransactionBlock.transactions;
                    bananoTransactions.forEach( async (bananoTransactions) => {
    
                        let bananoTransaction:BananoTransaction = {
                            hash:bananoTransactions.hash,
                            amount:bananoTransactions.amount,
                            source:bananoTransactions.source
                        }
    
                        let paymentReceiveParams: PaymentReceivePendingParams = {
                            asset: ASSET_BANANO,
                            fromAccountAddress: bananoTransactions.source,
                            toAccountAddress: toAddress,
                            amount: new BigNumber(bananoTransactions.amount),
                            blockChainTransaction:bananoTransaction,
                            memo: "generasted by the transaction poll task"
                        }
                        await this.paymentService.receivePendingTransactions(paymentReceiveParams);
                    });
                    
                   
                });
            }
            else{
                this.logger.error("unsopported blockchain event received:"+JSON.stringify(event));
            }
        } catch (error) {
            this.logger.error(`An error occurred while processing event[${event}]. Error [${error}]`);
        }
        
        
    }

}
