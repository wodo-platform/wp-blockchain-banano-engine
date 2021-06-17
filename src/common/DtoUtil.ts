import { Wallet } from ".prisma/client";
import { Prisma } from "@prisma/client";
import { WalletDto } from "../dto/wallet";

export class DtoUtil {
    convert2WalletDto(wallet : Wallet) :  WalletDto{
        let walletDto = new WalletDto();
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
