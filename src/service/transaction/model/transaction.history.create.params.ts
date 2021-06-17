export interface TransactionHistoryCreateParams {
    senderId: number;
    senderAccountId: number;
    receiverId: number;
    receiverAccountId: number;
    assetId: number;
    amount: number;
    createdAt: Date;
  }