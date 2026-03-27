// import "dotenv/config";
// // console.log(process.env.VITE_NASA_API_KEY);

import { useState, useEffect } from "react";
import testImages from "./utils/nasa-response";
import { shuffleArray } from "./utils";

import "./App.css";
import "./styles/index.css";

function App() {
  const [rawImages, setRawImages] = useState([]);
  const [gameImages, setGameImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("intro");
  const [level, setLevel] = useState(3);

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  function handlePlayButtonClick() {
    console.log("click");
    console.log(level);
    setGameStatus("playing");
    setSelectedImages([]);
    setGameImages(rawImages.slice(0, level));
  }

  const currentScore = selectedImages.length;

  function handleCardClick(id) {
    console.log("CLICKED", id);

    if (!id) {
      throw new Error("No ID Passed from card");
    }

    if (selectedImages.includes(id)) {
      setGameStatus("lose");
    } else if (!selectedImages.includes(id)) {
      if (currentScore >= highScore) setHighScore(currentScore + 1);

      setSelectedImages([...selectedImages, id]);
      setGameImages(shuffleArray(gameImages));

      if (currentScore + 1 >= gameImages.length) setGameStatus("win");
    }
    // else {
    // }
  }

  useEffect(() => {
    async function fetchData() {
      console.log("API CALL");
      const key = import.meta.env.VITE_NASA_API_KEY;

      const url = `https://api.nasa.gov/planetary/apod?api_key=${key}&count=20`;
      try {
        // const response = await fetch(url);
        // console.log(response);
        // if (!response.ok) {
        //   throw new Error(`Response status: ${response.status}`);
        // }

        // const result = await response.json();
        const result = testImages; // TEMPORARY input to not constantly hit the API

        const images = result
          .filter(({ media_type }) => media_type === "image")
          .slice(0, 20);
        console.log(images);

        setRawImages(images);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <header className="header">
        <div className="title-container">GAME TITLE</div>
        <div className="score-board">
          <p>
            current score: <span>{currentScore}</span>
          </p>
          <p>
            highest score: <span>{highScore}</span>
          </p>
        </div>
      </header>

      {gameStatus === "playing" ? (
        <GameBoard
          images={gameImages}
          handleCardClick={handleCardClick}
          level={level}
        />
      ) : (
        <Dialogue
          gameStatus={gameStatus}
          handleClick={handlePlayButtonClick}
          handleChange={handleLevelChange}
          level={level}
          selectedImages={selectedImages}
          highScore={highScore}
        />
      )}
    </>
  );
}

function Dialogue({
  gameStatus,
  handleClick,
  handleChange,
  level,
  selectedImages,
  highScore,
}) {
  const message =
    gameStatus === "intro" ? (
      <p>
        "Welcome to the memory game!
        <br />
        Each turn you will select a card. To win don't select the same card
        twice"{" "}
      </p>
    ) : gameStatus === "win" ? (
      <p>
        Congratulations, You Win!
        <br />
        {`Your high score was ${highScore} `}
      </p>
    ) : (
      <p>
        Nice try!
        <br />
        {`Your score was ${selectedImages.length}`}
        <br /> {`and your high score was ${highScore} `}
      </p>
    );

  return (
    <div className="dialogue-master">
      <div className="dialogue-container">
        <div className="message-container">{message}</div>

        <button onClick={handleClick}>
          {gameStatus === "intro" ? "Play" : "Play Again"}
        </button>

        <div className="select-container">
          <label>Choose a difficulty: </label>
          <select value={level} onChange={handleChange}>
            <option value={3}>Easy</option>
            <option value={12}>Medium</option>
            <option value={20}>Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function GameBoard({ images, handleCardClick, level }) {
  return (
    <div className="game-board">
      {images.slice(0, level).map(({ date, title, url }) => (
        <Card
          url={url}
          key={date}
          title={title}
          id={date}
          handleClick={handleCardClick}
        />
      ))}
    </div>
  );
}

function Card(props) {
  const { url, title, id, handleClick } = props;

  return (
    <div className="card" onClick={() => handleClick(id)}>
      <img src={url} alt={title} />
      <p>{title}</p>
    </div>
  );
}

export default App;
