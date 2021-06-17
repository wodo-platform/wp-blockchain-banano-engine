import BigNumber from "bignumber.js";
import AssetType from "../../../common/asset.type";
import BlockChainTransaction from "../../blockchain/model/blockchain.transaction";

export default interface PaymentReceiveParams {
    senderId: string;
    receiverId: string;
    asset: AssetType;
    fromAccountAddress: string;
    toAccountAddress: string;
    amount: BigNumber;
    blockChainTransaction:BlockChainTransaction;
    memo: string;
}