import { BananoAccountCreateDto } from "../account";

export class BananoWalletCreateWithSeed {
    name:           string;
    type:           string; 
    description:    string;
    enabled:        boolean;
    userId:         number;
    accounts:       BananoAccountCreateDto[] | null;
    seed:           string
}