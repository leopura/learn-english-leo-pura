import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainView from "./MainView";
import AdminView from "./AdminView";
import Header from "./Header";
import Footer from "./Footer";
import "./index.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
      <Footer /> {/* Include the Footer component */}
    </Router>
  );
}

export default App;
