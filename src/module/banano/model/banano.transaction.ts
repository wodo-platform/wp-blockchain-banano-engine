import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"
export interface BananoTransaction  extends BlockchainTransaction {
    hash:string;
    amount:string;
    source:string;
} 