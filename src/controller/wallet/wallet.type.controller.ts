import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes,ParseIntPipe } from '@nestjs/common';
import {ApiParam, ApiBearerAuth, ApiResponse, ApiOperation, ApiTags, ApiQuery,} from '@nestjs/swagger';
import { WalletTypeService } from '../../service/wallet/wallet.type.service';
@ApiBearerAuth()
@ApiTags('wallet-types')
@Controller('wallet-types')
export class WalletTypeController {

  constructor(private readonly walletTypeService: WalletTypeService) {}

  @ApiOperation({ summary: 'Find wallet types. If query string parameters are provided, the results will be filtered by the given query string params.' })
  @ApiQuery({name:"name", description: "Filter results by the matching wallet type name.",required : false,allowEmptyValue:false,})
  @ApiResponse({ status: 200, description: 'Return wallet types found ..'})
  @Get()
  async findAll(@Query('name') name: string): Promise<any[]> {
    if(name) {
      return await this.walletTypeService.findAllWealletTypes();
    }
    else{
      return await this.walletTypeService.findAllWealletTypes();
    }
  }
}