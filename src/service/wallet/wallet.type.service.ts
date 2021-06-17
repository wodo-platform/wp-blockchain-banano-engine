import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WalletType } from '../banano/banano.wallet.interface';

const select = {
    id: true,
    name: true,
    type: true,
    description: true,
    createdAt: true,
    updatedAt: true
};

@Injectable()
export class WalletTypeService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findAllWealletTypes(): Promise<WalletType[]> {
        return await this.prisma.walletType.findMany({ select });
    }
}