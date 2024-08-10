/*
  Warnings:

  - You are about to drop the column `floorCategory` on the `store` table. All the data in the column will be lost.
  - You are about to drop the `_storeItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_storeItems" DROP CONSTRAINT "_storeItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_storeItems" DROP CONSTRAINT "_storeItems_B_fkey";

-- AlterTable
ALTER TABLE "store" DROP COLUMN "floorCategory";

-- DropTable
DROP TABLE "_storeItems";
