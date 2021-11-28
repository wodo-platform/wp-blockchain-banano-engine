import { Injectable } from '@nestjs/common';
import { BlockchainAccountApi } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.account.api';
import { BlockchainWalletAccount } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.account';
import { BananoAccount } from './model/banano.account';
import { WPError } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/error/wp.error';
import { WG_ERROR_INTERNAL_SERVER } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/error.codes';
import { BigNumber } from 'bignumber.js';


@Injectable()
export class BananoAccountService implements BlockchainAccountApi {
  
    constructor() {}

  /**
     * 
     * @param userId 
     * @param walletId 
     * @param name 
     * @param description 
     * @param enabled 
     * @returns BlockchainWalletAccount
     */
   public async createWalletAccount(userId:number, walletId:number, name: string, description: string, enabled: boolean):Promise<BlockchainWalletAccount> {
    
        throw new WPError(WG_ERROR_INTERNAL_SERVER,"createWalletAccount(userId:number, walletId:number, name: string, description: string, enabled: boolean) is not suppored in "+BananoAccountService.name); 
   }

   /**
    * 
    * @param userId 
    * @param walletId 
    * @param name 
    * @param description 
    * @param address 
    * @param secret 
    * @param keypair 
    * @param enabled 
    * @returns BlockchainWalletAccount
    */
    public async  createWalletAccountWithSecrets(userId:number, walletId:number, name: string, description: string, address: string, secret: string, publicKey: string, enabled: boolean):Promise<BlockchainWalletAccount> {
        
        let bananoWalletAccount:BananoAccount = {
            id: "",
            name: name,
            description: description,
            address: address,
            secret:secret,
            publicKey:publicKey,
            balance: new BigNumber(0),
            pending: new BigNumber(0),
            enabled: enabled,
            createdAt: new Date(),
            updatedAt: new Date(),
            deleted: false,
            walletId: walletId,
        }
        return bananoWalletAccount;
    }
}
