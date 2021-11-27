import { Injectable,Logger} from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ASSET_BANANO } from '../../common/asset.type';
import { BLOCKCHAIN_TRANSACTION_RECEIVED } from '../../common/event/event.interface';
import { BananoBlockchainService } from './banano.blockchain.service';
import {BananoTransaction} from '../banano/model/banano.transaction';
import {BananoTransactionBlock} from '../banano/model/banano.transaction.block';
import { BananoTransactionEvent } from '../banano/model/banano.transaction.event';
import { BananoPaymentReceivePendingParams } from './model/banano.payment.receive.pending.params';


@Injectable()
export class BananoBlockchainEventListenerService {

    private readonly logger = new Logger(BananoBlockchainEventListenerService.name);

    constructor(private bananoBlockchainService:BananoBlockchainService) {

    }

    public async eventReceived(event:BananoTransactionEvent) : Promise<void> {
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
    
                        let paymentReceiveParams: BananoPaymentReceivePendingParams = {
                            assetId: ASSET_BANANO.id+"", // TODO: fix the param types
                            fromAccountAddress: bananoTransactions.source,
                            toAccountAddress: toAddress,
                            amount: new BigNumber(bananoTransactions.amount),
                            blockChainTransaction:bananoTransaction,
                            memo: "generated by the transaction poll task"
                        }
                        await this.bananoBlockchainService.receivePendingTransactions(paymentReceiveParams);
                    });
                });
            }
            else{
                // TODO: handle error properly
                this.logger.error("unsopported blockchain event received:"+JSON.stringify(event));
            }
        } catch (error) {
            // TODO: handle error properly
            this.logger.error(`An error occurred while processing event[${event}]. Error [${error}]`);
        }
    }
}