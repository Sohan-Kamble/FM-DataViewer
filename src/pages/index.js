import { useEffect, useState } from 'react';

export default function Home() {
  const [tables, setTables] = useState([]); // List of table names
  const [selectedTable, setSelectedTable] = useState(null); // Currently selected table
  const [tableData, setTableData] = useState([]); // Data of the selected table
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the list of tables from the API on component mount
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        console.log("Fetching tables...");
        const res = await fetch('/api/getTables');

        if (!res.ok) {
          throw new Error(`Error fetching tables: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Tables fetched:", data.tables);

        setTables(data.tables || []);
      } catch (err) {
        console.error("Error:", err.message);
        setError("Failed to load tables. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Fetch data of a specific table
  const fetchTableData = async (tableName) => {
    setLoading(true);
    setError(null);
    setSelectedTable(tableName);
    setTableData([]); // Clear previous table data

    try {
      console.log(`Fetching data for table: ${tableName}`);
      const res = await fetch(`/api/getTable?table=${tableName}`);

      if (!res.ok) {
        throw new Error(`Error fetching table data: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.data && data.data.length > 0) {
        console.log("Table data fetched:", data.data);
        setTableData(data.data);
      } else {
        setError("No data available for this table.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to fetch table data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Database Tables</h1>

      {/* Display the list of tables */}
      <div style={{ marginBottom: "20px" }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && tables.length === 0 && <p>No tables found.</p>}

        {!loading && tables.length > 0 && (
          <div>
            <p>Select a table to view its data:</p>
            {tables.map((table, index) => (
              <button
                key={index}
                onClick={() => fetchTableData(table)}
                style={{
                  margin: "5px",
                  padding: "10px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {table}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Display data for the selected table */}
      {selectedTable && tableData.length > 0 && (
        <div>
          <h2>Data for Table: {selectedTable}</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "left",
                    }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No data message */}
      {selectedTable && tableData.length === 0 && !loading && !error && (
        <p>No data available for this table.</p>
      )}
    </div>
  );
}