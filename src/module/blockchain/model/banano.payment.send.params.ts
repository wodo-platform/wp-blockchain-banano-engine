import BigNumber from "bignumber.js";

/**
 * Generic interfance to define prameters in a payment request. A payment request can be executed by different blockchain networks based on the given 
 * assetId in the request.
 */
export interface BananoPaymentSendParams {
    senderId: string;
    receiverId: string;
    assetId: string;
    fromAccountAddress: string,
    toAccountAddress: string,
    amount: string
}