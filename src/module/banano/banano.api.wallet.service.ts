import { Injectable, Logger } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import * as CryptoJS from 'crypto-js';
import { AppSettingsService } from '../util/app-settings.service';
import { UtilService } from '../util/util.service';
import { BananoApiWallet } from "./model/banano.api.wallet";
import { WALLET_TYPE_BIP32, WalletType } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type"
import { BananoApiWalletAccount } from './model/banano.api.wallet.account';

@Injectable()
export class BananoApiWalletService {

  private readonly logger = new Logger(BananoApiWalletService.name);

  constructor(private utilService: UtilService, private appSettings: AppSettingsService) {

  }

  /**
   * 
   * @param userId 
   * @returns 
   */
  async createWallet(userId: number,name: string, description: string, walletType: WalletType): Promise<BananoApiWallet> {
    let seed: string;
    let seedBytes = this.utilService.account.generateSeedBytes();
    seed = this.utilService.hex.fromUint8(seedBytes);
    let wallet = await this.createWalletWithSeed(userId, seed, name, description,walletType);
    return wallet;
  }


  /**
   * When a new wallet is created, a new Banano seed will be generated which can be used to create brand new accounts 
   * on the Banano network. The Banano seed is the master key to all of associated accounts and any money inside of them!
   * @returns BananoWallet
   */
  async createWalletWithSeed(userId: number, seed: string, name: string, description: string, walletType: WalletType): Promise<BananoApiWallet> {

    this.logger.debug("creating wallet with userid[" + userId + "] and seed[***].")

    if(name || name === "") {
      name = 'generated_banano_wallet_' + Math.random();
    }

    let wallet: BananoApiWallet = {
      name: name,
      description: description,
      type: walletType,
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
      enabled: true,
      password: '',
    };

    this.logger.debug("adding banano account to wallet:" + JSON.stringify(wallet));

    let accountName:string = 'main_banano_account_' + Math.random();
    await this.addWalletAccount(wallet, null, accountName);

    return wallet;
  }

  async addWalletAccount(wallet: BananoApiWallet, accountIndex: number | null = null, accountName: string | null) {

    let index = accountIndex;
    if (index === null) {
      index = 0; // Use the existing number, then increment it
      // Make sure the index is not being used (ie. if you delete acct 3/5, then press add twice, it goes 3, 6, 7)
      while (wallet.accounts.find(a => a.index === index)) index++;
    }

    let newAccount: BananoApiWalletAccount | null;

    if (wallet.type.type === WALLET_TYPE_BIP32.type) {
      newAccount = await this.createSeedAccount(wallet, index, accountName);
    } else {
      // TODO: add error code here
      throw new Error("unspoorted wallet type:" + JSON.stringify(wallet.type));
    }

    wallet.accounts.push(newAccount);

    // Set new accountsIndex - used when importing wallets.  Only count from 0, won't include custom added ones
    let nextIndex = 0;
    while (wallet.accounts.find(a => a.index === nextIndex)) nextIndex++;
    wallet.accountsIndex = nextIndex;

    return newAccount;
  }

  async createSeedAccount(wallet: BananoApiWallet, index, accountName: string | null) {

    this.logger.debug("crating wallet account with seed.index="+index);

    const accountBytes = this.utilService.account.generateAccountSecretKeyBytes(wallet.seedBytes, index);
    this.logger.debug("account bytes lenght:"+accountBytes.length + ", bytes:"+accountBytes);
    const accountKeyPair = this.utilService.account.generateAccountKeyPair(accountBytes);
    const accountId = this.utilService.account.getPublicAccountID(accountKeyPair.publicKey);

    if (accountName) {
      accountName = accountId;
    }

    const newAccount: BananoApiWalletAccount = {
      id: accountId,
      name: accountName,
      description: "banano account description",
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
      enabled: true
    };

    return newAccount;
  }

  /**
   * Reset wallet to a base state, without changing reference to the main object
   */
  resetWallet(wallet: BananoApiWallet) {
    wallet.type = WALLET_TYPE_BIP32;
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
    wallet.name = "",
      wallet.description = ""
  }

  saveWalletExport(wallet: BananoApiWallet) {
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

  generateWalletExport(wallet: BananoApiWallet) {
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