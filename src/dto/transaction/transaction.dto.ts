 export class TransactionDto {

  
    constructor() {};

    /*constructor(userId: String, asssetId: String, from: String, to: String, amount: number, memo: String) {
        this.userId = userId;
        this.asssetId = asssetId;
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.memo = memo;
    }*/

    userId: string;
    asssetId: string;
    from: string;
    to: string;
    amount: string;
    memo: string;
}