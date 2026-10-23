import express from 'express';
import cors from 'cors';
import healthRoute from './routes/health.route.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/health', healthRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
