import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rootRouter from "./routes/index"

dotenv.config();
const app=express();
const PORT=process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api/v1",rootRouter);

app.listen(PORT,()=>{
    console.log(`hello from port ${PORT}`);
})