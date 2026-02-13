import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import policiesRouter from './src/routes/policies.js';
import healthRoutes from './src/routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow local development and Vercel production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and 127.0.0.1 (any port)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow any IP on 192.168.1.x network (any port)
    if (/^https?:\/\/192\.168\.1\.\d+(?::\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel domains and your custom domain
    if (origin.includes('vercel.app') || origin.includes('yourdomain.com')) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policiesRouter);
app.use('/api', healthRoutes);

app.get('/', (req, res) => res.json({ 
  message: 'Motor Insurance API running',
  timestamp: new Date().toISOString()
}));

// Get local network IP dynamically
import os from 'os';
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
  app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Network access: http://${localIP}:${PORT}`);
    console.log(`🏠 Local access: http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;