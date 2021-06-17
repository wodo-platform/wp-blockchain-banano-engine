import WodoEvent from "../../../common/event/event.interface";
import BlockChainTransaction from "./blockchain.transaction";

export default interface BlockChainTransactionEvent extends WodoEvent {
    transactions:BlockChainTransaction[],
} 