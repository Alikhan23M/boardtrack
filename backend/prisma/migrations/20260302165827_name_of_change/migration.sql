/*
  Warnings:

  - You are about to drop the column `boardId` on the `Deal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_boardId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "boardId";

-- CreateTable
CREATE TABLE "DealBoard" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,

    CONSTRAINT "DealBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealBoard_dealId_boardId_key" ON "DealBoard"("dealId", "boardId");

-- AddForeignKey
ALTER TABLE "DealBoard" ADD CONSTRAINT "DealBoard_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealBoard" ADD CONSTRAINT "DealBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
