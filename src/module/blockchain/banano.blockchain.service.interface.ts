import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"
import {BananoPaymentReceiveParams} from "./model/banano.payment.receive.params";

/**
 * internal banano payment interface to define Banano blockchain network behaviour
 */
export interface BananoPaymentServiceInterface {
    retrievePendingTransactions(account: string, maxAccountsPending: number): Promise<BlockchainTransaction>;
    receivePendingTransactions(paymentReceiveParams: BananoPaymentReceiveParams): Promise<any[]>
}