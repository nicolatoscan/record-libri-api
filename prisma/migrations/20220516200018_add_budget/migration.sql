/*
  Warnings:

  - You are about to drop the column `Budget` on the `Libraries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Libraries" DROP COLUMN "Budget",
ADD COLUMN     "budget" INTEGER;
