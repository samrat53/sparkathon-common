import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
// all routes that serve the customer mobile app

router.get("/signup", async (req, res) => {
  const { name, phoneno, email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        name: name,
        email: email,
        phone: phoneno
      },
    });
    if (user) {
      res.status(409).json({ message: "user already exixts, please login" });
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
      res.status(200).json({ message: "user created successfully" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
    return;
  }
});

export default router;
