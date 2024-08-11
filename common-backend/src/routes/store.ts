import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
// all routes that serve the web of customer service

router.get("/get-requests/:storeId", async (req, res) => {
  const storeId = Number(req.params.storeId);
  try {
    const allRequests = await prisma.customerRequests.findMany({
      where: {
        storeId: storeId,
      },
      select: {
        requestId: true,
        customer_name: true,
        time: true,
        itemId: true,
        phone: true,
      },
      orderBy: {
        time: "desc",
      },
    });
    res.status(200).json({
      message: "got new request",
      allRequests: allRequests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
