-- CreateTable
CREATE TABLE "user" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "store" (
    "storeId" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "locality" TEXT,
    "landmark" TEXT,
    "pincode" BIGINT NOT NULL,
    "floorCategory" TEXT[],

    CONSTRAINT "store_pkey" PRIMARY KEY ("storeId")
);
