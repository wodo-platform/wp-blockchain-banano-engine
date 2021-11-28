import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserCreateDto } from '../../dto/user/user.create.dto';
import { UpdateUserDto } from '../../dto/user/user.update.dto';
import { LoginUserDto } from '../../dto/user/user.login.dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../../config';
import { UserRO } from './user.interface';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../service/prisma.service';
import { BananoWalletService } from '../wallet/banano.wallet.service';
import { User } from './model/user'
import { WALLET_TYPE_BIP32 } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type';

const select = {
  id: true,
  email: true,
  username: true,
  deleted: true,
  image: true
};

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService, @Inject(forwardRef(() => BananoWalletService)) private walletService: BananoWalletService) {

  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany() as User[];
  }

  async login(payload: LoginUserDto): Promise<any> {
    let _user = await this.findByEmailWithChilds(payload.email);

    const errors = { User: 'email or password wrong' };

    if (!_user) {
      throw new HttpException({errors}, 401);
    }

    const authenticated = await argon2.verify(_user.password, payload.password);

    if (!authenticated) {
      throw new HttpException({errors}, 401);
    }

    const token = await this.generateJWT(_user);
    const {password, ...user} = _user;
    return {
      user: {token, ...user}
    };
  }

  async create(dto: UserCreateDto): Promise<User> {
    const {username, email, password} = dto;

    // check uniqueness of username/email
    const userNotUnique = await this.prisma.user.findUnique({
      where: {email}
    });

    if (userNotUnique) {
      const errors = {username: 'Username and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon2.hash(password);

    const data = {
      username,
      email,
      password: hashedPassword,
      deleted: false,
    };

    // TODO: make this transactional
    let user:User = await this.prisma.user.create({ data }) as User;

    let wallet = null;

    if((dto.seed) && dto.seed.trim().length > 0) {
      wallet = await this.walletService.generateWalletWithSeed(user.id,dto.seed,"","", WALLET_TYPE_BIP32);
    }
    else{
      wallet = await this.walletService.generateWallet(user.id,"","", WALLET_TYPE_BIP32);
    }
    
    user = await this.findByIdWithChilds(user.id);
    this.logger.debug(`user created[${user}]`);
    return user;
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const where = { id };
    const user:User = await this.prisma.user.update(
      {
        where, 
        data
      }) as User;

    return user;
  }

  async delete(id: number): Promise<User> {
    return await this.prisma.user.delete({ where: { id : id } }) as User;
  }

  async findById(id: number): Promise<User>{
    const user:User = await this.prisma.user.findUnique(
      { 
        where: 
          { 
            id : id,  
          }
      }
    ) as User;
    return user ;
  }

  async findByIdWithChilds(id: number): Promise<User>{
    const user:User = await this.prisma.user.findUnique(
      { 
        where: 
          { 
            id : id 
          }, 
          /*include: {
            wallets: {
              include: {
                accounts:true
              }
            }
          }*/
      }
    ) as User;
    return  user ;
  }

  async findByEmail(email: string): Promise<User>{
    let user:User = await this.prisma.user.findUnique(
      { 
        where: 
          { 
            email 
          } 
      }
    ) as User;
    return user ;
  }

  async findByEmailWithChilds(email: string): Promise<User>{
    const user:User = await this.prisma.user.findUnique(
      { 
        where: 
          { 
            email
          }, 
          /*include: {
            wallets: {
              include: {
                accounts:true
              }
            }
          }*/
      }
    ) as User;
    return user;
  }

  /*async findUserByAccountAddressWithChilds(accountAddress: string): Promise<User>{
    this.logger.debug(`findUserByAccountAddressWithChilds: account address[${accountAddress}]`);
    const user:User = await this.prisma.user.findFirst(
      { 
        where: 
          { 
            wallets : 
            {
              every : 
              {
                accounts : 
                {
                  every : 
                  {
                    address : accountAddress
                  }
                }
              }
            }
          }, 
          include: {
            wallets: {
              include: {
                accounts:true
              }
            }
          }
      }
    ) as User;
    return user;
  }*/

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };
}
