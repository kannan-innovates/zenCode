import express from 'express';
const app = express(); 
import { connectDB } from './config/database'; 

app.use(express.json());

connectDB();

app.get('/health',(req,res)=>{
     res.send('Health Route is working ')
})

export default app;