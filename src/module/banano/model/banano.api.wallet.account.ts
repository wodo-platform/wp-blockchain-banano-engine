import {BigNumber} from 'bignumber.js';
import { BlockchainWalletAccount } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.account"


export interface BananoApiWalletAccount extends BlockchainWalletAccount {
    id: string;
    frontier: string|null;
    secret: any;
    keyPair: any;
    index: number;
    balance: BigNumber;
    pending: BigNumber;
    balanceRaw: BigNumber;
    pendingRaw: BigNumber;
    balanceFiat: number;
    pendingFiat: number;
  }
  