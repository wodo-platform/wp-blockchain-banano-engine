import { Test } from '@nestjs/testing';
import { TransactionController } from '../../controller/transaction/transaction.controller';
import { TransactionService } from '../../service/transaction/transaction.service';
import { UserModule } from '../../module/user.module';
import { PrismaService } from '../../service/prisma.service';
import { TransactionHistory } from '../../dto/transaction/transactionhistory.dto';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [TransactionController],
      providers: [TransactionService, PrismaService],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionController = module.get<TransactionController>(TransactionController);
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions : any[] = [];
      const createTransaction = (id,sender,receiver,anount) => {
        return new TransactionHistory(id,sender,receiver,anount,null);
      };
      transactions.push(createTransaction(1,1,2,1000));
      transactions.push(createTransaction(1,2,1,500));

      jest.spyOn(transactionService, 'findAll').mockImplementation(() => Promise.resolve(transactions));
      
      const findAllResult = await transactionController.findAll();
      expect(findAllResult).toBe(transactions);
    });
  });
});