import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MainView() {
  const [word, setWord] = useState(""); // Word to be translated
  const [wordId, setWordId] = useState(null);
  const [lastWordId, setLastWordId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEnglishToFinnish, setIsEnglishToFinnish] = useState(true); // State to track language mode
  const [points, setPoints] = useState(0); // New state for tracking points

  const fetchRandomWord = async () => {
    try {
      let response, data;
      do {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/locations/random-word?lang=${
            isEnglishToFinnish ? "en" : "fi"
          }`
        );
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        console.log("Data received:", data);
      } while (data.id === lastWordId);

      setWord(data.word);
      setWordId(data.id);
      setError("");
      setLastWordId(data.id);
    } catch (err) {
      console.error("Error fetching random word:", err);
      setError("Failed to fetch a new word. Please try again.");
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, [isEnglishToFinnish]); // Refetch when language mode changes

  const toggleLanguage = () => {
    setIsEnglishToFinnish(!isEnglishToFinnish);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/locations/${wordId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch word details.");
      }
      const data = await response.json();
      const correctTranslation = isEnglishToFinnish
        ? data.finnish
        : data.english;

      if (correctTranslation.toLowerCase() === inputValue.toLowerCase()) {
        setSuccessMessage("Correct translation!");
        setError("");
        setPoints(points + 1); // Increase points by 1
        fetchRandomWord();
        setInputValue("");
      } else {
        setSuccessMessage("");
        setError("Incorrect translation. Try again.");
        setPoints(0); // Reset points on wrong answer
      }
    } catch (err) {
      console.error("Error on form submission:", err);
      setError("Error checking the translation. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container">
      <button onClick={toggleLanguage} className="button">
        Switch to{" "}
        {isEnglishToFinnish ? "Finnish to English" : "English to Finnish"}
      </button>
      <h1>Translate the word: {word}</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          className="input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter ${
            isEnglishToFinnish ? "Finnish" : "English"
          } translation`}
        />
        <button type="submit" className="button">
          Check
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <div className="points">Points: {points}</div>{" "}
      {/* Styled points display */}
    </div>
  );
}

export default MainView;
