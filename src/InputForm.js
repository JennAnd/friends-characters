import React, { useEffect, useState } from "react";
import "./styles/inputform.css";

function InputForm({ onGuess, hiddenWords }) {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Split the guess into individual words
    const words = guess.split(" ");

    // Find the word indices of the hidden words in the guess
    const wordIndices = words.reduce((indices, word, index) => {
      const hiddenWordIndex = hiddenWords.findIndex(
        (hiddenWord) => hiddenWord.word.toLowerCase() === word.toLowerCase()
      );
      if (hiddenWordIndex !== -1) {
        indices.push(hiddenWordIndex);
      }
      return indices;
    }, []);

    onGuess(wordIndices, guess);
    setGuess("");
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
  };

  const handleChange = (event) => {
    setGuess(event.target.value);
  };

  const isGuessedWordMatching = (word) => {
    return hiddenWords.some(
      (hiddenWord) => hiddenWord.word.toLowerCase() === word.toLowerCase()
    );
  };

  useEffect(() => {
    if (hiddenWords.every((hiddenWord) => !hiddenWord.isHidden)) {
      setGuesses([]);
    }
  }, [hiddenWords]);

  return (
    <div className="input-form-container">
      <div className="input-form">
        <form onSubmit={handleSubmit}>
          <div className="input-label">
            <label htmlFor="guess">Your guess:</label>
          </div>
          <input
            type="text"
            id="guess"
            name="guess"
            autoComplete="off"
            value={guess}
            onChange={handleChange}
          />
          <button className="submit-guess" type="submit">
            Guess
          </button>
        </form>
      </div>
      <div className="your-guesses">
        {guesses.map((guess, index) => (
          <p
            key={index}
            className={isGuessedWordMatching(guess) ? "matching-guess" : ""}
          >
            {guess}
          </p>
        ))}
      </div>
    </div>
  );
}

export default InputForm;
