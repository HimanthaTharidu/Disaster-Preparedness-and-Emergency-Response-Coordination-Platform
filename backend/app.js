import express from 'express';
import cors from 'cors';
import healthRoute from './routes/health.route.js';
import authRoute from './routes/auth.route.js';
import incidentsRoute from './routes/incidents.route.js';
import sheltersRoute from './routes/shelters.route.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/health', healthRoute);
app.use('/auth', authRoute);
app.use('/incidents', incidentsRoute);
app.use('/shelters', sheltersRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
