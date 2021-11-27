import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import {ApiParam,ApiBearerAuth,ApiResponse,ApiOperation, ApiTags, ApiQuery,} from '@nestjs/swagger';
import { PaymentNotificationService } from './payment.notification.service';


@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly paymentNotificationService: PaymentNotificationService) {}

  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Return all notifications.'})
  @Get('')
  async findAll(): Promise<any[]> {
    return await this.paymentNotificationService.findAll();
  }


  @ApiOperation({ summary: 'Find notification by sender account.' })
  @ApiParam({ name: "account", description: "Sender account address.", required: false, allowEmptyValue: false })
  @ApiResponse({ status: 200, description: 'Return notifications found by sender account..' })
  @Get('sender/:account')
  async findBySenderAccount(@Param('account') account: string): Promise<any> {
   return await this.paymentNotificationService.findBySenderAccount(account);
  }

  @ApiOperation({ summary: 'Find notification by receiver account.' })
  @ApiParam({ name: "account", description: "Receiver account address.", required: false, allowEmptyValue: false })
  @ApiResponse({ status: 200, description: 'Return notifications found by receiver account..' })
  @Get('receiver/:account')
  async findByToAccount(@Param('account') account: string): Promise<any> {
   return await this.paymentNotificationService.findByReceiverAccount(account);
  }

}