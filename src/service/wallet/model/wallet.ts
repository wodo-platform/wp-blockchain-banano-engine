import Account from "../../account/model/account";

export default interface Wallet {
    id: number;
    name: string;
    description: string;
    balance: number;
    pending: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    seed: string | null;
    mnemonic: string | null;
    deleted: boolean;
    userId: number;
    accounts: Account[]; 
}

