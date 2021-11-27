import { BlockchainWallet } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet";
import { WalletType } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.wallet.type";
import Account from "../../account/model/account";

export default interface BananoWallet extends BlockchainWallet {
    id: number;
    name: string;
    type: WalletType;
    description: string;
    enabled: boolean;
    balance: number;
    pending: number;
    createdAt: Date;
    updatedAt: Date;
    seed: string | null;
    mnemonic: string | null;
    deleted: boolean;
    userId: number;
    accounts: Account[]; 
}

