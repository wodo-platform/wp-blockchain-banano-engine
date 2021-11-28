import { Get, Post, Body, Put, Delete, Param, Query, Controller, ParseIntPipe } from '@nestjs/common';
import { ApiParam, ApiBearerAuth, ApiResponse, ApiOperation, ApiTags, ApiQuery, } from '@nestjs/swagger';
import { BlockchainWallet } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet';
import { BananoWalletCreateDto } from '../../dto//wallet/banano.wallet.create.dto';
import { BananoWalletCreateWithSeed } from '../../dto//wallet/banano.wallet.create.w.seed';
import { BananoWalletDto } from '../../dto//wallet/banano.wallet.dto';
import { BananoWalletService } from './banano.wallet.service';


@ApiBearerAuth()
@ApiTags('banano-wallets')
@Controller('banano-wallets')
export class BananoWalletController {

  constructor(
    private readonly bananoWalletService: BananoWalletService) { }

  @ApiOperation({ summary: 'Create wallet' })
  @ApiResponse({ status: 201, description: 'The wallet has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  //@UsePipes(new ValidationPipe())
  @Post()
  async createWallet(@Body() walletDto: BananoWalletCreateDto): Promise<BlockchainWallet> {
    const wallet:BlockchainWallet = await this.bananoWalletService.createWallet(walletDto.userId, walletDto);
    return wallet;
  }

  @ApiOperation({ summary: 'Create wallet with seed' })
  @ApiResponse({ status: 201, description: 'The wallet has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post("seed")
  async createWalletWithSeed(@Body() walletDto: BananoWalletCreateWithSeed): Promise<BlockchainWallet>{
    const wallet:BlockchainWallet = await this.bananoWalletService.createWalletWithSeed(walletDto.userId, walletDto);
    return wallet;
  }

}