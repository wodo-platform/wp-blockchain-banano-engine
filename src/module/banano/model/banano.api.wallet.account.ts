import {BigNumber} from 'bignumber.js';
import { BlockchainWalletAccount } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.account"


export interface BananoApiWalletAccount extends BlockchainWalletAccount {
    frontier: string|null;
    keyPair: any;
    secretBytes: any,
    publicBytes: any,
    index: number;
    balanceRaw: BigNumber;
    pendingRaw: BigNumber;
    balanceFiat: number;
    pendingFiat: number;
  }
  