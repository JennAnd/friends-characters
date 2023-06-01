import React from "react";
import "./styles/gameinstructions.css";

function GameInstructions({ onClose }) {
  return (
    <div className="game-instructions-popup">
      <div className="game-instructions-text">
        <p>
          "Guess the right character in the TV show Friends! A random character
          from Friends will be displayed. Read the brief article and try to
          guess the right character. If you guess correctly, you'll move on to
          the next character. If your guess is wrong, keep trying until you get
          it right. If you hover over the hidden title you can see the amount af
          characters. If you can't guess the character, you can press the "Next
          Character" button to skip to the next one. Enjoy the game and test
          your Friends knowledge!"
        </p>
      </div>
      <button className="popup-close" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default GameInstructions;
