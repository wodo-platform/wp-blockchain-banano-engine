import { TransactionHistory } from '.prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import AssetType, { ASSET_BANANO } from '../../common/asset.type';
import { BananoTransaction } from '../banano/model/banano.transaction';
import { BlockchainTransaction } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"
import User from '../user/model/user';
import PaymentNotification from '../notification/model/payment.notification';
import { PaymentNotificationService } from '../notification/payment.notification.service';
import { TransactionHistoryCreateParams } from '../transaction/model/transaction.history.create.params';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { BananoPaymentReceivePendingParams } from './model/banano.payment.receive.pending.params';
import { BananoBlockchainTransactionService } from './banano.blockchain.transaction.service';
import { BananoPaymentServiceInterface } from './banano.blockchain.service.interface';
import { UtilService } from '../util/util.service'
import { BlockchainApi } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.api'
import { BlockchainWallet } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet';
import { BlockchainTransactionParams } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction.params';
import { EventListenerInterface } from "@wodo-platform/wp-message-broker-api/dist/api/messagebroker/listener/event.listener.interface";
import { WodoEvent } from "@wodo-platform/wp-api-definitions/dist/api/event/wodo.event";
import { EVENT_BLOCKCHAIN_TRANSACTION_SEND, EVENT_BLOCKCHAIN_TRANSACTION_INITIATED } from "@wodo-platform/wp-api-definitions/dist/api/event/wodo.event.catalog";
import { EVENT_SOURCE_BLOCKCHAIN_TRANSACTION_INITIATED, EVENT_SOURCE_BLOCKCHAIN_TRANSACTION_SEND } from "@wodo-platform/wp-api-definitions/dist/api/event/wodo.event.source.catalog";
import { BananoBlockchainServiceUtil } from './banano.blockchain.service.util';
import { MessageBroker } from "@wodo-platform/wp-message-broker-api/dist/api/messagebroker/message.broker.api";
import { MessageBrokerFactory } from "@wodo-platform/wp-message-broker-api/dist/api/messagebroker/message.broker.factory";
import { WalletType } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type';


/**
 * Primary payment service implementation for Banano network. The service implements fundamental BlockchainApi
 * functionality as well as event driven messaging functionality.
 * 
 * 
 */
@Injectable()
export class BananoBlockchainService implements BananoPaymentServiceInterface, EventListenerInterface, BlockchainApi {

    private readonly logger = new Logger(BananoBlockchainService.name);

    private messageBroker: MessageBroker;

    constructor(private bananoBlockchainTransactionService: BananoBlockchainTransactionService,
        private transactionService: TransactionService,
        private paymentNotificationService: PaymentNotificationService,
        private utilService: UtilService) {
            this.messageBroker = MessageBrokerFactory.defaultMessageBrokerWithOptions();
            this.messageBroker.addSubscriber(EVENT_BLOCKCHAIN_TRANSACTION_SEND, EVENT_SOURCE_BLOCKCHAIN_TRANSACTION_SEND, this);
            this.messageBroker.addPublisher(EVENT_BLOCKCHAIN_TRANSACTION_INITIATED, EVENT_SOURCE_BLOCKCHAIN_TRANSACTION_INITIATED);
            this.logger.debug("instantiated a new instance of "+BananoBlockchainService.name);
    }

    public getEventListenerName(): string {
        return BananoBlockchainService.name;
    };

    /**
     * 
     * @param wodoEvent 
     */
    eventReceived = async (wodoEvent: WodoEvent): Promise<void> => {
        this.logger.debug("eventReceived:[" + JSON.stringify(wodoEvent) + "]");
        if (wodoEvent.wodoEventName.name == EVENT_BLOCKCHAIN_TRANSACTION_SEND.name) {
            try {

                let params: BlockchainTransactionParams = BananoBlockchainServiceUtil.convertTransactionSendEvent2BlockChainTransactionParams(wodoEvent);

                let transactionId: string = await this.sendBlockchainTransaction(params);

                let transactionInitiatedEvent: WodoEvent = BananoBlockchainServiceUtil.newBlockchainTransactionInitiatedEvent(params, transactionId);

                this.publishTransactionInitiatedEvent(transactionInitiatedEvent);

            } catch (error) {
                throw error;
            }
        }
    }

    async publishTransactionInitiatedEvent(wodoEvent: WodoEvent): Promise<void> {
        this.logger.debug("publishTransactionInitiatedEvent(wodoEvent) -> " + JSON.stringify(wodoEvent));
        await this.messageBroker.publisEvent(wodoEvent, EVENT_SOURCE_BLOCKCHAIN_TRANSACTION_INITIATED);
    }

    public async sendBlockchainTransaction(params: BlockchainTransactionParams): Promise<string> {
        // TODO: validate the dto here
        this.logger.debug(`sending blockchain transaction[${JSON.stringify(params)}]`);

        let seed: string = params.attributes.get("seed");
        let fromAccountAddress: string = params.fromAccountAddress;
        let toAccountAddress: string = params.toAccountAddress;
        let amount: string = params.amount;

        // TODO: extra validation here?
        /*let receiver: User = await this.userService.findUserByAccountAddressWithChilds(toAccountAddress);
        if (!(receiver)) {
            throw new Error(`Receiver user can not be found by account[${toAccountAddress}]`);
        }
        if (!(receiver.wallets)) {
            throw new Error(`Receiver user [${receiver.username}] does not have any wallet defined..`);
        }
        let receiverAccountId = receiver.wallets?.[0].accounts[0].id;*/

        // TODO: extra validation here? We are getting seed from the interface params now
        /*let sender: User = await this.userService.findUserByAccountAddressWithChilds(fromAccountAddress);
        if (!(sender)) {
            throw new Error(`Receiver user can not be found by account[${fromAccountAddress}]`);
        }
        if (!(sender.wallets)) {
            throw new Error(`Sender user [${sender.username}] does not have any wallet defined..`);
        }
        let senderAccountId = sender.wallets?.[0].accounts[0].id;
        let seed = sender.wallets?.[0].seed;
        if (!(seed) || seed.trim().length == 0) {
            throw new Error(`User [${sender.username}] does not have seed defined in his/her wallet..`);
        }*/

        // TODO: make sure we do not block nodejs main thread
        /*
        this.paymentBananoService.send(seed, toAccountAddress, amount).then((reponse: any) => {
            return reponse;
        }).catch(e => {
            this.logger.error("could not send the banano transaction.", e);
        }) */

        let response = await this.bananoBlockchainTransactionService.send(seed, toAccountAddress, amount);

        // TODO: validate the amount is actually received before logging the transaction history
        // make this part event based
        // let amount = paymentSendParams.amount;
        //let amountBig = new BigNumber(amount);
        // TODO: inject proper blockchain payment service here...default banano..
        //let asset = ASSET_BANANO;
        //let transactionHistory = await this.createTransactionLog(sender.id, senderAccountId, receiver.id, receiverAccountId, asset.id, amountBig.toNumber())
        //await this.sendNotification(sender.id, senderAccountId, fromAddress, receiver.id, receiverAccountId, toAccountAddress, asset, amount, transactionHistory.createdAt);

        this.logger.debug("transaction has been initated with id:"+response);
        return response;
    }

    public async retrievePendingTransactions(account: string, maxAccountsPending: number): Promise<BlockchainTransaction[]> {
        this.logger.debug(`retrieving pending transactions for account[${account}], max count[${maxAccountsPending}]..`);
        let pending = await this.bananoBlockchainTransactionService.retrievePendingTransactions(account, maxAccountsPending);
        return [pending];
    }

    public async receiveTransactionsBySeed(seed: string, maxAccountsPending: number): Promise<any[]> {
        return await this.bananoBlockchainTransactionService.receiveTransactionsBySeed(seed, maxAccountsPending);
    }

    /**
     *  {
     *       "blocks": {
     *           "ban_3fbbbg4edefr1fjbkhjke37s58tw17t6ct7txrw4yf1ijoz1ythu8c4wsc5b": {
     *               "5B66F60A48008A3BE515433B400783F644B565525E39FB2884489777F1B21C58": {
     *                   "amount": "100000000000000000000000000000",
     *                   "source": "ban_13h7wp66xciohnctxxfgh5971a6wtopp4xwksod7566k7kpom86ygaf6gg77"
     *               },
     *               "CBCBC4D2DD756E3CCB64767F2B9FBF68B04967D94AB845691C0E1066C57B6C85": {
     *                   "amount": "100000000000000000000000000000",
     *                   "source": "ban_3wj57jjikejkpu4hdg9picktjbqqja9eusxz5fh145grbebf5jbjshhtznfi"
     *               }
     *           }
     *       }
     *   }
     * 
     * @param paymentReceiveParams 
     * @returns 
     */
    public async receivePendingTransactions(paymentReceiveParams: BananoPaymentReceivePendingParams): Promise<any[]> {

        this.logger.debug(`receiving(confirming) the pending transactions for account[${paymentReceiveParams.toAccountAddress}], from account[${paymentReceiveParams.toAccountAddress}]..`);

        // TODO: inject proper blockchain payment service here...default banano..
        let asset = paymentReceiveParams.assetId;

        let toAccountAddress = paymentReceiveParams.toAccountAddress;
        // cache house account
        /*if(PaymentBananoService.houseAccountAddress == toAccountAddress) {

        }*/
        
        
        /*
        let receiver: User = await this.userService.findUserByAccountAddressWithChilds(toAccountAddress);
        if (!(receiver)) {
            throw new Error(`Receiver user can not be found by account[${toAccountAddress}]`);
        }
        if (!(receiver.wallets)) {
            throw new Error(`Receiver user [${receiver.username}] does not have any wallet defined..`);
        }
        let seed = receiver.wallets?.[0].seed;
        if (!(seed) || seed.trim().length == 0) {
            throw new Error(`User [${receiver.username}] does not have seed defined in his/her wallet..`);
        }
        let receiverAccountId = receiver.wallets?.[0].accounts[0].id;

        // TODO: check
        let fromAddress = paymentReceiveParams.fromAccountAddress;
        let sender: User = await this.userService.findUserByAccountAddressWithChilds(fromAddress);
        if (!(sender)) {
            throw new Error(`Receiver user can not be found by account[${fromAddress}]`);
        }
        if (!(sender.wallets)) {
            throw new Error(`Sender user [${sender.username}] does not have any wallet defined..`);
        }
        let senderAccountId = sender.wallets?.[0].accounts[0].id;

        */

        let bananoTransaction: BananoTransaction = paymentReceiveParams.blockChainTransaction as BananoTransaction;
        let amount = bananoTransaction.amount;

        let amountBig = this.utilService.banano.rawToBan(amount);

        let seed:string = BananoBlockchainTransactionService.houseAccountSeed;
        let response = await this.bananoBlockchainTransactionService.receivePendingTransactions(seed, bananoTransaction);

        // TODO: validate the amount is actually received before logging the transaction history
        //let transactionHistory = await this.createTransactionLog(sender.id, senderAccountId, receiver.id, receiverAccountId, asset.id, amountBig.toNumber())

        //await this.sendNotification(sender.id, senderAccountId, fromAddress, receiver.id, receiverAccountId, toAccountAddress, asset, amount, transactionHistory.createdAt);

        return response;
    }

    async createTransactionLog(senderId: number, senderAccountId: number, receiverId: number, receiverAccountId: number, assetId: number, amount: number): Promise<TransactionHistory> {
        // TODO: maybe actual transaction date that occurs on the blockchain should be considered as createdAt date.
        // for banano network, it is the moment the receiver(this application) confirms transcation. do double check..
        let transactionHistory: TransactionHistoryCreateParams = {
            senderId: senderId,
            senderAccountId: senderAccountId,
            receiverId: receiverId,
            receiverAccountId: receiverAccountId,
            assetId: assetId,
            amount: amount,
            createdAt: new Date()
        }
        return await this.transactionService.createTransactionHistoryRecord(transactionHistory);
    }

    async sendNotification(senderId: number, senderAccountId: number, senderAccountAddress: string, receiverId: number, receiverAccountId: number,
        receiverAccountAddress: string, asset: AssetType, amount: string, createdAt: Date): Promise<void> {

        let paymentNotification: PaymentNotification = {
            id: (new Date()).getTime() + "",
            senderId: senderId,
            senderAccountId: senderAccountId,
            senderAccountAddress: senderAccountAddress,
            receiverId: receiverId,
            receiverAccountId: receiverAccountId,
            receiverAccountAddress: receiverAccountAddress,
            asset: asset,
            amount: amount,
            createdAt: createdAt
        }
        await this.paymentNotificationService.sendPaymentNotification(paymentNotification);
    }
}