import { IsNotEmpty } from 'class-validator';
import { WalletCreateDto } from '../wallet/wallet.create.dto';

export class UserCreateDto {

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly seed: string;

  readonly wallets: WalletCreateDto[];

}