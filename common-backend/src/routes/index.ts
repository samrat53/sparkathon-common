import express from "express";
import userRouter from "./user";
import storeRouter from "./store";

const router=express.Router();

router.use("/user",userRouter);
router.use("/store", storeRouter);

export default router;