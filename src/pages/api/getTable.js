import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const tableName = req.query.table; // Get table name from query

    if (!tableName) {
      console.error('No table name provided in the query.');
      return res.status(400).json({ error: 'Table name is required.' });
    }

    console.log(`Fetching data for table: ${tableName}`);

    // Fetch all data from the table (without LIMIT)
    const [rows] = await pool.query(`SELECT * FROM ??`, [tableName]);

    console.log(`Data fetched from table "${tableName}":`, rows);

    if (rows.length === 0) {
      console.error(`No data found in table: ${tableName}`);
      return res.status(200).json({ message: 'No data available for this table.' });
    }

    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
}