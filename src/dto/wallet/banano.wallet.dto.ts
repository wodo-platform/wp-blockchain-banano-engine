import { BananoAccountDto } from "../account/banano.account.dto";
import { UserDto } from "../user/user.dto";

export class BananoWalletDto {
    id:             number;
    name:           string;
    description:    string;
    type:           string;
    balance:        number;
    pending:        number;
    seed:           string;
    mnemonic:       string;
    enabled:        boolean;
    deleted:        boolean;
    createdAt:      Date;
    updatedAt:      Date;
    userId:         number;
    user:           UserDto;
    accounts?:       BananoAccountDto[];
  }