import {  Account } from '@prisma/client'

export interface AccountRO {
  account: Account;
}

export interface AccountsRO {
  accounts: Account[];
  AccountsCount: number;
}

