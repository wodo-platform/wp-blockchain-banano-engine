import { BananoAccountCreateDto } from "src/dto/account";
import { BananoWalletCreateDto } from "src/dto/wallet";
import { BananoApiWallet } from "../banano/model/banano.api.wallet";
import { BananoApiWalletAccount } from "../banano/model/banano.api.wallet.account";
import { BlockchainValidationUtil } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/blockchain.validation.util';


export class BananoWalletServiceUtil {

    public static convert2BananoWalletCreateDto(userId: number, bananoWallet: BananoApiWallet) {

        let bananoWalletCreateDto = new BananoWalletCreateDto();
        bananoWalletCreateDto.name = bananoWallet.name;
        bananoWalletCreateDto.description = bananoWallet.description;
        bananoWalletCreateDto.enabled = bananoWallet.enabled;
        bananoWalletCreateDto.userId = userId

        let bananoWalletAccounts: BananoApiWalletAccount[] = bananoWallet.accounts;

        if (bananoWalletAccounts && bananoWalletAccounts.length > 0) {
            let bananoAccountCreateDtos = new Array<BananoAccountCreateDto>();
            bananoWalletAccounts.forEach(function (bananoWalletAccount) {
                let accountCreateDto = new BananoAccountCreateDto();
                accountCreateDto.name = bananoWalletAccount.name,
                    accountCreateDto.address = bananoWalletAccount.id,
                    accountCreateDto.description = bananoWalletAccount.description,
                    accountCreateDto.enabled = bananoWalletAccount.enabled,
                    accountCreateDto.deleted = false,
                    accountCreateDto.walletId = 0,
                    bananoAccountCreateDtos.push(accountCreateDto);
            });
            bananoWalletCreateDto.accounts = bananoAccountCreateDtos;
        }
        return bananoWalletCreateDto;
    }

    /**
     * 
     * @param walletType 
     */
    public static validateWalletType(walletType: string) {
        BlockchainValidationUtil.validateWalletType(walletType);
    }
}