import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './src/routes/auth.js';
import policiesRouter from './src/routes/policies.js';
import healthRoutes from './src/routes/health.js';
import os from 'os';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);

// Dynamic CORS origin configuration
const getCorsOrigin = (origin, callback) => {
  const allowedOrigins = [
    'http://localhost:3000',      // Local React dev
    'http://localhost:5000',      // Local backend
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
  ];

  // Add network IP addresses (192.168.1.x)
  if (origin && /^https?:\/\/192\.168\.1\.\d+(?::\d+)?$/.test(origin)) {
    allowedOrigins.push(origin);
  }

  // Add production URLs from environment
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  
  // Add any domain with vercel.app
  if (origin && origin.includes('vercel.app')) {
    return callback(null, true);
  }

  // Allow requests with no origin (Postman, mobile apps, etc)
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  }
};

export const io = new Server(httpServer, {
  cors: {
    origin: getCorsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// CORS - Allow local development and production
app.use(cors({
  origin: getCorsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policiesRouter);
app.use('/api', healthRoutes);

app.get('/', (req, res) => res.json({ 
  message: 'Motor Insurance API running',
  timestamp: new Date().toISOString()
}));

// Get local network IP dynamically
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

// Only start server if not in Vercel (serverless environment)
if (process.env.VERCEL !== '1') {
  httpServer.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Network access: http://${localIP}:${PORT}`);
    console.log(`🏠 Local access: http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;