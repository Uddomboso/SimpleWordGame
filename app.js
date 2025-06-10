// variables
let timeLeft = 30;
let timerInterval = null;
let guessedCorrectly = false;
let currentWord = "";
let displayedWord = [];
let missingIndices = [];
let lives = 3;
let maxLives = 3;
let difficulty = "";
let hint = "";
let score = 0;
let highScore = 0;
let usedWords = [];
let allWordsUsed = false;

// for authentication
function getUsers() {
  let users = localStorage.getItem("users");
  return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

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

function displaySignupMessage(msg, success = false) {
  const el = document.getElementById("signup-message");
  if (el) {
    el.textContent = msg;
    el.style.color = success ? "green" : "red";
  }
}

function displayLoginMessage(msg) {
  const el = document.getElementById("login-message");
  if (el) {
    el.textContent = msg;
    el.style.color = "red";
  }
}

// word banks (basically random words varying in difficulty as i see fit)
const wordBanks = {
  easy: ["apple", "mango", "bread", "chair", "house", "water", "table", "phone", "mouse", "light"],
  intermediate: ["library", "picture", "journey", "bicycle", "guitar", "diamond", "kitchen", "monitor", "garden", "window"],
  difficult: ["philosophy", "entrepreneur", "psychology", "mathematics", "architecture", "photography", "restaurant", "television", "helicopter", "celebrity"]
};

// game setup
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

function determineDifficulty() {
  const path = window.location.pathname;
  if (path.includes("easy.html")) difficulty = "easy";
  else if (path.includes("intermediate.html")) difficulty = "intermediate";
  else if (path.includes("difficult.html")) difficulty = "difficult";
  else difficulty = "easy";
}

// generating words
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

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// timre
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

function updateTimerDisplay() {
  const el = document.getElementById("timer-display");
  if (el) el.textContent = `Time Left: ${timeLeft}s`;
}

// user interface
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

function updateLives() {
  let el = document.getElementById("liv");
  if (el) el.textContent = `lives: ${"❤️".repeat(lives)}`;
}

function updateHint() {
  let el = document.getElementById("hint-display");
  if (el) el.textContent = hint;
}

function updateMessage(msg) {
  let el = document.getElementById("message-display");
  if (el) el.textContent = msg;
  showAssistant(msg);
}

function clearInput() {
  let inputs = document.querySelectorAll("#word-display input.letter-input");
  inputs.forEach(i => (i.value = ""));
  if (inputs.length > 0) inputs[0].focus();
}

function updateHighScore() {
  const el = document.getElementById("highscore-display");
  if (el) el.textContent = `High Score: ${highScore}`;
}

function updateProgress() {
  const progressEl = document.getElementById("prog");
  if (progressEl) {
    const totalWords = wordBanks[difficulty].length;
    progressEl.textContent = `Progress: ${usedWords.length}/${totalWords}`;
  }
}

function loadHighScore() {
  let user = localStorage.getItem("currentUser") || "Guest";
  let key = `${user}_${difficulty}_highscore`;
  let hs = localStorage.getItem(key);
  highScore = hs ? parseInt(hs) : 0;
}

function saveHighScore() {
  if (score > highScore) {
    let user = localStorage.getItem("currentUser") || "Guest";
    let key = `${user}_${difficulty}_highscore`;
    localStorage.setItem(key, score);
    highScore = score;
  }
}

// talking assistant (the deer at the side)
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

// buttons
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

// Input validation and navigation
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

// Page load listeners
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

// for my backround music
const bgAudio = new Audio("background.mp3");
bgAudio.loop = true;
function toggleMusic(on) {
  if (on) bgAudio.play();
  else bgAudio.pause();
}
