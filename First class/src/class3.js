import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

function otpKey(phone){
    return `otp:${phone}`;
}

app.get('/test', (req, res)=>{
    res.status(200).json({message:"api is working"})
})

app.post('/opt',async (req, res)=>{
    const {phone} = req.body;
    const otp = Math.floor(10000+ Math.random() * 90000). toString();

    await redis.set(otpKey(phone),otp, "EX", 30); //otp valid for 30 seconds
     res.json({message:`OTP sent`,otp});
});

app.post('/otp/verify',async (req,res)=>{
    const {phone, otp} = req.body;
    const savedOtp = await redis.get(otpKey(phone));

    if(!savedOtp){
        return res.status(400).json({message:"otp expired or not found"});
    };

    if(savedOtp !== otp){
        return res.status(400).json({message:"invalid otp"});
    }

    await redis.del(otpKey(phone));
     
    res.json({message:"OTP verified successfully"});
});

app.get('/otp/:phone/ttl',async (req, res)=>{
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ttl});
});

app.listen(4000,()=>{
    console.log(`Server running on port 4000`);
})
