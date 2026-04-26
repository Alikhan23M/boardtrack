/*
  Warnings:

  - The `status` column on the `Board` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BOARD_STATUS" AS ENUM ('AVAILABLE', 'OCCUPIED');

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "status",
ADD COLUMN     "status" "BOARD_STATUS" NOT NULL DEFAULT 'AVAILABLE';
