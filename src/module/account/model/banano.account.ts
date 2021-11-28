import { BlockchainWalletAccount } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.account";
import {BigNumber} from 'bignumber.js';

export interface BananoAccount extends BlockchainWalletAccount {
    createdAt: Date;
    updatedAt: Date;
    walletId: number;
}
