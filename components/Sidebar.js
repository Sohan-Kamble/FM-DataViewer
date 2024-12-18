import React, { useEffect, useState } from "react";
import "./sidebar.css"; // Import CSS for styling

export default function Sidebar() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch("/api/getTables"); // Adjust API endpoint if needed
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      }
    }
    fetchTables();
  }, []);

  const handleTableClick = (table) => {
    setSelectedTable(table);
    console.log(`Selected table: ${table}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">Database Tables</div>
      <ul className="sidebar-tables">
        {tables.length > 0 ? (
          tables.map((table) => (
            <li
              key={table}
              className={selectedTable === table ? "active" : ""}
              onClick={() => handleTableClick(table)}
            >
              {table}
            </li>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </div>
  );
}

