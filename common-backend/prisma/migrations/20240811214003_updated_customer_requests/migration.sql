/*
  Warnings:

  - You are about to drop the column `item` on the `customerRequests` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `customerRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customerRequests" DROP COLUMN "item",
ADD COLUMN     "itemId" INTEGER NOT NULL;
