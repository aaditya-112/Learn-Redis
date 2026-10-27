import express from  "express";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const redis = new Redis(process.env.REDIS_URL);

app.get('/redis',async (req, res)=>{
    const reply = await redis.ping();
    res.json({ redis:reply});
})

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})

