import { Injectable } from '@nestjs/common';
import { WalletCreateDto } from '../../dto/wallet/wallet.create.dto';
import Wallet from './model/wallet';
import { PrismaService } from '../prisma.service';


@Injectable()
export class WalletPersistenceService {

  constructor(private prisma: PrismaService) {
  }

  async findAllWeallets(): Promise<Wallet[]> {
    let wallets: Wallet[] = await this.prisma.wallet.findMany(
      {
        include:
        {
          user: true,
          accounts: true
        }
      }
    ) as Wallet[];
    return wallets;
  }

  /*async findByUser(userId: number): Promise<any>{
    const user = await this.prisma.wallet.findUnique({ where: { user : { id : userId}}, select });
    return { user };
  }*/

  async createWallet(userId: number, walletDto: WalletCreateDto):Promise<Wallet> {

    let accountData = []

    if (walletDto.accounts) {
      walletDto.accounts.forEach(function (account) {
        accountData.push({
          name: account.name,
          address: account.address,
          description: account.description,
          enabled: account.enabled,
          deleted: false,
          balance: 0,
          pending: 0,
        });
      });
    }

    const data = {
      name: walletDto.name,
      description: walletDto.description,
      seed: walletDto.seed,
      mnemonic: walletDto.mnemonic,
      enabled: walletDto.enabled ? walletDto.enabled : false,
      deleted: false,
      //userId:         userId,
      balance: 0,
      pending: 0,
      accounts: {
        createMany: {
          data: accountData
        }
      },
      user: {
        connect: { id: userId }
      }
    };

    let wallet: Wallet = await this.prisma.wallet.create(
      {
        data,
        include: { user: true, accounts: true }
      }
    ) as Wallet;

    return wallet;
  }

}