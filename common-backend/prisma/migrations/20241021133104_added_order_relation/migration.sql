-- CreateTable
CREATE TABLE "orders" (
    "orderId" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderId")
);
