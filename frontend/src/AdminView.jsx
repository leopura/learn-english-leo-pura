import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [wordPairs, setWordPairs] = useState([]);
  const [finnishWord, setFinnishWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");

  const handleLogin = () => {
    if (password === "admin") {
      setIsLoggedIn(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWordPairs();
    }
  }, [isLoggedIn]);

  const fetchWordPairs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/locations`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWordPairs(data); // Assuming the data is an array of word pairs
    } catch (err) {
      console.error("Error fetching word pairs:", err);
      // Handle errors, such as updating the UI to show an error message
    }
  };

  const handleAddWordPair = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ finnish: finnishWord, english: englishWord }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchWordPairs(); // Re-fetch word pairs to update the list
    } catch (err) {
      console.error("Error adding word pair:", err);
      // Handle errors, such as showing an error message
    }
  };

  const handleDeleteWordPair = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/locations/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchWordPairs(); // Re-fetch word pairs to update the list
    } catch (err) {
      console.error("Error deleting word pair:", err);
      // Handle errors, such as showing an error message
    }
  };
  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Login</h1>
        <div className="form">
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button className="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin View</h1>
      <form className="form" onSubmit={handleAddWordPair}>
        <input
          className="input"
          type="text"
          placeholder="Finnish word"
          value={finnishWord}
          onChange={(e) => setFinnishWord(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="English word"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
        />
        <button className="button" type="submit">
          Add Word Pair
        </button>
      </form>
      <ul className="list">
        {wordPairs.map((pair) => (
          <li className="list-item" key={pair.id}>
            {pair.finnish} - {pair.english}
            <button
              className="button"
              onClick={() => handleDeleteWordPair(pair.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button>
        <Link to="/" className="button">
          Back to Main View
        </Link>{" "}
        {/* Link to AdminView */}
      </button>
    </div>
  );
}

export default AdminView;
