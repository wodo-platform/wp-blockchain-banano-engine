 export class TransactionDto {

  
    constructor() {};

    /*constructor(userId: String, assetId: String, from: String, to: String, amount: number, memo: String) {
        this.userId = userId;
        this.assetId = assetId;
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.memo = memo;
    }*/

    userId: string;
    assetId: string;
    from: string;
    to: string;
    amount: string;
    memo: string;
}