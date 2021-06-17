import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes,ParseIntPipe } from '@nestjs/common';
import {ApiParam, ApiBearerAuth, ApiResponse, ApiOperation, ApiTags, ApiQuery,} from '@nestjs/swagger';
import { WalletDto, WalletGenerateWithSeed } from '../../dto/wallet';
import { WalletCreateDto } from '../../dto/wallet/wallet.create.dto';
import { WalletPersistenceService } from '../../service/wallet/wallet.persistence.service';
import { WalletService } from '../../service/wallet/wallet.service';


@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallets')
export class WalletController {

  constructor(private readonly walletPerssitenceService: WalletPersistenceService,
    private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Find wallets. If query string parameters are provided, the results will be filtered by the given query string params.' })
  @ApiQuery({name:"name", description: "Filter results by the matching wallet name.",required : false,allowEmptyValue:false,})
  @ApiResponse({ status: 200, description: 'Return wallets found ..'})
  @Get()
  async findAll(@Query('name') name: string): Promise<WalletDto[]> {
    let wallets;
    if(name) {
      wallets =  await this.walletPerssitenceService.findAllWeallets();
    }
    else{
      wallets =  await this.walletPerssitenceService.findAllWeallets();
    }
    return wallets;
  }

  @ApiOperation({ summary: 'Create wallet' })
  @ApiResponse({ status: 201, description: 'The wallet has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  //@UsePipes(new ValidationPipe())
  @Post()
  async createWallet(@Body() walletDto : WalletCreateDto) {
    const wallet =  this.walletService.createWallet(walletDto.userId,walletDto);
    return wallet;
  }

  @ApiOperation({ summary: 'Genereate wallet' })
  @ApiResponse({ status: 201, description: 'The wallet has been successfully generated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  //@UsePipes(new ValidationPipe())
  @Post('generate')
  async generateWallet(@Body('userId',ParseIntPipe) userId : number) {
    const wallet =  await this.walletService.generateWallet(userId);
    return wallet;
  }

  @ApiOperation({ summary: 'Genereate wallet with Seed' })
  @ApiResponse({ status: 201, description: 'The wallet has been successfully generated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  //@UsePipes(new ValidationPipe())
  @Post('seed/generate/')
  async generateWalletWithSeed(@Body() userWithSeed : WalletGenerateWithSeed) {
    const wallet =  await this.walletService.generateWalletWithSeed(userWithSeed.userId,userWithSeed.seed);
    return wallet;
  }

  
}