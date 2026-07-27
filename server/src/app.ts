import express from 'express';
/* import cors from 'cors';
import { env } from './config/env'; */
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// --- Middleware ---

// CORS — configured via environment variable (see §2.11)
/* app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  })
); */

// Body parsing — explicit limit prevents large payload attacks
app.use(express.json({ limit: '10kb' }));

// --- Routes ---
app.use('/api', routes);

// --- Error handling (must be last) ---
app.use(errorHandler);

export default app;
