import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [thumbnails, setThumbnails] = useState({});

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
      const randomizedCharacters = shuffleArray(response.data);
      setCharacters(randomizedCharacters);
      fetchThumbnails(randomizedCharacters);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchThumbnails = async (characters) => {
    const thumbnailPromises = characters
      .filter((character) => character.thumbnail !== null)
      .map(async (character) => {
        try {
          const response = await axios.get("/api/thumbnails", {
            params: { url: character.thumbnail },
            responseType: "blob",
          });
          const thumbnailUrl = URL.createObjectURL(response.data);
          setThumbnails((prevThumbnails) => ({
            ...prevThumbnails,
            [character.id]: thumbnailUrl,
          }));
        } catch (error) {
          console.error("Error fetching thumbnail:", error);
        }
      });

    await Promise.all(thumbnailPromises);
  };

  // shuffle the array randomly
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

  return (
    <div>
      {characters
        .filter((character) => character.thumbnail !== null)
        .map((character) => (
          <div key={character.id}>
            <h2>{character.title}</h2>
            <p>{character.abstract}</p>
            {thumbnails[character.id] && (
              <img src={thumbnails[character.id]} alt={character.title} />
            )}
          </div>
        ))}
    </div>
  );
}

export default App;
