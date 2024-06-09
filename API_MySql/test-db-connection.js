import { pool } from "./src/db/connect.js";

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('(MYSQL) Connected to the database');
    connection.release();
  } catch (err) {
    console.error('(MSYQL) Error connecting to the database:', err.message);
  }
}

