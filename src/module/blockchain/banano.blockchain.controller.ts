import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes,ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BananoBlockchainService } from './banano.blockchain.service';
import {BlockchainTransaction} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction"

@ApiBearerAuth()
@ApiTags('banano-blockchain')
@Controller('banano-blockchain')
export class BananoBlockchainPaymentController {
  constructor(private readonly bananoBlockchainService: BananoBlockchainService) {}


  @ApiOperation({ summary: 'Get pending transactions by account' })
  @ApiResponse({ status: 200, description: 'Return pending transactions for the given account.'})
  @Get('pending/:account')
  async pending(@Param('account')  account: string, @Query('maxSize',ParseIntPipe) maxSize: number): Promise<BlockchainTransaction[]> {
    let pendingTransactions =  await this.bananoBlockchainService.retrievePendingTransactions(account,maxSize);
    return pendingTransactions;
  }

  @ApiOperation({ summary: 'Get pending transactions by account' })
  @ApiResponse({ status: 200, description: 'Return pending transactions for the given account.'})
  @Get('receive/:seed')
  async receiveTransactionsBySeed(@Param('seed') seed: string, @Query('maxSize',ParseIntPipe) maxSize: number) : Promise<any[]>{
    return await this.bananoBlockchainService.receiveTransactionsBySeed(seed,maxSize);
  }

  /*
  @ApiOperation({ summary: 'Send asset' })
  @ApiResponse({ status: 201, description: 'The transaction to send the asset has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('send')
  async send(@Body() paymentSendParams: PaymentSendParams) {
    return this.bananoBlockchainPaymentService.sendBlockChainTransaction
  }
*/
}