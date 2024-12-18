import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const tableName = req.query.table;
    const limit = parseInt(req.query.limit) || 100; // Default batch size: 100 rows
    const offset = parseInt(req.query.offset) || 0; // Offset for pagination

    if (!tableName) {
      return res.status(400).json({ error: 'Table name is required.' });
    }

    // Fetch the data with LIMIT and OFFSET
    const [rows] = await pool.query(`SELECT * FROM ?? LIMIT ? OFFSET ?`, [
      tableName,
      limit,
      offset,
    ]);

    // Check if there is more data available
    const [totalRows] = await pool.query(`SELECT COUNT(*) AS count FROM ??`, [tableName]);
    const totalCount = totalRows[0].count;
    const hasMore = offset + limit < totalCount;

    return res.status(200).json({
      data: rows,
      hasMore, // Whether there is more data to fetch
      totalCount, // Total rows in the table
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
}
