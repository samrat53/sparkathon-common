import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();
const router = express.Router();
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
dotenv.config();
const API_KEY = process.env.API_KEY || "";
const MODEL_NAME = "gemini-1.0-pro";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

router.get("/:id", async (req, res) => {
  const userInput = req.body.userInput;
  const id = Number(req.params.id);
  const item = await prisma.item.findFirst({
    where: {
      itemId: id,
    },
    select: {
      name: true,
      description: true,
    },
  });
  if (!item) {
    res.status(411).json({ message: "no such item found" });
    return;
  }

  try {
    const response = await getAIResponse({ userInput, item });
    res.status(200).json({
      message: "Successfully received response from AI",
      response: response,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Gemini internal error" });
    return;
  }
});

interface AIResponseType {
  userInput: string;
  item: {
    name: string;
    description: string;
  };
}

const getAIResponse = async ({ userInput, item }: AIResponseType) => {
  try {
    if (userInput === "") {
      return;
    }
    const generationConfig = {
      temperature: 0.5,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      {
        text: "I am giving you a question, along with a item name and description of the item, use this and do a web search to find the answer.",
      },
      {
        text: `The item name is ${item.name} and description of the item is as follows: ${item.description}. My question to you is ${userInput}`,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
    const response = String(result.response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Gemini mar gya");
  }
};

export default router;
