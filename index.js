const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/auth', authRoutes); 

// Display all routes in the app
function displayRoutes(app) {
    console.log('Available routes:');
    app._router.stack.forEach((middleware) => {
      if (middleware.route) { // Routes registered directly on the app
        const method = Object.keys(middleware.route.methods)[0].toUpperCase();
        console.log(`${method} ${middleware.route.path}`);
      } else if (middleware.name === 'router') { // Router middleware
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
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    displayRoutes(app);  // Call displayRoutes here to show all routes at startup
  });

  // Setting up the root endpoint for the API
app.get("/", (req, res) => {
  res.send("Welcome to the PGAdmin API!");
});

