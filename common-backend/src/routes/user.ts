import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { extractDetails } from "../extractDetails";
dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";
// all routes that serve the customer mobile app

router.post("/signup", async (req, res) => {
  const { name, phoneno, email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        name: name,
        email: email,
        phone: phoneno,
      },
    });
    if (user) {
      res.status(409).json({ message: "User already exixts, please login!" });
      return;
    } else {
      await prisma.user.create({
        data: {
          name: name,
          phone: phoneno,
          email: email,
          password: password,
        },
      });
      res
        .status(200)
        .json({ message: "User created successfully, please login now" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
    return;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    if (!user) {
      res.status(409).json({
        message: "User donot exist or incorrect password, please signup",
      });
      return;
    } else {
      const id = user.userId;
      const userToken = jwt.sign(
        {
          id,
        },
        JWT_SECRET
      );

      res.status(200).json({
        message: "Login succesfull",
        userToken: userToken,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
    return;
  }
});

router.get("/stores", async (req, res) => {
  const { city, state } = req.body;
  try {
    const allStores = await prisma.store.findMany({
      where: {
        OR: [
          {
            city: { contains: city, mode: "insensitive" },
          },
          {
            state: { contains: state, mode: "insensitive" },
          },
        ],
      },
      select: {
        storeId: true,
        city: true,
        state: true,
        locality: true,
        landmark: true,
        pincode: true,
      },
    });
    if (allStores.length === 0) {
      res.status(404).json({
        message: "No such store found, please change city or state.",
      });
      return;
    }

    res.status(200).json({
      message: "matched stores found",
      allStores: allStores,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

router.post("/start-store-session", (req, res) => {
  const storeId = String(req.body.storeId);
  if (!storeId || storeId.length == 0) {
    res.status(409).json({ message: "storeId not found" });
    return;
  }
  try {
    const storeToken = jwt.sign({ storeId }, JWT_SECRET);
    res.status(200).json({
      message: "received store token from backend",
      storeToken: storeToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "couldnot create token" });
  }
});

router.get("/category", async (req, res) => {
  let category = req.body.category || "";
  category = category.toLowerCase();
  if (!category || !category.length) {
    res.status(409).json({
      message: "invalid category",
    });
    return;
  }
  try {
    const allItems = await prisma.item.findMany({
      where: {
        category: { has: category },
      },
      select: {
        itemId: true,
        name: true,
        price: true,
        description: true,
        image_url: true,
      },
    });
    if (!allItems.length) {
      res.status(409).json({ message: "No such item found" });
      return;
    }
    res.status(200).json({
      message: "received data from backend",
      allItems: allItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/search-items", async (req, res) => {
  const userInput = String(req.body.userInput);
  if (!userInput || userInput.length == 0) {
    res.status(409).json({
      message: "No such items found",
    });
    return;
  }
  try {
    const allItems = await prisma.item.findMany({
      where: {
        OR: [
          { name: userInput },
          { category: { has: userInput } },
          { keywords: { has: userInput } },
        ],
      },
      select: {
        itemId: true,
        name: true,
        description: true,
        price: true,
        image_url: true,
      },
    });
    if (!allItems.length) {
      res.status(409).json({ message: "No such item found" });
      return;
    }
    res.status(200).json({
      message: "received matched items",
      allItems: allItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/locate-item", async (req, res) => {
  const itemId = Number(req.body.itemId) || -1;
  try {
    const itemLocation = await prisma.item.findFirst({
      where: {
        itemId: itemId,
      },
      select: {
        image_url: true,
        item_floor: true,
        item_location: true,
      },
    });
    if (!itemLocation || !itemId) {
      res.status(409).json({
        message: "No such item found or invalid itemId",
      });
      return;
    }
    res.status(200).json({
      message: "matched item",
      itemLocation: itemLocation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/qr-scan", async (req, res) => {
  const itemId = Number(req.body.itemId) || -1;
  try {
    const itemInfo = await prisma.item.findFirst({
      where: {
        itemId: itemId,
      },
      select: {
        name: true,
        price: true,
        comparator_platform: true,
        comparator_price: true,
        description: true,
        image_url: true,
        video_link: true,
        questions: true,
      },
    });
    if (!itemInfo || !itemId) {
      res.status(409).json({
        message: "No such item found, or invalid itemId",
      });
      return;
    }
    res.status(200).json({
      message: "matched item",
      itemInfo: itemInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/call-service", extractDetails, async (req, res) => {
  const storeId = Number(req.storeId);
  const userId = Number(req.userId);
  const itemId = Number(req.body.itemId);
  const otp = Math.floor(Math.random() * 9000 + 1000);
  try {
    const customer = await prisma.user.findFirst({
      where: {
        userId: userId,
      },
      select: {
        phone: true,
        name: true,
      },
    });
    const requestCreated = await prisma.customerRequests.create({
      data: {
        phone: String(customer?.phone),
        otp: otp,
        customer_name: String(customer?.name),
        storeId: storeId,
        itemId: itemId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
  res.status(200).json({
    message: "Created Request, Our service staff is attending you soon!",
    otp: otp,
  });
});

export default router;
