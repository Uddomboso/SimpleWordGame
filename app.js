// game state variables
// stores the remaining time in seconds for the current word
let timeLeft = 30;
// holds the interval id for the countdown timer
let timerInterval = null;
// tracks if the current word was guessed correctly
let guessedCorrectly = false;
// the current word the player needs to guess
let currentWord = "";
// array representing the word with underscores for missing letters
let displayedWord = [];
// array of indices where letters are missing in the word
let missingIndices = [];
// current number of lives remaining
let lives = 3;
// maximum number of lives allowed
let maxLives = 3;
// current difficulty level easy intermediate or difficult
let difficulty = "";
// hint text displayed to help the player
let hint = "";
// current game score
let score = 0;
// best score achieved for this difficulty level
let highScore = 0;
// array of words that have already been used in this game session
let usedWords = [];
// flag indicating if all words have been used
let allWordsUsed = false;

// user authentication functions
// retrieves all registered users from browser storage
function getUsers() {
  let users = localStorage.getItem("users");
  return users ? JSON.parse(users) : {};
}

// saves the users object to browser storage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// handles user registration
// validates input and creates new user account
function signup(event) {
  event.preventDefault();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  if (!username || !password) {
    displaySignupMessage("Please enter username and password.");
    return;
  }
  let users = getUsers();
  if (users[username]) {
    displaySignupMessage("Username already exists.");
    return;
  }
  users[username] = password;
  saveUsers(users);
  displaySignupMessage("Signup successful! You can now log in.", true);
  document.getElementById("signup-form").reset();
}

// handles user login
// validates credentials and redirects to main menu on success
function login(event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  let users = getUsers();
  if (users[username] === password) {
    localStorage.setItem("currentUser", username);
    window.location.href = "main.html";
  } else {
    displayLoginMessage("Invalid username or password.");
  }
}

// displays a message on the signup page
// shows success message in green or error message in red
function displaySignupMessage(msg, success = false) {
  const el = document.getElementById("signup-message");
  if (el) {
    el.textContent = msg;
    el.style.color = success ? "green" : "red";
  }
}

// displays a message on the login page
// shows error message in red
function displayLoginMessage(msg) {
  const el = document.getElementById("login-message");
  if (el) {
    el.textContent = msg;
    el.style.color = "red";
  }
}

// word banks for each difficulty level
// easy words are short and common
// intermediate words are medium length
// difficult words are long and challenging
const wordBanks = {
  easy: ["apple", "mango", "bread", "chair", "house", "water", "table", "phone", "mouse", "light"],
  intermediate: ["library", "picture", "journey", "bicycle", "guitar", "diamond", "kitchen", "monitor", "garden", "window"],
  difficult: ["philosophy", "entrepreneur", "psychology", "mathematics", "architecture", "photography", "restaurant", "television", "helicopter", "celebrity"]
};

// initializes the game with default values
// resets lives score and word list
// determines difficulty from current page
// loads high score and generates first word
function setupGame() {
  lives = maxLives;
  score = 0;
  usedWords = [];
  allWordsUsed = false;
  determineDifficulty();
  loadHighScore();
  generateWord();
  updateLives();
  updateHint();
  updateMessage(`Guess the missing letter${missingIndices.length > 1 ? 's' : ''}.`);
  updateHighScore();
  hideRestartButton();
  hideNextButton();
  clearInput();
  showInitialAssistantMessage();
}

// determines the difficulty level based on the current page url
function determineDifficulty() {
  const path = window.location.pathname;
  if (path.includes("easy.html")) difficulty = "easy";
  else if (path.includes("intermediate.html")) difficulty = "intermediate";
  else if (path.includes("difficult.html")) difficulty = "difficult";
  else difficulty = "easy";
}

// generates a new word for the player to guess
// selects a random unused word from the appropriate difficulty bank
// randomly hides letters based on difficulty level
// creates hint text and starts timer for intermediate and difficult modes
function generateWord() {
  const words = wordBanks[difficulty];
  
  if (usedWords.length === words.length) {
    allWordsUsed = true;
    showGameCompletion();
    return;
  }

  const availableWords = words.filter(word => !usedWords.includes(word));
  currentWord = availableWords[randInt(0, availableWords.length - 1)].toLowerCase();
  usedWords.push(currentWord);

  let numMissing = difficulty === "easy" ? 1 : difficulty === "intermediate" ? 2 : 3;
  missingIndices = [];
  while (missingIndices.length < numMissing) {
    let idx = randInt(0, currentWord.length - 1);
    if (!missingIndices.includes(idx)) missingIndices.push(idx);
  }
  missingIndices.sort();
  displayedWord = currentWord.split("");
  missingIndices.forEach(i => displayedWord[i] = "_");

  hint = `The word has ${currentWord.length} letters.`;
  if (difficulty !== "easy") {
    let shuffled = currentWord.split("").sort(() => 0.5 - Math.random()).join("");
    if (shuffled !== currentWord) {
      hint += ` Scrambled hint: ${shuffled}`;
    }
    startTimer();
  }

  renderWord();
  updateProgress();
}

// generates a random integer between min and max inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// timer functions
// starts a countdown timer for intermediate and difficult modes
// reduces lives when time runs out
function startTimer() {
  timeLeft = 30;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      lives--;
      updateLives();
      updateMessage("Time's up! You lost a life.");
      renderWord();
      clearInput();
      if (lives <= 0) {
        updateMessage(`Game over! The word was: ${currentWord.toUpperCase()}.`);
        showRestartButton();
      }
    }
  }, 1000);
}

// updates the timer display on the page
function updateTimerDisplay() {
  const el = document.getElementById("timer-display");
  if (el) el.textContent = `Time Left: ${timeLeft}s`;
}

// renders the word display on the page
// creates input fields for missing letters and spans for revealed letters
// focuses the first input field for easy typing
function renderWord() {
  let container = document.getElementById("word-display");
  if (!container) return;
  container.innerHTML = "";
  
  let firstInput = null;
  displayedWord.forEach((char, idx) => {
    if (char === "_") {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.className = "letter-input";
      input.dataset.index = idx;
      input.autocomplete = "off";
      container.appendChild(input);
      if (!firstInput) firstInput = input;
    } else {
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "letter-reveal";
      container.appendChild(span);
    }
  });
  
  if (firstInput) firstInput.focus();
}

// updates the lives display with heart symbols
function updateLives() {
  let el = document.getElementById("liv");
  if (el) el.textContent = `lives: ${"❤️".repeat(lives)}`;
}

// updates the hint text displayed to the player
function updateHint() {
  let el = document.getElementById("hint-display");
  if (el) el.textContent = hint;
}

// updates the message display and shows assistant message
function updateMessage(msg) {
  let el = document.getElementById("message-display");
  if (el) el.textContent = msg;
  showAssistant(msg);
}

// clears all input fields and focuses the first one
function clearInput() {
  let inputs = document.querySelectorAll("#word-display input.letter-input");
  inputs.forEach(i => (i.value = ""));
  if (inputs.length > 0) inputs[0].focus();
}

// updates the high score display on the page
function updateHighScore() {
  const el = document.getElementById("highscore-display");
  if (el) el.textContent = `High Score: ${highScore}`;
}

// updates the progress counter showing words completed
function updateProgress() {
  const progressEl = document.getElementById("prog");
  if (progressEl) {
    const totalWords = wordBanks[difficulty].length;
    progressEl.textContent = `Progress: ${usedWords.length}/${totalWords}`;
  }
}

// loads the high score for current user and difficulty from storage
function loadHighScore() {
  let user = localStorage.getItem("currentUser") || "Guest";
  let key = `${user}_${difficulty}_highscore`;
  let hs = localStorage.getItem(key);
  highScore = hs ? parseInt(hs) : 0;
}

// saves the high score if current score is better
function saveHighScore() {
  if (score > highScore) {
    let user = localStorage.getItem("currentUser") || "Guest";
    let key = `${user}_${difficulty}_highscore`;
    localStorage.setItem(key, score);
    highScore = score;
  }
}

// talking assistant functions
// displays messages from the animal character on screen
// shows a welcome message when the game starts based on difficulty
function showInitialAssistantMessage() {
  let message = "";
  if (difficulty === "easy") {
    message = `Welcome to Easy Mode! Guess the missing letter.`;
  } else if (difficulty === "intermediate") {
    message = `intermediate mode lets go!`;
  } else {
    message = `difficult mode. challenge accepted!`;
  }
  showAssistant(message);
}

// displays the assistant with a message for six seconds then hides it
function showAssistant(message) {
  const assistant = document.getElementById("talking-animal");
  const textEl = document.getElementById("assistant-text");
  if (assistant && textEl) {
    assistant.style.display = "flex";
    textEl.textContent = message;
    setTimeout(() => {
      assistant.style.display = "none";
    }, 6000);
  }
}

// hides the assistant from view
function hideAssistant() {
  const assistant = document.getElementById("talking-animal");
  if (assistant) {
    assistant.style.display = "none";
  }
}

// upon game completion:
function showGameCompletion() {
  clearInterval(timerInterval);
  document.getElementById("word-display").innerHTML = `
    <h2>Congratulations!</h2>
    <p>You've completed all ${difficulty} words!</p>
  `;
  
  const messageEl = document.getElementById("message-display");
  messageEl.innerHTML = `
    <p>Your final score: ${score}</p>
    <div class="completion-options">
      <button id="play-again-btn" class="btn">Play Again</button>
      ${difficulty !== 'difficult' ? 
        `<button id="next-level-btn" class="btn">Next Level</button>` : ''}
      <button id="main-menu-btn" class="btn">Main Menu</button>
    </div>
  `;
  
  document.getElementById("guess-form").classList.add("hidden");
  document.getElementById("hint-display").classList.add("hidden");
  
  //buttons + event listeners
  document.getElementById("play-again-btn")?.addEventListener("click", () => {
    usedWords = [];
    allWordsUsed = false;
    setupGame();
    document.getElementById("guess-form").classList.remove("hidden");
    document.getElementById("hint-display").classList.remove("hidden");
  });
  
  document.getElementById("next-level-btn")?.addEventListener("click", () => {
    let nextLevel = "";
    if (difficulty === "easy") nextLevel = "intermediate.html";
    else if (difficulty === "intermediate") nextLevel = "difficult.html";
    window.location.href = nextLevel;
  });
  
  document.getElementById("main-menu-btn")?.addEventListener("click", () => {
    window.location.href = "main.html";
  });
}


// checks if the player's guess is correct
// validates that all inputs are filled
// compares each guessed letter with the actual word
// updates score and lives based on correctness
function checkGuess(event) {
  event.preventDefault();
  
 // validation (emty inputs)
  const emptyInputs = Array.from(document.querySelectorAll("#word-display input.letter-input"))
    .filter(input => !input.value);
  if (emptyInputs.length > 0) {
    emptyInputs[0].focus();
    updateMessage("Please fill in all letters!");
    return;
  }

  let guessCorrect = true;
  const inputs = document.querySelectorAll("#word-display input.letter-input");
  inputs.forEach(input => {
    let idx = parseInt(input.dataset.index);
    let guess = input.value.toLowerCase();
    if (guess === currentWord[idx]) {
      displayedWord[idx] = guess;
    } else {
      guessCorrect = false;
    }
  });

  if (guessCorrect) {
    score++;
    updateMessage("Good job! Keep going.");
  } else {
    lives--;
    updateMessage("Oops, wrong guess.");
  }

  updateLives();
  renderWord();
  clearInput();

  if (!displayedWord.includes("_")) {
    guessedCorrectly = true;
    score++;
    updateMessage(`Congrats! The word was: ${currentWord.toUpperCase()}. Score: ${score}`);
    saveHighScore();
    showNextButton();
    clearInterval(timerInterval);
  } else if (lives <= 0) {
    updateMessage(`Game over! The word was: ${currentWord.toUpperCase()}.`);
    saveHighScore();
    showRestartButton();
    clearInterval(timerInterval);
  }

  updateHighScore();
}

// button visibility control functions
// shows or hides game control buttons as needed
function showRestartButton() {
  const btn = document.getElementById("restart-btn");
  if (btn) btn.classList.remove("hidden");
}

function hideRestartButton() {
  const btn = document.getElementById("restart-btn");
  if (btn) btn.classList.add("hidden");
}

function showNextButton() {
  const btn = document.getElementById("next");
  if (btn) btn.classList.remove("hidden");
}

function hideNextButton() {
  const btn = document.getElementById("next");
  if (btn) btn.classList.add("hidden");
}

function restartGame() {
  setupGame();
}

// moves to the next word in the game
function nextWord() {
  generateWord();
  guessedCorrectly = false;
  timeLeft = 30;
  updateLives();
  updateHint();
  updateMessage(`Guess the missing letter${missingIndices.length > 1 ? 's' : ''}.`);
  clearInput();
  hideNextButton();
}

// input validation and navigation
// ensures only letters can be entered
// automatically moves focus to next input when a letter is typed
document.addEventListener("input", function(e) {
  if (e.target.classList.contains("letter-input")) {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    if (e.target.value.length === 1) {
      const nextInput = e.target.nextElementSibling;
      if (nextInput && nextInput.classList.contains("letter-input")) {
        nextInput.focus();
      }
    }
  }
});

// page load event listeners
// sets up form handlers when the page loads
window.addEventListener("load", () => {
  const signupForm = document.getElementById("signup-form");
  if (signupForm) signupForm.addEventListener("submit", signup);
  
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", login);

  if (document.getElementById("guess-form")) {
    setupGame();
    document.getElementById("guess-form").addEventListener("submit", checkGuess);
    document.getElementById("restart-btn")?.addEventListener("click", restartGame);
    document.getElementById("next")?.addEventListener("click", nextWord);
  }
});

// background music control
// creates audio object for background music that loops
const bgAudio = new Audio("background.mp3");
bgAudio.loop = true;
// function to play or pause the background music
function toggleMusic(on) {
  if (on) bgAudio.play();
  else bgAudio.pause();
}
