import React, { useEffect } from "react";
import "./index.css";

function InputForm() {
  return (
    <div>
      <div>
        <form>
          {" "}
          <label htmlFor="guess">Your guess:</label>
          <input type="text" id="guess" name="guess" autoComplete="off" />
          <button className="submit-guess" type="submit">
            Guess
          </button>
        </form>
      </div>{" "}
    </div>
  );
}
export default InputForm;
