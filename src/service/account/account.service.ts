import { Injectable } from '@nestjs/common';
import { AccountCreateDto } from '../../dto/account/account-create.dto';
import Account from './model/account';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, walletId: number): Promise<Account[]> {
    let accounts:Account[] = await this.prisma.account.findMany(
      {
        where: 
          { 
            walletId : walletId,
            wallet: 
              { 
                userId : userId
              }
          },
        orderBy: { createdAt: 'desc' },
        include: { wallet:true },
      }
    ) as Account[];
    return accounts;
  }

  async findByUserID(userId: number, id: number): Promise<Account> {
    let account: Account = await this.prisma.account.findUnique(
      { 
        where: 
          { 
            id
          },
        include: { 
          wallet: {
            include: {
              accounts:true
            }
          } 
        },
      }
    ) as Account;

    return account;
  }


  async findOne(userId: number, id: number): Promise<Account> {
    let account: Account = await this.prisma.account.findUnique(
      { 
        where: 
          { 
            id
          },
        include: { wallet:true },
      }
    ) as Account;

    return account;
  }

  async create(walletId: number, payload: AccountCreateDto): Promise<Account> {
    const data = {
      name: payload.name,
      address: payload.address,
      description: payload.description,
      enabled: payload.enabled,
      deleted: false,
      balance: 0,
      pending: 0,
      walletId: payload.walletId,
      //wallet: {
        //connect: { where : {id: walletId} }
      //}
    };
    let account: Account = await this.prisma.account.create(
      {
        data,
        include: { wallet:true },
      }
    ) as Account;

    return account;
  }

  async update(userId: number, id: number, data: any): Promise<Account> {
    let account: Account = await this.prisma.account.update(
      {
        where: 
          { 
            id
          },
        data: 
          {
            ...data,
          },
        include: { wallet:true },
      }
    ) as Account;

    return account;
  }

  async delete(userId: number,id: number): Promise<Account> {
    let account:Account = await this.prisma.account.delete(
      { 
        where: 
          { 
            id 
          } 
        }
    ) as Account;
    return account;
  }
}
