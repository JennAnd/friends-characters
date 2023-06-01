import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/fonts.css";
import "./styles/characterviewer.css";
import "./styles/index.css";
import LoadingSpinner from "./LoadingSpinner";
import GameInstructions from "./GameInstructions";
import InputForm from "./InputForm";

function CharacterViewer() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(
    parseInt(localStorage.getItem("currentCharacterIndex")) || 0
  );
  const [guessedTitle, setGuessedTitle] = useState("");
  const [hiddenWords, setHiddenWords] = useState([]);

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  useEffect(() => {
    const titleWords = currentCharacter?.title?.split(" ");

    setHiddenWords(
      titleWords?.map((word) => ({
        word,
        isHidden: !guessedTitle.toLowerCase().includes(word.toLowerCase()),
      })) || []
    );
  }, [currentCharacter?.title, guessedTitle]);

  const handleGuess = (wordIndices, wordGuess) => {
    const newHiddenWords = [...hiddenWords];

    wordIndices.forEach((wordIndex) => {
      const hiddenWord = newHiddenWords[wordIndex];

      if (
        hiddenWord &&
        wordGuess.toLowerCase() === hiddenWord.word.toLowerCase()
      ) {
        hiddenWord.isHidden = false;
      }
    });

    setHiddenWords(newHiddenWords);

    // Check if all words have been correctly guessed
    const isAllWordsGuessed = newHiddenWords.every(
      (hiddenWord) => !hiddenWord.isHidden
    );
    if (isAllWordsGuessed) {
      setGuessedTitle("");
    }

    if (isAllWordsGuessed) {
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/characters", {
        headers: {
          Accept: "application/json",
        },
      });
      const charactersWithThumbnailAndAbstract = response.data.filter(
        (character) =>
          character.thumbnail !== null &&
          character.abstract !== null &&
          character.abstract.length >= 100 &&
          character.id !== 19359 &&
          3398 &&
          1901
        //"id": 9223,
      );

      const randomizedCharacters = shuffleArray(
        charactersWithThumbnailAndAbstract
      );
      setCharacters(randomizedCharacters);

      const storedIndex = localStorage.getItem("currentCharacterIndex");
      if (storedIndex && !isNaN(storedIndex)) {
        setCurrentCharacterIndex(parseInt(storedIndex));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchThumbnail = async (character) => {
    try {
      const response = await axios.get("/api/thumbnails", {
        params: { url: character.thumbnail },
        responseType: "blob",
      });
      const thumbnailUrl = URL.createObjectURL(response.data);
      setCurrentThumbnail(thumbnailUrl);
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const nextCharacter = () => {
    setCurrentCharacterIndex((prevIndex) => {
      const newIndex = prevIndex === characters.length - 1 ? 0 : prevIndex + 1;
      localStorage.setItem("currentCharacterIndex", newIndex.toString());
      return newIndex;
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    const truncatedText = text.substring(0, maxLength);
    return truncatedText.replace(/\s+\S*$/, "...");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentCharacterIndex !== null && characters.length > 0) {
      setCurrentCharacter(characters[currentCharacterIndex]);
      fetchThumbnail(characters[currentCharacterIndex]);
    }
  }, [characters, currentCharacterIndex]);

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (currentCharacter !== null) {
        await fetchThumbnail(currentCharacter);
      }
    };

    fetchCharacterData();
  }, [currentCharacter]);

  useEffect(() => {
    // Store the current character index in localStorage
    localStorage.setItem(
      "currentCharacterIndex",
      currentCharacterIndex.toString()
    );
  }, [currentCharacterIndex]);

  return (
    <div>
      <div className="input-container">
        <div className="input-box">
          <InputForm onGuess={handleGuess} hiddenWords={hiddenWords} />
        </div>
      </div>
      <div className="container">
        <h1 className="game-title">'Friends' Characters</h1>
        <button className="game-rules" onClick={handleShowInstructions}>
          How to play
        </button>
      </div>
      {currentCharacter !== null ? (
        <div className="character-box" key={currentCharacter.id}>
          <div className="title-box">
            <h2
              className={`title ${
                hiddenWords.every((hiddenWord) => hiddenWord.isHidden)
                  ? ""
                  : "guessed"
              }`}
            >
              {hiddenWords.map((hiddenWord, index) => (
                <div
                  key={index}
                  className={`box ${hiddenWord.isHidden ? "hidden" : ""}`}
                  title={`${hiddenWord.word.length} characters`}
                  style={{
                    backgroundColor: hiddenWord.isHidden
                      ? "#dc8400"
                      : "inherit",
                    display: "inline-block",
                    marginRight: "5px",
                    marginBottom: "5px",
                    paddingRight: "5px",
                    border: "1px",
                    borderRadius: "2px",
                  }}
                >
                  <span
                    className={`box-content ${
                      hiddenWord.isHidden ? "hidden" : ""
                    }`}
                    style={{
                      visibility: hiddenWord.isHidden ? "hidden" : "visible",
                      color: "#dc8400",
                      fontSize: "26px",
                      fontFamily: "Trade Gothic Bold Condensed",
                    }}
                  >
                    {hiddenWord.isHidden ? (
                      <input
                        type="text"
                        value=""
                        onChange={(e) => handleGuess(index, e.target.value)}
                      />
                    ) : (
                      hiddenWord.word
                    )}
                  </span>
                </div>
              ))}
            </h2>
          </div>

          <p className="abstract">
            {truncateText(currentCharacter.abstract, 499)}
          </p>
          {currentThumbnail && (
            <img
              className="image"
              src={currentThumbnail}
              alt={currentCharacter.title}
            />
          )}
          {showInstructions && (
            <GameInstructions onClose={handleCloseInstructions} />
          )}
          <button className="next-button" onClick={nextCharacter}>
            Next Character
          </button>
        </div>
      ) : (
        <div className="spinner-wrapper">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default CharacterViewer;
