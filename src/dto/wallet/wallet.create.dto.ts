import { AccountCreateDto } from "../account/account-create.dto";

export class WalletCreateDto {
    name:           string;
    description:    string;
    seed:           string;
    mnemonic:       string;
    enabled:        boolean;
    deleted:         boolean;
    userId:         number;
    accounts:       AccountCreateDto[];
  }

  
  