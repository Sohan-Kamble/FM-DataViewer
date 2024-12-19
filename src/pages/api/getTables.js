import mysql from 'mysql2/promise';

let cachedTables = null; // Cache to store tables temporarily
let cacheTime = null;

export default async function handler(req, res) {
  try {
    const now = Date.now();
    
    // Cache for 10 seconds
    if (cachedTables && cacheTime && now - cacheTime < 10000) {
      return res.status(200).json({ tables: cachedTables });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query('SHOW TABLES');
    await connection.end();

    const tables = rows.map((row) => Object.values(row)[0]);

    // Store tables in cache
    cachedTables = tables;
    cacheTime = now;

    return res.status(200).json({ tables });
  } catch (error) {
    console.error('Error fetching tables:', error.message);
    return res.status(500).json({ error: 'Failed to fetch tables from the database.' });
  }
}