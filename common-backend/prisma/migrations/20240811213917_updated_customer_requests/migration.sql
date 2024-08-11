/*
  Warnings:

  - Added the required column `item` to the `customerRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customerRequests" ADD COLUMN     "item" INTEGER NOT NULL;
