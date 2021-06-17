/*
  Warnings:

  - You are about to alter the column `balance` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pending` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to drop the column `sender` on the `TransactionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `TransactionHistory` table. All the data in the column will be lost.
  - You are about to alter the column `balance` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `pending` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `senderId` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderAccountId` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverAccountId` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetId` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `balance` INTEGER NOT NULL,
    MODIFY `pending` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TransactionHistory` DROP COLUMN `sender`,
    DROP COLUMN `receiver`,
    ADD COLUMN     `senderId` INTEGER NOT NULL,
    ADD COLUMN     `senderAccountId` INTEGER NOT NULL,
    ADD COLUMN     `receiverId` INTEGER NOT NULL,
    ADD COLUMN     `receiverAccountId` INTEGER NOT NULL,
    ADD COLUMN     `assetId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Wallet` MODIFY `balance` INTEGER NOT NULL,
    MODIFY `pending` INTEGER NOT NULL;
