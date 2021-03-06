import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './user.interface';
import { UserCreateDto } from '../../dto/user/user.create.dto';
import { UpdateUserDto } from '../../dto/user/user.update.dto';
import { LoginUserDto } from '../../dto/user/user.login.dto';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import {ApiParam,ApiBearerAuth,ApiResponse,ApiOperation, ApiTags, ApiQuery,} from '@nestjs/swagger';
import { User } from '../../module/user/model/user';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) { 


}

  @ApiOperation({ summary: 'Find user by id.' })
  @ApiParam({ name: "id", description: "Unique numeric id generated by the system for the users.", required: false, allowEmptyValue: false })
  @ApiQuery({ name: "childs", description: "load childs records for the given user.", required: false, allowEmptyValue: false })
  @ApiResponse({ status: 200, description: 'Return user found by id..' })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @Query('childs', ParseBoolPipe) childs: boolean): Promise<User> {
    if (childs) {
      let user: User = await this.userService.findByIdWithChilds(id);
      return user;
    }
    else {
      return await this.userService.findById(id);
    }
  }

  /*@ApiOperation({ summary: 'Find user by account address.' })
  @ApiParam({ name: "accountAddress", description: "account address that user has.", required: true, allowEmptyValue: true })
  @ApiResponse({ status: 200, description: 'Return user found by id..' })
  @Get('account/:accountAddress')
  async findByWalletAddress(@Param('accountAddress') accountAddress: string): Promise<User> {

    let user: User = await this.userService.findUserByAccountAddressWithChilds(accountAddress)
    return user;
  }*/


  @ApiOperation({ summary: 'Find users. If query string parameters are provided, the results will be filtered by the given query string params.' })
  @ApiQuery({ name: "email", description: "Filter results by the matching email.", required: false, allowEmptyValue: false })
  @ApiQuery({ name: "childs", description: "load childs records for the given users.", required: false, allowEmptyValue: false })
  @ApiResponse({ status: 200, description: 'Return users found ..' })
  @Get()
  async findAll(@Query('email') email: string, @Query('childs', ParseBoolPipe) childs: boolean): Promise<User[]> {
    if (email) {
      let user: User = await this.userService.findByEmail(email);
      let objarray: User[] = [user];
      return objarray;
    }
    else if (childs) {
      return await this.userService.findAll();
    }
    else {
      return await this.userService.findAll();
    }
  }

  @Put(':id')
  async update(@Param('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() userData: UserCreateDto) {
    return await this.userService.create(userData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return await this.userService.delete(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserRO> {
    return await this.userService.login(loginUserDto);
  }
}
