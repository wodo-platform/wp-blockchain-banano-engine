import {BigNumber} from 'bignumber.js';
export type WalletTypes = "seed" | "ledger" | "privateKey";

export interface WalletType {
  id: number;
  name: string;
  type: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletAccount {
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
  addressBookName: string|null;
}

export interface FullWallet {
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
    accounts: WalletAccount[];
    accountsIndex: number;
    locked: boolean;
    password: string;
  }

  export interface BaseApiAccount {
    account_version: string;
    balance: string;
    block_count: string;
    frontier: string;
    modified_timestamp: string;
    open_block: string;
    pending: string;
    representative: string;
    representative_block: string;
    weight: string;
  }
  
  export interface WalletApiAccount extends BaseApiAccount {
    addressBookName?: string|null;
    id?: string;
  }