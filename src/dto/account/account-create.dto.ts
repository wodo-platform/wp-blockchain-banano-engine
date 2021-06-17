import { Wallet } from ".prisma/client";

export class AccountCreateDto {
  name: string;
  address: string;
  description: string;
  enabled: boolean;
  deleted: boolean;
  walletId: number;
}


