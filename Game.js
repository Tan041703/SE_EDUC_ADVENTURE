import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../Game.css";

// Import all game images
import teammate1 from "../assets/Member.jpg";
import teammate2 from "../assets/Members.jpg";
import leader from "../assets/Leader.jpeg";
import background from "../assets/Background.jpg";
import instructionsImg from "../assets/instructions.jpg";
import correctSound from "../assets/correct.mp3";
import wrongSound from "../assets/wrong.mp3";
import settingsIcon from "../assets/settings.png";
import exitIcon from "../assets/exit.png";
import BackgroundMusic from "../assets/BackgroundMusic.mp3";
import trophyIcon from "../assets/trophy.png";
import coinIcon from "../assets/coin.png";

// Import puzzle images
import chinaImage from "../assets/china.png";
import indiaImage from "../assets/india.png";
import japanImage from "../assets/japan.png";
import amazonImage from "../assets/amazon.png";
import saharaImage from "../assets/sahara.png";
import everestImage from "../assets/mount-everest.png";
import waterImage from "../assets/water.png";
import sunImage from "../assets/sun.png";
import dnaImage from "../assets/dna.png";
import atomImage from "../assets/atom.png";
import blackholeImage from "../assets/black-hole.png";
import romeImage from "../assets/rome.png";
import egyptImage from "../assets/egypt.png";
import renaissanceImage from "../assets/renaissance.png";
import industrialImage from "../assets/industrial-revolution.png";

// Enhanced educational content with categories
const categories = {
  geography: {
    easy: [
      { image: chinaImage, jumbledWord: "AHCINFRJDSND", hint: "A country in Asia, known for the Great Wall", answer: "CHINA", fact: "China has the world's largest population with over 1.4 billion people." },
      { image: indiaImage, jumbledWord: "IDNAIDHSJCIS", hint: "A country in Asia, known for the Taj Mahal", answer: "INDIA", fact: "India invented the number zero and the decimal system." },
      { image: japanImage, jumbledWord: "JPAANGNEVWVN", hint: "An island country in Asia, known for Mount Fuji", answer: "JAPAN", fact: "Japan has more than 6,800 islands in its archipelago." }
    ],
    medium: [
      { image: amazonImage, jumbledWord: "MAZAONSSJEDP", hint: "The world's largest rainforest", answer: "AMAZON", fact: "The Amazon produces 20% of the world's oxygen." },
      { image: saharaImage, jumbledWord: "SAHADSADRTDF", hint: "The largest hot desert in the world", answer: "SAHARA", fact: "The Sahara is almost as large as the entire United States." }
    ],
    hard: [
      { image: everestImage, jumbledWord: "TEVEMERSSEDS", hint: "The highest mountain above sea level", answer: "EVEREST", fact: "Mount Everest grows about 4mm taller every year due to tectonic plate movement." }
    ]
  },
  science: {
    easy: [
      { image: waterImage, jumbledWord: "REWATGKTGHA", hint: "H₂O", answer: "WATER", fact: "Water covers about 71% of the Earth's surface." },
      { image: sunImage, jumbledWord: "NUSFIWRE", hint: "The star at the center of our solar system", answer: "SUN", fact: "The Sun contains 99.86% of the mass in our solar system." }
    ],
    medium: [
      { image: dnaImage, jumbledWord: "DNASDWSDH", hint: "Carries genetic instructions", answer: "DNA", fact: "If uncoiled, the DNA in all your cells would stretch 10 billion miles." },
      { image: atomImage, jumbledWord: "MOATDJRHF", hint: "Basic unit of matter", answer: "ATOM", fact: "Atoms are 99.999999999999% empty space." }
    ],
    hard: [
      { image: blackholeImage, jumbledWord: "KBLAC HOELDFDWE", hint: "Space where gravity pulls so much that even light cannot escape", answer: "BLACK HOLE", fact: "A black hole's gravity is so strong that time slows down near it." }
    ]
  },
  history: {
    easy: [
      { image: romeImage, jumbledWord: "OMEREWJDJVF", hint: "Ancient empire with famous Colosseum", answer: "ROME", fact: "Ancient Rome was founded in 753 BC by Romulus and Remus." },
      { image: egyptImage, jumbledWord: "GYPETFHEKDUC", hint: "Land of pharaohs and pyramids", answer: "EGYPT", fact: "The Great Pyramid was the tallest man-made structure for 3,800 years." }
    ],
    medium: [
      { image: renaissanceImage, jumbledWord: "RENAIGHEKDSSANCE", hint: "Cultural rebirth period in Europe", answer: "RENAISSANCE", fact: "The Renaissance began in Florence, Italy in the 14th century." }
    ],
    hard: [
      { image: industrialImage, jumbledWord: "INDUSTRFESF IAL REVOLUTIONGRFSEHT", hint: "Transition to new manufacturing processes (1760-1840)", answer: "INDUSTRIAL REVOLUTION", fact: "This revolution began in Great Britain and changed society forever." }
    ]
  }
};

// Improved shuffle function
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Game = () => {
  const [category, setCategory] = useState("geography");
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzles, setPuzzles] = useState(categories[category][difficulty]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    setPuzzles(categories[category][difficulty]);
    setCurrentPuzzle(0);
    setScore(0);
    setCoins(0);
    setStreak(0);
    setGameOver(false);
    setSelectedLetters([]);
    const letters = categories[category][difficulty][0].jumbledWord.replace(/\s/g, "").split("");
    setShuffledLetters(shuffleArray(letters));
  }, [category, difficulty]);

  useEffect(() => {
    if (musicEnabled) {
      audioRef.current = new Audio(BackgroundMusic);
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => console.log("Audio play failed:", error));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [musicEnabled]);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const playSound = (isCorrect) => {
    if (soundEnabled) {
      const audio = new Audio(isCorrect ? correctSound : wrongSound);
      audio.play().catch(error => console.log("Sound play failed:", error));
    }
  };

  const checkAchievements = (newScore) => {
    const newAchievements = [];
    if (newScore >= 5 && !achievements.includes("Novice Scholar")) {
      newAchievements.push("Novice Scholar");
    }
    if (newScore >= 10 && !achievements.includes("Knowledge Seeker")) {
      newAchievements.push("Knowledge Seeker");
    }
    if (newScore >= 15 && !achievements.includes("Master Mind")) {
      newAchievements.push("Master Mind");
    }
    if (streak >= 3 && !achievements.includes("Hot Streak")) {
      newAchievements.push("Hot Streak");
    }

    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      setCoins(coins + newAchievements.length * 2);
    }
  };

  const handleLetterClick = (letter, index) => {
    // Mark the letter as used by adding it to selectedLetters
    setSelectedLetters([...selectedLetters, letter]);
    
    // Remove the clicked letter from shuffledLetters
    const newShuffledLetters = [...shuffledLetters];
    newShuffledLetters[index] = null; // Mark as used
    setShuffledLetters(newShuffledLetters);
  };

  const handleSubmitAnswer = () => {
    const currentAnswer = selectedLetters.join("").toUpperCase();
    if (currentAnswer === puzzles[currentPuzzle].answer.replace(/\s/g, "")) {
      playSound(true);
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setCoins(coins + 1 + (newStreak >= 3 ? 1 : 0));
      setShowFact(true);
      checkAchievements(newScore);

      if (currentPuzzle + 1 < puzzles.length) {
        setTimeout(() => {
          setCurrentPuzzle(currentPuzzle + 1);
          setSelectedLetters([]);
          const letters = puzzles[currentPuzzle + 1].jumbledWord.replace(/\s/g, "").split("");
          setShuffledLetters(shuffleArray(letters));
          setHintUsed(false);  
          setShowFact(false);
        }, 3000);
      } else {
        setTimeout(() => {
          setGameOver(true);
          setTimerActive(false);
        }, 3000);
      }
    } else {
      playSound(false);
      // Reset the letters
      setSelectedLetters([]);
      const letters = puzzles[currentPuzzle].jumbledWord.replace(/\s/g, "").split("");
      setShuffledLetters(shuffleArray(letters));
      setStreak(0);
    }
  };

  const handleUseHint = () => {
    if (coins >= 2 && !hintUsed) {
      setCoins(coins - 2);
      setHintUsed(true);
    }
  };

  const removeLetter = (index) => {
    const letterToReturn = selectedLetters[index];
    const newSelectedLetters = [...selectedLetters];
    newSelectedLetters.splice(index, 1);
    setSelectedLetters(newSelectedLetters);
    
    // Find the first null position in shuffledLetters to return the letter
    const newShuffledLetters = [...shuffledLetters];
    const emptyIndex = newShuffledLetters.findIndex(letter => letter === null);
    if (emptyIndex !== -1) {
      newShuffledLetters[emptyIndex] = letterToReturn;
      setShuffledLetters(newShuffledLetters);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCurrentPuzzle(0);
    setScore(0);
    setCoins(0);
    setStreak(0);
    setSelectedLetters([]);
    const letters = puzzles[0].jumbledWord.replace(/\s/g, "").split("");
    setShuffledLetters(shuffleArray(letters));
    setTimeLeft(60);
    setTimerActive(false);
    setShowFact(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimerActive(true);
  };

  const exitGame = () => {
    if (window.confirm("Are you sure you want to exit the game?")) {
      resetGame();
    }
  };

  return (
    <div className="game-container" style={{ backgroundImage: `url(${background})` }}>
      {!gameStarted ? (
        <div className="start-screen">
          <div className="game-icon">🧩</div>
          <h1 className="game-title">EduScramble</h1>
          <h1 className="game-subtitle">Unscramble words and learn fascinating facts!</h1>
          
          <div className="category-section">
            <h2 className="section-title">Choose Category:</h2>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              <option value="geography">Geography</option>
              <option value="science">Science</option>
              <option value="history">History</option>
            </select>
          </div>

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
              onClick={startGame} 
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
            <button 
              onClick={() => setShowTeam(true)} 
              className="game-button team-button"
            >
              Meet the Team
            </button>
            <button 
              onClick={() => setShowSettings(true)} 
              className="game-button settings-button"
            >
              <img src={settingsIcon} alt="Settings" className="button-icon" />
              Settings
            </button>
          </div>
        </div>
      ) : !gameOver ? (
        <div className="puzzle-screen">
          <div className="puzzle-header">
            <div className="score-display">
              <span><img src={trophyIcon} alt="Score" className="icon" /> {score}</span>
              <span><img src={coinIcon} alt="Coins" className="icon" /> {coins}</span>
              <span>⏱️ {timeLeft}s</span>
              <span>🔥 {streak}</span>
            </div>

            <div className="game-controls">
              <button 
                onClick={() => setShowSettings(true)} 
                className="control-button settings-button"
              >
                <img src={settingsIcon} alt="Settings" className="button-icon" />
              </button>
              <button 
                onClick={exitGame} 
                className="control-button exit-button"
              >
                <img src={exitIcon} alt="Exit" className="button-icon" />
              </button>
              <button 
                onClick={handleUseHint} 
                className="hint-button"
                disabled={coins < 2 || hintUsed}
              >
                {hintUsed ? 'Hint Used' : 'Get Hint (2 coins)'}
              </button>
            </div>
          </div>

          {hintUsed && <p className="hint-text">Hint: {puzzles[currentPuzzle].hint}</p>}

          <div className="puzzle-content">
            <div className="puzzle-image-container">
              <img 
                src={puzzles[currentPuzzle].image} 
                alt="Puzzle" 
                className="puzzle-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                }}
              />
            </div>

            <h2 className="puzzle-instruction">Unscramble the letters:</h2>
            
            <div className="letter-bank">
              {shuffledLetters.map((letter, index) => (
                letter !== null && (
                  <motion.button
                    key={index}
                    className="letter-tile"
                    onClick={() => handleLetterClick(letter, index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={letter === null}
                  >
                    {letter}
                  </motion.button>
                )
              ))}
            </div>

            <div className="answer-section">
              <h3>Your answer:</h3>
              <div className="answer-display">
                {selectedLetters.length > 0 ? (
                  selectedLetters.map((letter, index) => (
                    <motion.span
                      key={index}
                      className="answer-letter"
                      onClick={() => removeLetter(index)}
                      whileHover={{ scale: 1.1 }}
                    >
                      {letter}
                    </motion.span>
                  ))
                ) : (
                  <span className="empty-answer">_ _ _ _ _</span>
                )}
              </div>
              <button 
                onClick={handleSubmitAnswer} 
                className="game-button submit-button"
                disabled={selectedLetters.length === 0}
              >
                Submit Answer
              </button>
            </div>

            {showFact && (
              <div className="fact-popup">
                <h3>Did you know?</h3>
                <p>{puzzles[currentPuzzle].fact}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h1 className="game-over-title">Game Complete!</h1>
          <div className="results-summary">
            <p>Final Score: {score}/{puzzles.length}</p>
            <p>Total Coins Earned: {coins}</p>
            <p>Highest Streak: {streak}</p>
            
            {achievements.length > 0 && (
              <div className="achievements-earned">
                <h3>Achievements Unlocked:</h3>
                <ul>
                  {achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="game-over-buttons">
            <button 
              onClick={resetGame} 
              className="game-button play-again-button"
            >
              Play Again
            </button>
            <button 
              onClick={exitGame} 
              className="game-button exit-button"
            >
              Exit Game
            </button>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="instructions-modal">
          <div className="instructions-content">
            <h2 className="modal-title">How to Play</h2>
            <img src={instructionsImg} alt="Instructions" className="instruction-image" />
            <ol className="instructions-list">
              <li><strong>Select a category</strong> (Geography, Science, History)</li>
              <li><strong>Choose difficulty level</strong> (Easy, Medium, Hard)</li>
              <li><strong>Rearrange the jumbled letters</strong> to form the correct word</li>
              <li><strong>Click on letters</strong> to build your answer</li>
              <li><strong>Click on placed letters</strong> to remove them</li>
              <li><strong>Submit your answer</strong> when you think it's correct</li>
              <li><strong>Earn coins</strong> by solving puzzles correctly</li>
              <li><strong>Build streaks</strong> for bonus coins</li>
              <li><strong>Use coins</strong> to buy hints when stuck</li>
              <li><strong>Learn facts</strong> after each correct answer</li>
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

      {showTeam && (
        <div className="team-modal">
          <div className="team-content">
            <h2 className="modal-title">Meet the Team</h2>
            <div className="team-members">
              <div className="team-member">
                <img src={leader} alt="Team Leader" className="team-photo" />
                <h3>Mary Alado</h3>
                <p>UI/UX Designer</p>
                <p className="team-bio">Created the engaging visual design and user experience</p>
              </div>
              <div className="team-member">
                <img src={teammate1} alt="Team Member 1" className="team-photo" />
                <h3>Esmenos Christan Marquez</h3>
                <p>Developer/UI</p>
                <p className="team-bio">Built the game logic and interactive features</p>
              </div>
              <div className="team-member">
                <img src={teammate2} alt="Team Member 2" className="team-photo" />
                <h3>Vergara Renalyn</h3>
                <p>Documentation</p>
                <p className="team-bio">Ensured educational value and project coordination</p>
              </div>
            </div>
            <button 
              className="game-button close-button"
              onClick={() => setShowTeam(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h2 className="modal-title">Game Settings</h2>
            
            <div className="setting-option">
              <label>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                />
                Sound Effects
              </label>
            </div>
            
            <div className="setting-option">
              <label>
                <input
                  type="checkbox"
                  checked={musicEnabled}
                  onChange={() => setMusicEnabled(!musicEnabled)}
                />
                Background Music
              </label>
            </div>
            
            <div className="setting-group">
              <h3>Category:</h3>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                <option value="geography">Geography</option>
                <option value="science">Science</option>
                <option value="history">History</option>
              </select>
            </div>
            
            <div className="setting-group">
              <h3>Difficulty:</h3>
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
            
            <div className="setting-group">
              <h3>Timer:</h3>
              <select 
                value={timeLeft} 
                onChange={(e) => setTimeLeft(parseInt(e.target.value))}
                className="timer-select"
              >
                <option value="60">60 Seconds</option>2222
                <option value="120">120 Seconds</option>
                <option value="180">180 Seconds</option>
                <option value="0">No Timer</option>
              </select>
            </div>
            
            <button 
              className="game-button close-button"
              onClick={() => setShowSettings(false)}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
