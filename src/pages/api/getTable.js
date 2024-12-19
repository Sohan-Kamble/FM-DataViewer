// src/pages/api/getTable.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    if (req.method === 'GET') {
      const tableName = req.query.table;

      if (tableName) {
        console.log(`Fetching data for table: ${tableName}`);
        
        // Add a LIMIT clause to avoid fetching too much data
        const [rows] = await connection.query(
          `SELECT * FROM ?? LIMIT 100`, // Limit to 100 rows
          [tableName]
        );

        console.log(`Data fetched from table "${tableName}":`, rows);

        await connection.end();
        return res.status(200).json({ data: rows });
      } else {
        return res.status(400).json({ error: 'Table name is required.' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
}