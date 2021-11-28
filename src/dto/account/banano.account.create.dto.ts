import { Wallet } from ".prisma/client";

export class BananoAccountCreateDto {
  name: string;
  address: string;
  secret: string;
  publicKey: string;
  description: string;
  enabled: boolean;
  deleted: boolean;
  walletId: number;
}


