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

router.put("/solve-request", async (req, res) => {
  const receivedOtp = Number(req.body.otp);
  const requestId = Number(req.body.requestId);
  try {
    const checkOtp = await prisma.customerRequests.findFirst({
      where: {
        requestId: requestId,
      },
      select: {
        otp: true,
      },
    });
    if(!checkOtp) {
        return res.status(401).json({ message: "No such request" });
    }
    if (receivedOtp == checkOtp?.otp) {
      await prisma.customerRequests.delete({
        where: {
          requestId: requestId,
        },
      });
      return res.status(200).json({ message: "Request Attended Successfully" });
    } else return res.status(401).json({ message: "Wrong OTP" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ messaage: "Internal Server Error" });
  }
});

export default router;
