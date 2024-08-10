import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
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
      res
        .status(409)
        .json({
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
        city: true,
        state: true,
        locality: true,
        landmark: true,
        pincode: true,
      },
    });
    if (allStores.length === 0) {
      res.status(404).json({ 
        message: "No such store found, please change city or state."
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

export default router;
