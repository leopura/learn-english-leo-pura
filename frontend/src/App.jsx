import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainView from "./MainView";

function App() {
  return (
    <div className="App">
      <MainView />
    </div>
  );
}

/*
function App() {
  const fetchIt = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/locations`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data); // You might want to set this data to some state variable
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  return (
    <>
      <h1>Words</h1>
      <button onClick={fetchIt}>Fetch</button>
    </>
  );
}
*/
export default App;