import React, { useEffect, useState } from "react";
import axios from "axios";
import "./fonts.css";
import "./index.css";
import LoadingSpinner from "./LoadingSpinner";
import GameInstructions from "./GameInstructions";

function CharacterViewer() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(
    parseInt(localStorage.getItem("currentCharacterIndex")) || 0
  );

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };
  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/characters", {
        headers: {
          Accept: "application/json",
        },
      });
      const charactersWithThumbnail = response.data.filter(
        (character) => character.thumbnail !== null && character.id !== 19359
      );
      const randomizedCharacters = shuffleArray(charactersWithThumbnail);
      setCharacters(randomizedCharacters);

      const storedIndex = localStorage.getItem("currentCharacterIndex");
      if (storedIndex && !isNaN(storedIndex)) {
        setCurrentCharacterIndex(parseInt(storedIndex));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentCharacterIndex !== null && characters.length > 0) {
      setCurrentCharacter(characters[currentCharacterIndex]);
      fetchThumbnail(characters[currentCharacterIndex]);
    }
  }, [characters, currentCharacterIndex]);

  useEffect(() => {
    // Store the current character index in localStorage
    localStorage.setItem(
      "currentCharacterIndex",
      currentCharacterIndex.toString()
    );
  }, [currentCharacterIndex]);

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

  return (
    <div>
      <div className="container">
        <h1 className="game-title">'Friends' Characters </h1>
        <button className="game-rules" onClick={handleShowInstructions}>
          How to play
        </button>
      </div>

      {currentCharacter !== null ? (
        <div className="character-box" key={currentCharacter.id}>
          {/*           <div className="overlay"> */}
          <h2 className="title">{currentCharacter.title}</h2>
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
          {/*     </div> */}
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

//fixa styling på allt bakom popupen med overlay
//Vill lägga till också if no abstract !::null som med thumbnail

/* i want to handle character.abstract the same way as thumbnail: */
/*    const charactersWithThumbnail = response.data.filter(
    (character) => character.thumbnail !== null && character.id !== 19359
    );
    const randomizedCharacters = shuffleArray(charactersWithThumbnail);
    setCharacters(randomizedCharacters); */
