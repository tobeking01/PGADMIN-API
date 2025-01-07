const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet'); // Security middleware
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatSocket = require('./websockets/chatSocket');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Apply security-related HTTP headers
app.use(helmet());

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or mobile apps) or check allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
};

app.use(cors(corsOptions));

// Register authentication routes
app.use('/api/auth', authRoutes);

// Register chat routes
app.use('/api/chat', chatRoutes);

// Define the root endpoint explicitly
app.get('/', (req, res) => {
  res.send('Welcome to the PGAdmin API!');
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: ['GET', 'POST'],
  },
});

// Set up WebSocket connections
chatSocket(io);

// Utility function to display all available routes
function displayRoutes(app) {
  console.log('Available routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const method = Object.keys(middleware.route.methods)[0].toUpperCase();
      console.log(`${method} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          const method = Object.keys(route.methods)[0].toUpperCase();
          console.log(`${method} ${route.path}`);
        }
      });
    }
  });
}

// Start server and display routes
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  displayRoutes(app);
});
