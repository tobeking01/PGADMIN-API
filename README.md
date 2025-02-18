# PGAdmin API

A RESTful API for managing authentication and user-related operations. Built with Node.js and Express, and uses PostgreSQL as the database.

## Features
    - User Registration
    - User Login
    - JWT Authentication
    - Protected Routes

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tobeking01/PGADMIN-API.git


2. Install dependencies:
    - npm install

3. Create a .env file with the following environment variables:
    -  PGUSER=postgres
    -  PGHOST=localhost
    -  PGPASSWORD=<YOUR_PASSWORD>
    -  PGDATABASE=AuthDB
    -  PGPORT=5432
    -  PORT=3000
    -  JWT_SECRET=<YOUR_SECRET_KEY>
    -  SALT_ROUNDS=10

4. Start the server:
    - npm start

5. Available Routes
    - POST /register - Register a new user.
    - POST /login - Authenticate a user and return a JWT.
    - GET /profile - Retrieve user details (protected route).

6. Tech Stack
    - Node.js: Backend runtime.
    - Express.js: Web framework.
    - PostgreSQL: Relational database.
    - JWT: Token-based authentication.