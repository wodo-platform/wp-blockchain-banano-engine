export class TransactionHistoryDto {

    constructor(id,sender,receiver,amount,createdAt) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.createdAt = createdAt;
    }
     id: number;
     sender: number;
     receiver: number;
     amount: number;
     createdAt: Date;
  }