import { Get, Post, Body, Put, Delete, Query, Param, Controller, HttpCode } from '@nestjs/common';
import { BananoAccountService } from './banano.account.service';
import { AccountsRO, AccountRO } from './account.interface';
import { User } from '../../decorator/user/user.decorator';
import {ApiBearerAuth,ApiResponse,ApiOperation, ApiTags,} from '@nestjs/swagger';
import { BananoAccount } from './model/banano.account';
import { BananoAccountCreateDto } from 'src/dto/account/banano.account.create.dto';

@ApiBearerAuth()
@ApiTags('banano-accounts')
@Controller('banano-accounts')
export class BananoAccountController {

  constructor(private readonly accountService: BananoAccountService) {}


  @ApiOperation({ summary: 'Create account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body() accountData: BananoAccountCreateDto) {
    return await this.accountService.createWalletAccount(userId,accountData.walletId,accountData.name,accountData.description,accountData.enabled);
  }

  @ApiOperation({ summary: 'Create account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('secret')
  async createWithSecrets(@User('id') userId: number, @Body() accountData: BananoAccountCreateDto) {
    return await this.accountService.createWalletAccountWithSecrets(userId,accountData.walletId,accountData.name,
      accountData.description,accountData.address,accountData.secret,accountData.publicKey,accountData.enabled);
  }


}