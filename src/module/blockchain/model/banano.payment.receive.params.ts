import BigNumber from "bignumber.js";
import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"

/**
 * This interface defines parameters of a completed transaction
 */
export interface BananoPaymentReceiveParams {
    senderId: string;
    receiverId: string;
    assetId: string;
    fromAccountAddress: string;
    toAccountAddress: string;
    amount: BigNumber;
    blockChainTransaction:BlockchainTransaction;
    memo: string;
}