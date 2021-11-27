import { Get, Post, Body, Put, Delete, Query, Param, Controller, HttpCode } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountsRO, AccountRO } from './account.interface';
import { User } from '../../decorator/user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import Account from './model/account';
import { BananoAccountCreateDto } from 'src/dto/account';

@ApiBearerAuth()
@ApiTags('banano-accounts')
@Controller('banano-accounts')
export class AccountController {

  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Get all banano accounts' })
  @ApiResponse({ status: 200, description: 'Return all banano accounts.'})
  @Get()
  async findAll(@User('id') userId: number, @Query() query): Promise<Account[]> {
    return await this.accountService.findAll(userId, query);
  }

  @Get(':id')
  async findOne(@User('id') userId: number, @Param('id') id): Promise<Account> {
    return await this.accountService.findOne(userId, id);
  }


  @ApiOperation({ summary: 'Create account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body() accountData: BananoAccountCreateDto) {
    return this.accountService.create(userId, accountData);
  }

  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(@User('id') userId: number, @Param() params, @Body('account') accountData: BananoAccountCreateDto) {
    // Todo: update slug also when title gets changed
    return this.accountService.update(userId, params.id, accountData);
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 204, description: 'The account has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async delete(@User('id') userId: number, @Param() params) {
    return this.accountService.delete(userId,params.id);
  }

}