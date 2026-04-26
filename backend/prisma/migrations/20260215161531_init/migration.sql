/*
  Warnings:

  - You are about to drop the column `paymentType` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Installment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "paymentType";

-- AlterTable
ALTER TABLE "Installment" DROP COLUMN "dueDate",
DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
