import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainView from "./MainView";
import AdminView from "./AdminView";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminView />} />
        <Route path="/" element={<MainView />} />
      </Routes>
    </Router>
  );
}

export default App;
