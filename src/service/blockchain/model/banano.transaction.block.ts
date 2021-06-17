import BananoTransaction from "./banano.transaction";
import BlockChainTransaction from "./blockchain.transaction";

export default interface BananoTransactionBlock extends BlockChainTransaction{
    accountAddress: string;
    transactions:BananoTransaction[]
} 