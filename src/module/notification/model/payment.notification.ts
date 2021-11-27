import BigNumber from "bignumber.js";
import AssetType from "../../../common/asset.type";

export default interface PaymentNotification {
    id:string;
    senderId: number;
    senderAccountId: number;
    senderAccountAddress: String;
    receiverId: number;
    receiverAccountId: number;
    receiverAccountAddress: string;
    asset: AssetType;
    amount: string;
    createdAt: Date;
}