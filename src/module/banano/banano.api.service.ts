import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/common/http";
import { BananoApiNodeService } from "./banano.api.node.service";
import { AppSettingsService } from "../util/app-settings.service";
import * as bananojs from '@bananocoin/bananojs';


export interface NinjaVerifiedRep {
  votingweight: number;
  delegators: number;
  uptime: number;
  score: number;
  account: string;
  alias: string;
}

export class Config {
  prefix: string;
  bananodeUrl: string;
};

/**
 * Banano blockchain integration at the deepest layer. By default it is via http transport. 
 * The http transport layer should be implemented in performant way. The best practices will be
 * implemented such as http connection pooling etc..
 */
@Injectable()
export class BananoApiService {

  private readonly logger = new Logger(BananoApiService.name);

  kaliumUrl = 'https://kaliumapi.appditto.com/api';
  apiUrl = `https://vault.banano.cc/api`;
  rpcUrl = `${this.apiUrl}/node-api`;

   config = new Config();

  constructor(private http: HttpService, private node: BananoApiNodeService, private appSettings: AppSettingsService) {
    this.config.prefix = bananojs.BANANO_PREFIX;
    this.config.bananodeUrl = this.rpcUrl;
    bananojs.bananodeApi.setUrl(this.config.bananodeUrl);
  }

  public async getAccountInfo(accountAddress: String): Promise<any> {
    this.logger.debug('banano accountinfo account', accountAddress);

    try {
      bananojs.bananoUtil.getAccountPublicKey(accountAddress);
    } catch (error) {
      this.logger.error('banano accountinfo error', error);
      return;
    }

    const response = await bananojs.bananodeApi.getAccountInfo(accountAddress, true);
    if (response.error !== undefined) {
      console.log('banano accountinfo response', response);
      return;
    }

    response.balanceParts = await bananojs.bananoUtil.getAmountPartsFromRaw(response.balance, this.config.prefix);
    response.balanceDescription = await bananojs.getBananoPartsDescription(response.balanceParts);
    response.balanceDecimal = await bananojs.getBananoPartsAsDecimal(response.balanceParts);
    this.logger.debug('banano accountinfo response', response);
    return response;
  }

  /**
   * 
   * @param privateKey 
   * @param destAccount 
   * @param amountRaw 
   * @returns 
   */
  public async send(privateKey: String, destAccount: String, amountRaw: number): Promise<any> {
    let processResponse;
    try {
      processResponse = await bananojs.bananoUtil.sendFromPrivateKey(bananojs.bananodeApi, privateKey, destAccount, amountRaw, this.config.prefix);
      this.logger.debug('banano sendbanano response', processResponse);
    } catch (error) {
      this.logger.error('banano sendbanano error', error.message);
    }
    return processResponse;
  }

  /**
   * 
   * @param seed 
   * @param maxAccountsPending 
   * @returns 
   */
  public async receive(seed: string, maxAccountsPending: number): Promise<any[]>{
    let pendingTransactions;
    try {
      let privateKey = bananojs.bananoUtil.getPrivateKey(seed,0);
      let publicKey = await bananojs.bananoUtil.getPublicKey(privateKey);
      let account = bananojs.bananoUtil.getAccount(publicKey, this.config.prefix);
      let representative = await bananojs.bananodeApi.getAccountRepresentative(account);
      if (!(representative)) {
        representative = account;
      }

      //let response = await bananojs.depositUtil.receive(bananojs.loggingUtil, bananojs.bananodeApi, account, privateKey, representative, undefined, bananojs.BANANO_PREFIX);

      //return response;

      //pendingTransactions = await bananojs.bananodeApi.getAccountsPending([account], maxAccountsPending);
      let pendingTransactionsData = await this.accountsPending([account], maxAccountsPending);
      pendingTransactions = pendingTransactionsData.data;
      let responseArray = [];

      if (pendingTransactions.blocks) {
        if (pendingTransactions.blocks[account]) {
          let accountTransactionBlocks = [...Object.values(pendingTransactions.blocks[account])];
          let accountTransactionHashes = [...Object.keys(pendingTransactions.blocks[account])];
          
          for (const specificPendingBlockHash of accountTransactionHashes) {
            try {
              const pendingTx = {
                block: accountTransactionBlocks[specificPendingBlockHash],
                amount: pendingTransactions.blocks[account][specificPendingBlockHash].amount,
                source: pendingTransactions.blocks[account][specificPendingBlockHash].source,
                account: account,
              };
              let response = await bananojs.depositUtil.receive(bananojs.loggingUtil, bananojs.bananodeApi, account, privateKey, representative, specificPendingBlockHash, bananojs.BANANO_PREFIX);
              this.logger.debug('banano receive response', response);
              responseArray.push(response);
            } catch (error) {
              this.logger.error('banano receivebanano error', error.message);
              responseArray.push({"error" : error.message});
            }
          }
          
          // TODO: no parallel processing ???
          
          /*await Promise.all(accountTransactionHashes.map(async (specificPendingHash : any) => {
            try {
              const pendingTx = {
                block: accountTransactionBlocks[specificPendingHash],
                amount: pendingTransactions.blocks[account][specificPendingHash].amount,
                source: pendingTransactions.blocks[account][specificPendingHash].source,
                account: account,
              };
              //let  response = await bananojs.generateReceive(walletAccount, sourceBlock, this.walletService.isLedgerWallet());
              //let response = await this.process(specificPendingHash);
              let response = await bananojs.depositUtil.receive(bananojs.loggingUtil, bananojs.bananodeApi, account, privateKey, representative, specificPendingHash, bananojs.BANANO_PREFIX);
              console.log('banano receive response', response);
              responseArray.push(response.data);
            } catch (error) {
              console.log('banano receivebanano error', error.message);
              responseArray.push({"error" : error.message});
            }
          }));*/
        }
      }
      return responseArray;
    } catch (error) {
      // TODO: proper error handling please
      this.logger.error('banano receivebanano error', error.message);
    }
  }

  /**
   * 
   * @param account 
   * @param maxAccountsPending 
   * @returns 
   */
  public async pending(account: string, maxAccountsPending: number): Promise<any> {
    let pendingTransactions;
    try {
      pendingTransactions = await this.accountsPending([account], maxAccountsPending);
      this.logger.debug('banano checkpending response', pendingTransactions);
    } catch (error) {
      // TODO: proper error handling please
      this.logger.error('banano sendbanano error', error.message);
    }
    return pendingTransactions;
  }

  /**
   * 
   * @param action 
   * @param data 
   * @returns 
   */
  private async request(action, data): Promise<any> {
    data.action = action;
    let apiUrl = this.appSettings.settings.serverAPI || this.rpcUrl;
    if (this.appSettings.settings.serverNode) {
      apiUrl += `?node=${this.appSettings.settings.serverNode}`;
    }
    if (this.node.node.status === false) {
      this.node.setLoading();
    }
    return await this.http.post(apiUrl, data).toPromise()
      .then(res => {
        this.node.setOnline();
        return res.data;
      })
      .catch(err => {
        if (err.status === 500 || err.status === 0) {
          this.node.setOffline(); // Hard error, node is offline
        }
        throw err;
      });
  }

  async accountsBalances(accounts: string[]): Promise<{ balances: any }> {
    return await this.request('accounts_balances', { accounts });
  }
  async accountsFrontiers(accounts: string[]): Promise<{ frontiers: any }> {
    return await this.request('accounts_frontiers', { accounts });
  }
  async accountsPending(accounts: string[], count: number = 50): Promise<any> {
    return await this.request('accounts_pending', { accounts, count, source: true });
  }
  async accountsPendingLimit(accounts: string[], threshold: string, count: number = 50): Promise<{ blocks: any }> {
    return await this.request('accounts_pending', { accounts, count, threshold, source: true });
  }
  async delegatorsCount(account: string): Promise<{ count: string }> {
    return await this.request('delegators_count', { account });
  }
  async representativesOnline(): Promise<{ representatives: any }> {
    return await this.request('representatives_online', {});
  }

  async blocksInfo(blocks): Promise<{ blocks: any, error?: string }> {
    return await this.request('blocks_info', { hashes: blocks, pending: true, source: true });
  }
  async blockCount(): Promise<{ count: number, unchecked: number }> {
    return await this.request('block_count', {});
  }
  async workGenerate(hash): Promise<{ work: string }> {
    return await this.request('work_generate', { hash, use_peers: true });
  }
  async process(block): Promise<any> {
    return await this.request('process', { block: JSON.stringify(block) });
  }
  async accountHistory(account, count = 25, raw = false): Promise<{ history: any }> {
    return await this.request('account_history', { account, count, raw });
  }
  async accountInfo(account): Promise<any> {
    return await this.request('account_info', { account, pending: true, representative: true, weight: true });
  }
  async validateAccountNumber(account): Promise<{ valid: '1' | '0' }> {
    return await this.request('validate_account_number', { account });
  }
  async pending_1(account, count): Promise<any> {
    return await this.request('pending', { account, count, source: true });
  }
  async pendingLimit(account, count, threshold): Promise<any> {
    return await this.request('pending', { account, count, threshold, source: true });
  }

}