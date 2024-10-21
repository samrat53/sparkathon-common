import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rootRouter from "./routes/index";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const prisma = new PrismaClient();
// all routes that serve the customer mobile app
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000 || 3001 || 3002;

app.use(express.json());
app.use(cors());
app.use("/api/v1", rootRouter);

// app.post("/random", async (req, res) => {
//   const newStore = await prisma.store.create({
//     data: {
//       city: "Agartala",
//       state: "Tripura",
//       locality: "Banamalipur",
//       landmark: "Near Central Park",
//       pincode: "10001",
//       floorCategory: ["Cosmetics", "Mens wear"],
//     },
//   });
//   console.log("New store created:", newStore);
//   res.send("done");
// });

app.listen(PORT, () => {
  console.log(`Server live at PORT ${PORT}`);
});
