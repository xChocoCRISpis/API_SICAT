import { pool } from "./src/db/connect.js";

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
}

