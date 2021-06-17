/*
  Warnings:

  - You are about to alter the column `balance` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pending` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `amount` on the `TransactionHistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `balance` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pending` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `balance` INTEGER NOT NULL,
    MODIFY `pending` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TransactionHistory` MODIFY `amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Wallet` MODIFY `balance` INTEGER NOT NULL,
    MODIFY `pending` INTEGER NOT NULL;
