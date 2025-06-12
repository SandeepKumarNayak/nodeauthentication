import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import authRouter from './router/authRouter.js';
import postRouter from './router/postRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());


// MongoDB connection
mongoose.connect(MONGO_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
})


app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})



