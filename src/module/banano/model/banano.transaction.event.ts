import WodoEvent from "../../../common/event/event.interface";
import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"

export interface BananoTransactionEvent extends WodoEvent {
    transactions:BlockchainTransaction[],
} 