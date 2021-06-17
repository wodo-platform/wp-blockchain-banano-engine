import BigNumber from "bignumber.js";

export default interface PaymentSendParams {
    senderId: string;
    receiverId: string;
    asssetId: string;
    fromAccountAddress: string,
    toAccountAddress: string,
    amount: string
}