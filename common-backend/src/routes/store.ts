import express from "express";
const router= express.Router();
// all routes that serve the web of customer service

router.get("/login",(req,res)=>{
    res.send("hello from /api/v1/store/login")
})

export default router;