import { Wallet } from ".prisma/client";
import { Prisma } from "@prisma/client";
import { BananoWalletDto } from "src/dto/wallet";

export class DtoUtil {
    convert2WalletDto(wallet : Wallet) :  BananoWalletDto{
        let walletDto = new BananoWalletDto();
        walletDto.id = wallet.id;
        walletDto.name = wallet.name;
        walletDto.description = wallet.description;
        walletDto.mnemonic = wallet.mnemonic;
        walletDto.balance = wallet.balance;
        walletDto.pending = wallet.pending;
        walletDto.deleted = wallet.deleted;
        walletDto.enabled = wallet.enabled;
        walletDto.userId = wallet.userId;
    
        return walletDto;
       
    }
}
