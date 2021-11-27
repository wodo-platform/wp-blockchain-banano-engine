import BigNumber from "bignumber.js";
import AssetType from "../../../common/asset.type";
import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"

/**
 * When a payment is submitted to a blockchain network, most of the time a blockchain transaction info is returned. 
 * The transaction is considered as "initiated" aka "in progress" state in this stage.
 */
export interface BananoPaymentReceivePendingParams {
    assetId: string;
    fromAccountAddress: string;
    toAccountAddress: string;
    amount: BigNumber;
    blockChainTransaction:BlockchainTransaction;
    memo: string; // todo: add this one into the generic attributes map
}