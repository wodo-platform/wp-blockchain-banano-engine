import { AccountDto } from "../account/account.dto";
import { UserDto } from "../user/user.dto";

export class WalletDto {
    id:             number;
    name:           string;
    description:    string;
    balance:         number;
    pending:         number;
    seed:           string;
    mnemonic:       string;
    enabled:        boolean;
    deleted:        boolean;
    createdAt:      Date;
    updatedAt:      Date;
    userId:         number;
    user:           UserDto;
    accounts:       AccountDto[];
  }