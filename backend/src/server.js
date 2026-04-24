const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for Vite frontend
const corsOptions = {
  origin: '*', // In production, restrict this to frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// WebSocket Setup
const io = new Server(server, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('assign-task', (taskData) => {
    console.log('Task assigned by admin:', taskData);
    // Broadcast to all clients (in a real app, you'd target specific teams)
    io.emit('task-assigned', taskData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Attach io to req so controllers can broadcast events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import Routes
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const googleAuthRoutes = require('./routes/googleAuth');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/auth/google', googleAuthRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResQNet API is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
