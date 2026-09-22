import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

// Route imports
// import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';





// Resolve __dirname in ES Modules & load .env from the Backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });








const app = express();
// home route
app.get('/', (_req, res) => {
  Console.log('Server is running');
  res.send('Server is running');
});


// ─── Middleware...
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));






// Routes...
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);






// ─── 404 Handler 
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});




//  Global Error Handler..
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});






// Start Server...
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});


export default app;
