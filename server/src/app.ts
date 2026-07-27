import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// --- Middleware ---

// CORS — More flexible for debugging
const allowedOrigins = [
  env.CLIENT_URL,
  'https://find-ambulances-and-doctor-client.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('🔍 CORS Origin Check:', { 
        receivedOrigin: origin, 
        allowedOrigins,
        match: origin ? allowedOrigins.includes(origin) : false
      });
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));

// --- Routes ---
app.use('/api', routes);

// --- Error handling (must be last) ---
app.use(errorHandler);

export default app;
