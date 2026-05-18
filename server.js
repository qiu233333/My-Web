import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "你还没有输入内容哦。" });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        {
          role: "system",
          content: "你是一个可爱的二次元网站桌宠，说话简短、活泼、温柔。"
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "呜呜，后端或者 DeepSeek API 出错了。"
    });
  }
});

app.listen(PORT, () => {
  console.log(`桌宠后端已启动：http://localhost:${PORT}`);
});