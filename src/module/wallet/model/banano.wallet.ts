import { BlockchainWallet } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet";
import { WalletType } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type";
import { BananoAccount } from "../../account/model/banano.account";
import { BigNumber } from 'bignumber.js';


/**
 *  Banano Interface
 */
export default interface BananoWallet extends BlockchainWallet {
    id: string;
    name: string;
    type: WalletType;
    description: string;
    enabled: boolean;
    balance: BigNumber;
    pending: BigNumber;
    createdAt: Date;
    updatedAt: Date;
    seed: string | null;
    mnemonic: string | null;
    deleted: boolean;
    userId: number;
    accounts: BananoAccount[]; 
}

