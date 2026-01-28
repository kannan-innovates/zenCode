import express from 'express';
const app = express(); 
import { connectDB } from './config/database'; 
import { errorHandler } from './shared/middlewares/error.middleware';

app.use(express.json());

connectDB();

app.use(errorHandler)

app.get('/health',(req,res)=>{
     res.send('Health Route is working ')
})

export default app;