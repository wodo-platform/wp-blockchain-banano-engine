import { IsNotEmpty } from 'class-validator';
import { BananoWalletCreateDto } from '../wallet';

export class UserCreateDto {

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly seed: string;

  readonly wallets: BananoWalletCreateDto[];

}