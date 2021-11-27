import {BigNumber} from 'bignumber.js';
import { WalletType} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type";
import { BlockchainWallet} from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet"
import { BananoApiWalletAccount } from './banano.api.wallet.account';

export interface BananoApiWallet extends BlockchainWallet {
    type: WalletType;
    seedBytes: any;
    seed: string|null;
    balance: BigNumber;
    pending: BigNumber;
    balanceRaw: BigNumber;
    pendingRaw: BigNumber;
    balanceFiat: number;
    pendingFiat: number;
    hasPending: boolean;
    accounts: BananoApiWalletAccount[];
    accountsIndex: number;
    locked: boolean;
    password: string;
  }

  
