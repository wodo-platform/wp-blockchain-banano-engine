import { TransactionHistory } from '.prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import AssetType, { ASSET_BANANO } from '../../common/asset.type';
import BananoTransaction from '../blockchain/model/banano.transaction';
import BlockChainTransaction from '../blockchain/model/blockchain.transaction';
import User from '../user/model/user';
import PaymentNotification from '../notification/model/payment.notification';
import { PaymentNotificationService } from '../notification/payment.notification.service';
import { TransactionHistoryCreateParams } from '../transaction/model/transaction.history.create.params';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import PaymentReceivePendingParams from './model/payment.receive.pending.params';
import { PaymentBananoService } from './payment.banano.service';
import PaymentServiceInterface from './payment.service.interface';
import {UtilService} from '../util/util.service'
import PaymentSendParams from './model/payment.send.params';


@Injectable()
export class PaymentService implements PaymentServiceInterface {

    private readonly logger = new Logger(PaymentService.name);

    constructor(private paymentBananoService: PaymentBananoService,
        private userService: UserService,
        private transactionService: TransactionService,
        private paymentNotificationService:PaymentNotificationService,
        private utilService:UtilService) {
    }

    async send(paymentSendParams: PaymentSendParams): Promise<any> {

        this.logger.debug(`sending payment[${JSON.stringify(paymentSendParams)}]`);

        let toAccountAddress = paymentSendParams.toAccountAddress;
        // cache house account
        /*if(PaymentBananoService.houseAccountAddress == toAccountAddress) {

        }*/
        let receiver: User = await this.userService.findUserByAccountAddressWithChilds(toAccountAddress);
        if(!(receiver)) {
            throw new Error(`Receiver user can not be found by account[${toAccountAddress}]`);
        }
        if (!(receiver.wallets)) {
            throw new Error(`Receiver user [${receiver.username}] does not have any wallet defined..`);
        }
        let receiverAccountId = receiver.wallets?.[0].accounts[0].id;

        // TODO: check
        let fromAddress = paymentSendParams.fromAccountAddress;
        let sender: User = await this.userService.findUserByAccountAddressWithChilds(fromAddress);
        if(!(sender)) {
            throw new Error(`Receiver user can not be found by account[${fromAddress}]`);
        }
        if (!(sender.wallets)) {
            throw new Error(`Sender user [${sender.username}] does not have any wallet defined..`);
        }
        let senderAccountId = sender.wallets?.[0].accounts[0].id;
        let seed = sender.wallets?.[0].seed;
        if (!(seed) || seed.trim().length == 0) {
            throw new Error(`User [${receiver.username}] does not have seed defined in his/her wallet..`);
        }

        let amount = paymentSendParams.amount;
        let amountBig = new BigNumber(amount);

        // TODO: inject proper blockchain payment service here...default banano..
        let asset = ASSET_BANANO;

        let response = await this.paymentBananoService.send(seed,toAccountAddress,amount);

         // TODO: validate the amount is actually received before logging the transaction history
         let transactionHistory = await this.createTransactionLog(sender.id,senderAccountId,receiver.id,receiverAccountId,asset.id,amountBig.toNumber())

         await this.sendNotification(sender.id, senderAccountId, fromAddress, receiver.id, receiverAccountId, toAccountAddress, asset, amount, transactionHistory.createdAt);
        
         return response;
    }

    public async retrievePendingTransactions(account: string, maxAccountsPending: number): Promise<BlockChainTransaction[]> {
        this.logger.debug(`retrieving pending transactions for account[${account}], max count[${maxAccountsPending}]..`);
        let pending = await this.paymentBananoService.retrievePendingTransactions(account, maxAccountsPending);
        return [pending];
    }

    public async receiveTransactionsBySeed(seed: string, maxAccountsPending: number): Promise<any[]>{
        return await this.paymentBananoService.receiveTransactionsBySeed(seed,maxAccountsPending);
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
    public async receivePendingTransactions(paymentReceiveParams: PaymentReceivePendingParams): Promise<any[]> {

        this.logger.debug(`receiving(confirming) the pending transactions for account[${paymentReceiveParams.toAccountAddress}], from account[${paymentReceiveParams.toAccountAddress}]..`);

        // TODO: inject proper blockchain payment service here...default banano..
        let asset = paymentReceiveParams.asset;

        let toAccountAddress = paymentReceiveParams.toAccountAddress;
        // cache house account
        /*if(PaymentBananoService.houseAccountAddress == toAccountAddress) {

        }*/
        let receiver: User = await this.userService.findUserByAccountAddressWithChilds(toAccountAddress);
        if(!(receiver)) {
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
        if(!(sender)) {
            throw new Error(`Receiver user can not be found by account[${fromAddress}]`);
        }
        if (!(sender.wallets)) {
            throw new Error(`Sender user [${sender.username}] does not have any wallet defined..`);
        }
        let senderAccountId = sender.wallets?.[0].accounts[0].id;

        let bananoTransaction: BananoTransaction = paymentReceiveParams.blockChainTransaction as BananoTransaction;
        let amount =  bananoTransaction.amount;

        let amountBig = this.utilService.banano.rawToBan(amount);

        let response = await this.paymentBananoService.receivePendingTransactions(seed, bananoTransaction);

        // TODO: validate the amount is actually received before logging the transaction history
        let transactionHistory = await this.createTransactionLog(sender.id,senderAccountId,receiver.id,receiverAccountId,asset.id,amountBig.toNumber())

        await this.sendNotification(sender.id, senderAccountId, fromAddress, receiver.id, receiverAccountId, toAccountAddress, asset, amount, transactionHistory.createdAt);
        
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

    async sendNotification(senderId: number, senderAccountId: number,senderAccountAddress: string,receiverId: number,receiverAccountId: number,
        receiverAccountAddress: string,asset: AssetType,amount: string,createdAt: Date): Promise<void>{

        let paymentNotification: PaymentNotification = {
            id: (new Date()).getTime()+"",
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