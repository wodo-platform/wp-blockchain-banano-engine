import {BananoTransaction} from "./banano.transaction";
import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"

export interface BananoTransactionBlock extends BlockchainTransaction{
    accountAddress: string;
    transactions:BananoTransaction[]
} 