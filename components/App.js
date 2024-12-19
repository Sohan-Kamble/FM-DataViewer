import React from "react";
import Sidebar from "./Sidebar";

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <h1>Welcome to Data Viewer</h1>
        <p>Select a table from the sidebar to view its content.</p>
      </div>
    </div>
  );
}
