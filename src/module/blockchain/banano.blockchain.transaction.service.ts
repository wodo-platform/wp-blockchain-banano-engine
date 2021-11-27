import { Injectable,Logger } from '@nestjs/common';
import * as bananojs from '@bananocoin/bananojs';
import { BananoApiService } from '../banano/banano.api.service';
import { BananoTransactionBlock } from '../banano/model/banano.transaction.block';
import { BananoTransaction } from '../banano/model/banano.transaction';
import { UtilService } from '../util/util.service';
import { BlockchainApi } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.api';
import { BlockchainTransactionParams } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction.params';

export class Config  {
  prefix:string;
  bananodeUrl: string;
};

/**
 * internal Banano blockchain service implementation. The service hides complexity of banano network relatated functions 
 */
@Injectable()
export class BananoBlockchainTransactionService implements BlockchainApi {

  private readonly logger = new Logger(BananoBlockchainTransactionService.name);
  //public static houseAccountAddress = "ban_3fbbbg4edefr1fjbkhjke37s58tw17t6ct7txrw4yf1ijoz1ythu8c4wsc5b";
  //public static houseAccountSeed = "4A8D7ADFB1119D0EE95A224D18042D06C25DCBB1439266A2865C8DA7DE1D3C1D";

  public static houseAccountAddress = "ban_13h7wp66xciohnctxxfgh5971a6wtopp4xwksod7566k7kpom86ygaf6gg77";
  public static houseAccountSeed = "B3DC2320C70266E5E15D26982C720C7DC64F61E93F0E9B8BCC2CF4C9336C9D36";

  private config = new Config();

  constructor(private bananoApiService : BananoApiService,
    private utilService: UtilService) {
    this.config.prefix = bananojs.BANANO_PREFIX;
    this.config.bananodeUrl = 'https://kaliumapi.appditto.com/api';
    bananojs.bananodeApi.setUrl(this.config.bananodeUrl);
  }

  public async  sendBlockchainTransaction(params : BlockchainTransactionParams): Promise<string> {
    // TODO: validate the dto here

    let seed:string = params.attributes.get("seed");
    let destAccount = params.toAccountAddress;
    let amount = params.amount;
    return this.send(seed,destAccount,amount).then((reponse:any)=>{
      return reponse;
    }).catch(e =>{
      this.logger.error("could not send the banano transaction.",e);
    })
  }

  public async retrievePendingTransactions(account: string, maxAccountsPending: number): Promise<BananoTransactionBlock> {
    let pendingTransactions =  await this.bananoApiService.accountsPending([account],maxAccountsPending);

    let bananoTransactions: BananoTransaction[] = [];
    if (pendingTransactions.blocks) {
      if (pendingTransactions.blocks[account]) {
        let accountTransactionHashes = [...Object.keys(pendingTransactions.blocks[account])];

        for (const specificPendingBlockHash of accountTransactionHashes) {
          let bananoTransaction:BananoTransaction = {
            hash:specificPendingBlockHash,
            amount:pendingTransactions.blocks[account][specificPendingBlockHash].amount,
            source:pendingTransactions.blocks[account][specificPendingBlockHash].source,
          }
          bananoTransactions.push(bananoTransaction);
        }
      }
    }
    
    let bananoTransactionBlock:BananoTransactionBlock = {
      accountAddress: BananoBlockchainTransactionService.houseAccountAddress,
      transactions:bananoTransactions
    }
    return bananoTransactionBlock;
  }

  public async receiveTransactionsBySeed(seed: string, maxAccountsPending: number): Promise<any[]>{
    let response = await this.bananoApiService.receive(seed,maxAccountsPending);
    return response;
  }

   /**
     * 
     *       {
     *           "ban_3fbbbg4edefr1fjbkhjke37s58tw17t6ct7txrw4yf1ijoz1ythu8c4wsc5b": {
     *               "5B66F60A48008A3BE515433B400783F644B565525E39FB2884489777F1B21C58": {
     *                   "amount": "100000000000000000000000000000",
     *                   "source": "ban_13h7wp66xciohnctxxfgh5971a6wtopp4xwksod7566k7kpom86ygaf6gg77"
     *               },
     *               "CBCBC4D2DD756E3CCB64767F2B9FBF68B04967D94AB845691C0E1066C57B6C85": {
     *                   "amount": "100000000000000000000000000000",
     *                   "source": "ban_3wj57jjikejkpu4hdg9picktjbqqja9eusxz5fh145grbebf5jbjshhtznfi"
     *               }
     *           }
     *       }
     *  
     * 
     * @param paymentReceiveParams 
     * @returns 
     */
  public async receivePendingTransactions(seed:string, bananoTransaction:BananoTransaction): Promise<any[]>{

    let privateKey = bananojs.bananoUtil.getPrivateKey(seed,0);
    let publicKey = await bananojs.bananoUtil.getPublicKey(privateKey);
    let bananoAccount = bananojs.bananoUtil.getAccount(publicKey, this.config.prefix);
    let representative = await bananojs.bananodeApi.getAccountRepresentative(bananoAccount);
    if (!(representative)) {
      representative = bananoAccount;
    }

    let specificPendingBlockHash:string = bananoTransaction.hash;
    let sourceAddress:string = bananoTransaction.source;

    let response = await bananojs.depositUtil.receive(bananojs.loggingUtil, bananojs.bananodeApi, bananoAccount, privateKey, representative, specificPendingBlockHash, bananojs.BANANO_PREFIX);
    console.log('banano receive response', response);

    return response;
  }

  async send(seed: string, destAccount:string, amount:string): Promise<any> {
    // TODO: validate addresses
    // TODO: make this one generic to support multiple blockchains
   
    this.logger.debug(`processing send request to account[${destAccount}] with amount[${amount}] and seed[${seed}]`);
    let privateKey = bananojs.bananoUtil.getPrivateKey(seed,0);
    //let amountRaw = this.utilService.banano.banToRaw(amount);
    let amountRaw = bananojs.getBananoDecimalAmountAsRaw(amount); 
    let response;
    try {
      response = await bananojs.bananoUtil.sendFromPrivateKey(bananojs.bananodeApi, privateKey, destAccount, amountRaw, this.config.prefix);
      this.logger.debug(`banano send response[${response}]`);
    } catch (error) {
      this.logger.debug(`banano send response error[${error}]`);
      throw error;
    }

    return response;

  }
  
}
