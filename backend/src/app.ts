import express from 'express';
import cors from 'cors';
const app = express();
import { connectDB } from './config/database';
import { errorHandler } from './shared/middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import authRouter from './modules/auth/auth.routes';


app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);

connectDB();

app.use(errorHandler)

app.get('/health', (req, res) => {
     res.send('Health Route is working ')
})

export default app;