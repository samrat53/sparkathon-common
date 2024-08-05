import express from "express";
const router= express.Router();
// all routes that serve the customer mobile app

router.get("/login",(req,res)=>{
    res.send("hello from /api/v1/user/login")
})
export default router;