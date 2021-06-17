import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes,ParseIntPipe } from '@nestjs/common';
import { TransactionService } from '../../service/transaction/transaction.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Get all transaction history records' })
  @ApiResponse({ status: 200, description: 'Return all transactions history records.'})
  @Get('history')
  async findAll(): Promise<any[]> {
    return await this.transactionService.findAll();
  }

}