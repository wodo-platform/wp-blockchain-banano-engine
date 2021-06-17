import { Injectable,Logger} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionHistory } from '@prisma/client';
import { TransactionHistoryCreateParams } from './model/transaction.history.create.params';

@Injectable()
export class TransactionService {

  private readonly logger = new Logger(TransactionService.name);

  constructor(private prisma: PrismaService) {
  }

  /**public async pending(account: string, maxAccountsPending: number): Promise<any[]> {
    let pending =  await this.bananoApiService.pending(account,maxAccountsPending);
    return pending;
  }

  public async receive(privateKey: string, maxAccountsPending: number): Promise<any[]>{
    return await this.bananoApiService.receive(privateKey,maxAccountsPending);
  }*/


  async createTransactionHistoryRecord(transactionHistory:TransactionHistoryCreateParams) : Promise<any> {
    this.logger.debug(`creating transaction hsitory log[${JSON.stringify(transactionHistory)}]`);

    const data = {
      senderId: transactionHistory.senderId,
      senderAccountId: transactionHistory.senderAccountId,
      receiverId: transactionHistory.receiverId,
      receiverAccountId: transactionHistory.receiverAccountId,
      assetId: transactionHistory.assetId,
      amount: transactionHistory.amount,
      createdAt: transactionHistory.createdAt
    }

    let response = await this.prisma.transactionHistory.create( 
      { 
        data
      }
    );
    return response;
  }

  async findAll(): Promise<TransactionHistory[]> {
    this.logger.debug(`retrieveing transaction history records..`);

    const res = await this.prisma.transactionHistory.findMany();
    //const transactionHistories = res.map((t: TransactionHistory) => t.id);

    this.logger.debug(`found[`+res ? 0 : res.length+`] transaction history records..`);
    return res;
  }
}
