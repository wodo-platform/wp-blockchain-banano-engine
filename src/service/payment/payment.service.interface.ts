import BlockChainTransaction from "../blockchain/model/blockchain.transaction";
import PaymentReceiveParams from "./model/payment.receive.params";


export default interface PaymentServiceInterface {
    retrievePendingTransactions(account: string, maxAccountsPending: number): Promise<BlockChainTransaction>;
    receivePendingTransactions(paymentReceiveParams: PaymentReceiveParams): Promise<any[]>
}