import Wallet from "../../wallet/model/banano.wallet";

export default interface User {
    id: number;
    email: string;
    image: string | null;
    password: string | null;
    username: string | null;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    wallets: Wallet[];
}

