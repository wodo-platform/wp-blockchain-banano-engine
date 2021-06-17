import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes,ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionDto } from '../../dto/transaction';
import { PaymentService } from '../../service/payment/payment.service';
import BlockChainTransaction from '../../service/blockchain/model/blockchain.transaction';
import PaymentSendParams from '../../service/payment/model/payment.send.params';

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}


  @ApiOperation({ summary: 'Get pending transactions by account' })
  @ApiResponse({ status: 200, description: 'Return pending transactions for the given account.'})
  @Get('pending/:account')
  async pending(@Param('account')  account: string, @Query('maxSize',ParseIntPipe) maxSize: number): Promise<BlockChainTransaction[]> {
    let pendingTransactions =  await this.paymentService.retrievePendingTransactions(account,maxSize);
    return pendingTransactions;
  }

  @ApiOperation({ summary: 'Get pending transactions by account' })
  @ApiResponse({ status: 200, description: 'Return pending transactions for the given account.'})
  @Get('receive/:seed')
  async receiveTransactionsBySeed(@Param('seed') seed: string, @Query('maxSize',ParseIntPipe) maxSize: number) : Promise<any[]>{
    return await this.paymentService.receiveTransactionsBySeed(seed,maxSize);
  }

  @ApiOperation({ summary: 'Send asset' })
  @ApiResponse({ status: 201, description: 'The transaction to send the asset has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('send')
  async send(@Body() paymentSendParams: PaymentSendParams) {
    return this.paymentService.send(paymentSendParams);
  }

}