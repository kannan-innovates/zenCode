import express from 'express';
import cors from 'cors';
const app = express();
import { connectDB } from './config/database';
import { errorHandler } from './shared/middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import authRouter from './modules/auth/auth.routes';
import passport from './config/passport';


app.use(cors({
     origin: [
          process.env.FRONTEND_URL || 'http://localhost:5173',
          'http://localhost:5173',
          'http://localhost:5174'
     ],
     credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use(passport.initialize());

connectDB();

// Routes
app.use('/api/auth', authRouter);

app.use(errorHandler)

app.get('/health', (req, res) => {
     res.send('Health Route is working ')
})

export default app;