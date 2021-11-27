import { BananoAccountCreateDto } from "../account/banano.account.create.dto";

export class BananoWalletCreateDto {
    name:           string;
    type:           string; 
    description:    string;
    enabled:        boolean;
    userId:         number;
    accounts:       BananoAccountCreateDto[] | null;
  }

  
  