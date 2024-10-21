import express from "express";
import userRouter from "./user";
import storeRouter from "./store";
import chatRouter from "./chat";

const router=express.Router();

router.use("/user",userRouter);
router.use("/store", storeRouter);
router.use("/chat",chatRouter);

export default router;