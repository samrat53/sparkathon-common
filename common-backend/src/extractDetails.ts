import dotenv from "dotenv";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Extend the Request interface to include userId and storeId
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    storeId?: string;
  }
}

export const extractDetails: RequestHandler = (req, res, next) => {
  const userToken = String(req.headers.usertoken);
  const storeToken = String(req.headers.storetoken);

  if (!userToken || !storeToken) {
    return res.status(403).json({
      message: "User and/or store not selected",
    });
  }

  try {
    const decodedUserId = jwt.verify(userToken, JWT_SECRET);
    const decodedStoreId = jwt.verify(storeToken, JWT_SECRET);

    if (typeof decodedUserId !== 'string' && 'id' in decodedUserId) {
      req.userId = decodedUserId.id as string;
    } else {
      throw new Error('Invalid user token');
    }

    if (typeof decodedStoreId !== 'string' && 'storeId' in decodedStoreId) {
      req.storeId = decodedStoreId.storeId as string;
    } else {
      throw new Error('Invalid store token');
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid token" });
  }
};
