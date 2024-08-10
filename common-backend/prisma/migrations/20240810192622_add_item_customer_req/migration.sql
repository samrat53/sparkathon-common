-- CreateTable
CREATE TABLE "item" (
    "itemId" SERIAL NOT NULL,
    "category" TEXT[],
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "comparator_platform" TEXT[],
    "comparator_price" TEXT[],
    "description" TEXT NOT NULL,
    "item_floor" INTEGER NOT NULL,
    "item_location" TEXT NOT NULL,
    "keywords" TEXT[],
    "image_url" TEXT NOT NULL,
    "video_link" TEXT NOT NULL,
    "questions" TEXT[],

    CONSTRAINT "item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "customerRequests" (
    "requestId" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "customer_name" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customerRequests_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "_storeItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_storeItems_AB_unique" ON "_storeItems"("A", "B");

-- CreateIndex
CREATE INDEX "_storeItems_B_index" ON "_storeItems"("B");

-- AddForeignKey
ALTER TABLE "_storeItems" ADD CONSTRAINT "_storeItems_A_fkey" FOREIGN KEY ("A") REFERENCES "item"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_storeItems" ADD CONSTRAINT "_storeItems_B_fkey" FOREIGN KEY ("B") REFERENCES "store"("storeId") ON DELETE CASCADE ON UPDATE CASCADE;
