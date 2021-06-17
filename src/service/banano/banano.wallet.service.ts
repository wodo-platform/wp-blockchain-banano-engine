import { Injectable } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import * as CryptoJS from 'crypto-js';
import { AppSettingsService } from '../util/app-settings.service';
import { UtilService } from '../util/util.service';
import { BananoApiService } from './banano.api.service';
import { BananoNotificationService } from './banano.notification.service';

import { WalletTypes, WalletType, BaseApiAccount, FullWallet, WalletAccount, WalletApiAccount } from "./banano.wallet.interface";
import { WalletCreateDto } from '../../dto/wallet/wallet.create.dto';


@Injectable()
export class BananoWalletService {
  banoshi = 1000000000000000000000000000;
  storeKey = `nanovault-wallet`;

  walletType: WalletType = {
    id: 1,
    name: 'seed',
    type: 1,
    description: 'seed wallet type',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  

  processingPending = false;
  pendingBlocks = [];
  successfulBlocks = [];

  constructor(private utilService: UtilService,
    private bananoApiService: BananoApiService,
    private appSettings: AppSettingsService,
    private notifications: BananoNotificationService) { }


  /**
   * When a new wallet is created, a new Banano seed will be generated which can be used to create brand new accounts 
   * on the Banano network. The Banano seed is the master key to all of associated accounts and any money inside of them!
   * @returns 
   */
  async createWallet(userId: number,seed : string): Promise<FullWallet> {
    
    let wallet: FullWallet = {
      type: this.walletType,
      seedBytes: this.utilService.hex.toUint8(seed),
      seed: seed,
      balance: new BigNumber(0),
      pending: new BigNumber(0),
      balanceRaw: new BigNumber(0),
      pendingRaw: new BigNumber(0),
      balanceFiat: 0,
      pendingFiat: 0,
      hasPending: false,
      accounts: [],
      accountsIndex: 0,
      locked: false,
      password: '',
    };

    //this.resetWallet(wallet);
    await this.addWalletAccount(wallet);

    return wallet;
  }

  async addWalletAccount(wallet: FullWallet, accountIndex: number | null = null, reloadBalances: boolean = true) {
    // if (!this.wallet.seedBytes) return;
    let index = accountIndex;
    if (index === null) {
      index = 0; // Use the existing number, then increment it

      // Make sure the index is not being used (ie. if you delete acct 3/5, then press add twice, it goes 3, 6, 7)
      while (wallet.accounts.find(a => a.index === index)) index++;
    }

    let newAccount: WalletAccount | null;

    if (wallet.type.name === 'privateKey') {
      throw new Error(`Cannot add another account in private key mode`);
    } else if (wallet.type.name === 'seed') {
      newAccount = await this.createSeedAccount(wallet,index);
    } else if (wallet.type.name === 'ledger') {
      throw new Error("ledger wallet type is not supported yet");
      /**try {
        newAccount = await this.createLedgerAccount(index);
      } catch (err) {
        // this.notifications.sendWarning(`Unable to load account from ledger.  Make sure it is connected`);
        throw err;
      }
      */
    }

    wallet.accounts.push(newAccount);

    // Set new accountsIndex - used when importing wallets.  Only count from 0, won't include custom added ones
    let nextIndex = 0;
    while (wallet.accounts.find(a => a.index === nextIndex)) nextIndex++;
    wallet.accountsIndex = nextIndex;

    //if (reloadBalances) await this.reloadBalances();

    //this.websocket.subscribeAccounts([newAccount.id]);

    this.saveWalletExport(wallet);

    return newAccount;
  }

  async createSeedAccount(wallet:FullWallet,index) {
    const accountBytes = this.utilService.account.generateAccountSecretKeyBytes(wallet.seedBytes, index);
    const accountKeyPair = this.utilService.account.generateAccountKeyPair(accountBytes);
    const accountName = this.utilService.account.getPublicAccountID(accountKeyPair.publicKey);

    const newAccount: WalletAccount = {
      id: accountName,
      frontier: null,
      secret: accountBytes,
      keyPair: accountKeyPair,
      balance: new BigNumber(0),
      pending: new BigNumber(0),
      balanceRaw: new BigNumber(0),
      pendingRaw: new BigNumber(0),
      balanceFiat: 0,
      pendingFiat: 0,
      index: index,
      addressBookName: null,
    };

    return newAccount;
  }

  /**
 * Reset wallet to a base state, without changing reference to the main object
 */
  resetWallet(wallet: FullWallet) {
    /**if (this.wallet.accounts.length) {
      this.websocket.unsubscribeAccounts(this.wallet.accounts.map(a => a.id)); // Unsubscribe from old accounts
    }*/
    wallet.type = this.walletType;
    wallet.password = '';
    wallet.locked = false;
    wallet.seed = '';
    wallet.seedBytes = null;
    wallet.accounts = [];
    wallet.accountsIndex = 0;
    wallet.balance = new BigNumber(0);
    wallet.pending = new BigNumber(0);
    wallet.balanceFiat = 0;
    wallet.pendingFiat = 0;
    wallet.hasPending = false;
  }

  saveWalletExport(wallet: FullWallet) {
    const exportData = this.generateWalletExport(wallet);

    switch (this.appSettings.settings.walletStore) {
      case 'none':
        this.removeWalletData();
        break;
      default:
      case 'localStorage':
        //localStorage.setItem(this.storeKey, JSON.stringify(exportData));
        break;
    }
  }

  removeWalletData() {
    //localStorage.removeItem(this.storeKey);
  }

  generateWalletExport(wallet: FullWallet) {
    let data: any = {
      type: wallet.type,
      accounts: wallet.accounts.map(a => ({ id: a.id, index: a.index })),
      accountsIndex: wallet.accountsIndex,
    };

    if (wallet.type.name === 'ledger') {
    }

    if (wallet.type.name === 'seed') {
      // Forcefully encrypt the seed so an unlocked wallet is never saved
      if (!wallet.locked) {
        const encryptedSeed = CryptoJS.AES.encrypt(wallet.seed, wallet.password || '');
        data.seed = encryptedSeed.toString();
      } else {
        data.seed = wallet.seed;
      }
      data.locked = true;
    }

    return data;
  }
}