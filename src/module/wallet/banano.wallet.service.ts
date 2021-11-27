import { Injectable } from '@nestjs/common';
import { UtilService } from '../util/util.service';
import { BananoApiWalletService } from '../banano/banano.api.wallet.service';
import { BlockchainWalletApi } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.api'
import { BananoWalletCreateDto } from '../../dto/wallet/banano.wallet.create.dto';
import { BananoWalletCreateWithSeed } from '../../dto/wallet/banano.wallet.create.w.seed';
import { BlockchainWallet } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet';
import { WalletType,WALLET_TYPE_BIP32 } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type';
import { BananoWalletServiceUtil } from './banano.wallet.service.util';



@Injectable()
export class BananoWalletService implements BlockchainWalletApi{
 
  constructor(private utilService: UtilService,
    private bananoApiWalletService: BananoApiWalletService) { }


  /**
   * When a new wallet is created, a new Banano seed will be generated which can be used to create brand new accounts 
   * on the Banano network. The Banano seed is the master key to all of associated accounts and any money inside of them!
   * @returns 
   */
  async createWallet(userId: number, walletDto : BananoWalletCreateDto): Promise<any> {

    BananoWalletServiceUtil.validateWalletType(walletDto.type);

    let wallet:BlockchainWallet = await this.generateWallet(userId,walletDto.name,walletDto.description,WALLET_TYPE_BIP32);
    return wallet;
  }

  /**
   * 
   * @param userId 
   * @param walletDto 
   * @returns 
   */
  async createWalletWithSeed(userId: number, walletDto : BananoWalletCreateWithSeed): Promise<BlockchainWallet> {

    BananoWalletServiceUtil.validateWalletType(walletDto.type);
    let wallet:BlockchainWallet = await this.generateWalletWithSeed(userId,walletDto.seed,walletDto.name,walletDto.description,WALLET_TYPE_BIP32);
    return wallet;
  }

  /**
   * 
   * @param userId 
   * @param name 
   * @param description 
   * @param walletType 
   * @returns BlockchainWallet
   */
  async generateWallet(userId: number, name: string, description: string, walletType: WalletType): Promise<BlockchainWallet> {
    let bananoWallet:BlockchainWallet = await this.bananoApiWalletService.createWallet(userId,name,description,walletType);
    return bananoWallet;
  }

  /**
   * 
   * @param userId 
   * @param seed 
   * @param name 
   * @param description 
   * @param walletType 
   * @returns BlockchainWallet
   */
  async generateWalletWithSeed(userId: number, seed: string, name: string, description: string, walletType: WalletType): Promise<BlockchainWallet> {
    
    let bananoWallet:BlockchainWallet = await this.bananoApiWalletService.createWalletWithSeed(userId,seed,name,description,walletType);
    return bananoWallet;
  }
}