export class BananoAccountDto {
    id:       number;
    name:           string;
    address:        string;
    secret:         string;
    publicKey:       string;
    description:    string;
    balance:        number;
    pending:        number;
    enabled:        boolean;
    deleted:        boolean;
    createdAt:      Date;
    updatedAt:      Date;
    walletId:       number;
  }