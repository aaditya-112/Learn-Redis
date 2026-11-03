import "dotenv/config";
import express, { json } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.post("/user/:id/json",async(req, res)=>{
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({savedAs: "json"});
});
app.get("/user/:id/json", async(req,res)=>{
    const row = await redis.get(`user:${req.params.id}:json`);
    res.json({user:row ? JSON.parse(row):null});
});

app.post("/user/:id/hash", async (req, res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body);
    res.json({savedAS:"hash"});

})
app.get("/user/:id/hash", async(req, res)=>{
    const data = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({data});
})

app.delete("/user/:id/json", async(req, res)=>{
    await redis.del(`user:${req.params.id}:json`);
    res.json({"message": "done "})
})

app.listen(5000, (req, res)=>{
    console.log("srever is on port 5000")
})