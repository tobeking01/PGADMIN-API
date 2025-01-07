// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: process.env.PGPOOLSIZE || 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout after 2 seconds if a connection cannot be established
});

// Handle errors globally for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
  process.exit(-1);
});

// Helper function to log queries in development mode
const logQuery = (text, params) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Executing query:', text, 'with params:', params);
  }
};

module.exports = {
  /**
   * Executes a database query using the pool.
   *
   * @param {string} text - The SQL query string
   * @param {Array} params - The query parameters
   * @returns {Promise} - A promise that resolves to the query result
   */
  query: async (text, params) => {
    try {
      logQuery(text, params);
      return await pool.query(text, params);
    } catch (err) {
      console.error('Database query error:', err.message);
      throw new Error('Database query failed. Please try again later.');
    }
  },

  /**
   * Provides a pool client for manual transactions or advanced queries.
   * Don't forget to release the client back to the pool when done.
   *
   * @returns {Promise<PoolClient>} - A promise that resolves to a pool client
   */
  getClient: async () => {
    try {
      return await pool.connect();
    } catch (err) {
      console.error('Failed to get client from PostgreSQL pool:', err.message);
      throw new Error('Unable to connect to the database.');
    }
  },

  /**
   * Gracefully shuts down the pool to release database connections.
   */
  shutdown: async () => {
    try {
      console.log('Closing PostgreSQL connection pool...');
      await pool.end();
    } catch (err) {
      console.error('Error during PostgreSQL pool shutdown:', err.message);
    }
  },
};
