-- AlterTable
ALTER TABLE `Account` MODIFY `balance` BIGINT NOT NULL,
    MODIFY `pending` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `Wallet` MODIFY `balance` BIGINT NOT NULL,
    MODIFY `pending` BIGINT NOT NULL;
