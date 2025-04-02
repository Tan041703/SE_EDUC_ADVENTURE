import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../Game.css";
import teammate1 from "../assets/Member.jpg";
import teammate2 from "../assets/Members.jpg";
import leader from "../assets/Leader.jpeg";
import background from "../assets/Background.jpg";
import instructionsImg from "../assets/instructions.jpg";
import correctSound from "../assets/correct.mp3";
import wrongSound from "../assets/wrong.mp3";

const difficulties = {
  easy: [
    { image: "/assets/china.png", jumbledWord: "AHCIN", hint: "A country in Asia, known for the Great Wall", answer: "CHINA" },
    { image: "/assets/india.png", jumbledWord: "IDNAI", hint: "A country in Asia, known for the Taj Mahal", answer: "INDIA" },
    { image: "/assets/japan.png", jumbledWord: "JPAAN", hint: "An island country in Asia, known for Mount Fuji", answer: "JAPAN" },
    { image: "/assets/south-korea.png", jumbledWord: "SHTOEKURORA", hint: "A country in East Asia, known for K-pop", answer: "SOUTHKOREA" },
    { image: "/assets/indonesia.png", jumbledWord: "OINEDSIA", hint: "A Southeast Asian country with many islands", answer: "INDONESIA" },
    { image: "/assets/thailand.png", jumbledWord: "TILHNAID", hint: "A country in Southeast Asia, known for its beaches", answer: "THAILAND" },
    { image: "/assets/malaysia.png", jumbledWord: "MASYLIA", hint: "A country in Southeast Asia, known for Petronas Towers", answer: "MALAYSIA" },
  ],
  medium: [
    { image: "/assets/andromeda.png", jumbledWord: "DAONERMDAA", hint: "A galaxy closest to the Milky Way", answer: "ANDROMEDA" },
    { image: "/assets/milky-way.png", jumbledWord: "MILKAY WAY", hint: "Our galaxy", answer: "MILKY WAY" },
    { image: "/assets/whirlpool.png", jumbledWord: "PLRHOIWIR", hint: "A galaxy known for its spiral shape", answer: "WHIRLPOOL" },
    { image: "/assets/elliptical.png", jumbledWord: "PILTCILAE", hint: "A galaxy that has an elliptical shape", answer: "ELLIPTICAL" },
    { image: "/assets/black-eye.png", jumbledWord: "BKCAEL-EOY", hint: "A spiral galaxy, often called the Black Eye Galaxy", answer: "BLACK EYE" },
    { image: "/assets/triangulum.png", jumbledWord: "TURGAONIM", hint: "A spiral galaxy, part of the Local Group", answer: "TRIANGULUM" },
    { image: "/assets/peculiar.png", jumbledWord: "ULCIRPEA", hint: "A galaxy known for its peculiar shape", answer: "PECULIAR" },
  ],
  hard: [
    { image: "/assets/abraham-lincoln.png", jumbledWord: "AHAERM LINCOLN", hint: "16th President of the United States", answer: "ABRAHAM LINCOLN" },
    { image: "/assets/roosevelt.png", jumbledWord: "THEODORE ROOSEVELT", hint: "26th President of the United States", answer: "THEODORE ROOSEVELT" },
    { image: "/assets/obama.png", jumbledWord: "BARACK OBAMA", hint: "44th President of the United States", answer: "BARACK OBAMA" },
    { image: "/assets/jefferson.png", jumbledWord: "THOMAS JEFFERSON", hint: "3rd President of the United States", answer: "THOMAS JEFFERSON" },
    { image: "/assets/john-adams.png", jumbledWord: "JOHN ADAMS", hint: "2nd President of the United States", answer: "JOHN ADAMS" },
    { image: "/assets/fdr.png", jumbledWord: "FRANKLIN D. ROOSEVELT", hint: "32nd President of the United States", answer: "FRANKLIN D. ROOSEVELT" },
    { image: "/assets/kennedy.png", jumbledWord: "JOHN F. KENNEDY", hint: "35th President of the United States", answer: "JOHN F. KENNEDY" },
  ]
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Game = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzles, setPuzzles] = useState(difficulties[difficulty]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setPuzzles(difficulties[difficulty]);
    setCurrentPuzzle(0);
    setScore(0);
    setCoins(0);
    setGameOver(false);
    setSelectedLetters([]);
    setShuffledLetters(shuffleArray(difficulties[difficulty][0].jumbledWord.replace(" ", "").split("")));
  }, [difficulty]);

  const playSound = (isCorrect) => {
    const audio = new Audio(isCorrect ? correctSound : wrongSound);
    audio.play();
  };

  const handleSubmitAnswer = () => {
    const currentAnswer = selectedLetters.join("").toUpperCase();
    if (currentAnswer === puzzles[currentPuzzle].answer) {
      playSound(true);
      setScore(score + 1);
      setCoins(coins + 1);
      if (currentPuzzle + 1 < puzzles.length) {
        setCurrentPuzzle(currentPuzzle + 1);
        setSelectedLetters([]);
        setShuffledLetters(shuffleArray(puzzles[currentPuzzle + 1].jumbledWord.replace(" ", "").split("")));
      } else {
        setGameOver(true);
      }
    } else {
      playSound(false);
      setSelectedLetters([]);
    }
  };

  const handleUseHint = () => {
    if (coins >= 2 && !hintUsed) {
      setCoins(coins - 2);
      setHintUsed(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCurrentPuzzle(0);
    setScore(0);
    setCoins(0);
    setSelectedLetters([]);
    setShuffledLetters(shuffleArray(puzzles[currentPuzzle].jumbledWord.replace(" ", "").split("")));
  };

  return (
    <div className="game-container" style={{ backgroundImage: `url(${background})` }}>
      {!gameStarted ? (
        <div className="start-screen">
          
          <div className="difficulty-section">
            <h2 className="section-title">Choose Difficulty:</h2>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="difficulty-select"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => setGameStarted(true)} 
              className="game-button play-button"
            >
              Start Game
            </button>
            <button 
              onClick={() => setShowInstructions(true)} 
              className="game-button instructions-button"
            >
              How to Play
            </button>
          </div>
        </div>
      ) : !gameOver ? (
        <div className="puzzle-screen">
          <div className="puzzle-header">
            <div className="score-display">
              <span>Puzzle: {currentPuzzle + 1}/{puzzles.length}</span>
              <span>Score: {score}</span>
              <span>Coins: {coins}</span>
            </div>

            <div className="hint-section">
              <button 
                onClick={handleUseHint} 
                className="hint-button"
                disabled={coins < 2 || hintUsed}
              >
                {hintUsed ? 'Hint Used' : 'Get Hint (2 coins)'}
              </button>
              {hintUsed && <p className="hint-text">Hint: {puzzles[currentPuzzle].hint}</p>}
            </div>
          </div>

          <div className="puzzle-content">
            <div className="puzzle-image-container">
              <img 
                src={puzzles[currentPuzzle].image} 
                alt="Puzzle" 
                className="puzzle-image"
              />
            </div>

            <h2 className="puzzle-instruction">Unscramble the letters:</h2>
            
            <div className="letter-bank">
              {shuffledLetters.map((letter, index) => (
                <motion.button
                  key={index}
                  className="letter-tile"
                  onClick={() => setSelectedLetters([...selectedLetters, letter])}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {letter}
                </motion.button>
              ))}
            </div>

            <div className="answer-section">
              <h3>Your answer:</h3>
              <div className="answer-display">
                {selectedLetters.join('') || <span className="empty-answer">_ _ _ _ _</span>}
              </div>
              <button 
                onClick={handleSubmitAnswer} 
                className="game-button submit-button"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h1 className="game-over-title">Game Complete!</h1>
          <div className="results-summary">
            <p>Final Score: {score}/{puzzles.length}</p>
            <p>Coins Earned: {coins}</p>
          </div>
          <button 
            onClick={resetGame} 
            className="game-button play-again-button"
          >
            Play Again
          </button>
        </div>
      )}

      {showInstructions && (
        <div className="instructions-modal">
          <div className="instructions-content">
            <h2 className="modal-title">How to Play</h2>
            <img src={instructionsImg} alt="Instructions" className="instruction-image" />
            <ol className="instructions-list">
              <li>Rearrange the jumbled letters to form the correct word</li>
              <li>Click on letters to build your answer</li>
              <li>Submit your answer when you think it's correct</li>
              <li>Earn coins by solving puzzles correctly</li>
              <li>Use coins to buy hints when stuck</li>
            </ol>
            <button 
              className="game-button close-button"
              onClick={() => setShowInstructions(false)}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      <div className="team-section">
        <h2 className="section-title">Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src={teammate1} alt="Team Member 1" className="team-photo" />
            <h3>Team Member 1</h3>
            <p>UI/UX </p>
          </div>
          <div className="team-member">
            <img src={teammate2} alt="Team Member 2" className="team-photo" />
            <h3>Team Member 2</h3>
            <p>Role</p>
          </div>
          <div className="team-member">
            <img src={leader} alt="Team Leader" className="team-photo" />
            <h3>Team Leader</h3>
            <p>Role</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;