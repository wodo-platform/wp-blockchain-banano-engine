export default interface Account {
    id: number;
    name: string;
    address: string;
    description: string;
    balance: number;
    pending: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    walletId: number;
}
