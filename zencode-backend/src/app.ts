import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from '@modules/auth/auth.routes';
import userRoutes from '@modules/user/user.routes'

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

export default app;
