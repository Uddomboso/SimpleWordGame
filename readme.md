# Simple Word Game

A beautiful, responsive browser-based word guessing game built with vanilla JavaScript, HTML, and CSS. Test your vocabulary skills by guessing missing letters in words across three difficulty levels. Features user authentication, score tracking, and an interactive assistant to guide you through the game.

**Live Demo:** [mboso.netlify.app](https://mboso.netlify.app)

## 📸 Screenshots

### Login and Signup Page
![Login and Signup](imgs/loginsignup.png)
The authentication page allows users to create an account or log in to existing accounts. User credentials are securely stored in browser localStorage.

### Main Menu
![Main Menu](imgs/mainmenu.png)
After logging in, players are greeted with a welcome message and can choose from three difficulty levels: Easy, Intermediate, or Difficult mode.

### Gameplay with Assistant
![Difficult Mode with Assistant](imgs/difficultassistant.png)
During gameplay, a friendly assistant appears with helpful hints and encouragement. The assistant provides context-specific messages based on your progress and difficulty level.

## 🎮 Features

### User Authentication
- **Sign Up**: Create a new account with a username and password
- **Login**: Access your account to track your progress and high scores
- **Local Storage**: User data is stored securely in browser localStorage
- **Session Management**: Your login session persists across page refreshes

### Three Difficulty Levels

#### Easy Mode
- **1 missing letter** per word
- **No time limit** - take your time to think
- **10 simple words** like: apple, mango, bread, chair, house
- Perfect for beginners and casual players

#### Intermediate Mode
- **2 missing letters** per word
- **30-second timer** for each word
- **Scrambled letter hints** to help you guess
- **10 medium-length words** like: library, picture, journey, bicycle
- Challenges your speed and vocabulary

#### Difficult Mode
- **3 missing letters** per word
- **30-second timer** for each word
- **Scrambled letter hints** provided
- **10 challenging words** like: philosophy, entrepreneur, psychology
- For advanced players seeking a real challenge

### Game Mechanics

#### Lives System
- Start with **3 lives** (❤️❤️❤️)
- Lose a life for incorrect guesses or when time runs out
- Game ends when all lives are lost
- Restart option available to try again

#### Scoring System
- **Score increases** with each correct word guessed
- **High scores** are tracked per difficulty level
- **Progress tracking** shows how many words you've completed (e.g., "Progress: 3/10")
- High scores are saved per user and difficulty level

#### Hints and Assistance
- **Word length** is always displayed
- **Scrambled letters** hint for intermediate and difficult modes
- **Interactive assistant** provides encouragement and tips
- **Visual feedback** with green highlighting for correct letters

#### Word Display
- Missing letters appear as input fields
- Revealed letters are highlighted in green
- Automatic focus moves to next input field
- Only letters can be entered (numbers and special characters are blocked)

### User Interface

#### Responsive Design
- **Mobile-first approach** - optimized for all screen sizes
- **Touch-friendly buttons** - minimum 44px height for easy tapping
- **Adaptive layouts** for phones, tablets, and desktops
- **Landscape mode support** with special optimizations
- **Flexible word display** that wraps on small screens

#### Visual Design
- **Soothing color palette**:
  - Primary: `#f1eaff` (Light lavender)
  - Secondary: `#e7bcde` (Soft pink)
  - Accent: `#bb9cc0` (Muted purple)
  - Dark: `#67729d` (Deep blue-purple)
- **Smooth animations** and transitions
- **Clean, modern interface** with rounded corners and shadows
- **Accessible design** with clear contrast and readable fonts

### Interactive Assistant
- **Context-aware messages** based on difficulty level
- **Encouragement** when you guess correctly
- **Helpful tips** during gameplay
- **Auto-hide** after 6 seconds to keep the screen uncluttered
- **Speech bubble design** with smooth animations

## 🚀 How to Run

### Option 1: Direct Browser Opening
1. **Download or clone** this repository
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari)
3. **No installation required** - the game runs entirely in your browser

### Option 2: Local Server (Recommended)
1. **Download or clone** this repository
2. **Navigate to the project folder** in your terminal
3. **Start a local server**:
   - Python: `python -m http.server 8000`
   - Node.js: `npx http-server`
   - VS Code: Use the "Live Server" extension
4. **Open** `http://localhost:8000` in your browser

### Option 3: Deploy to Netlify
1. **Push your code** to a GitHub repository
2. **Connect** your repository to Netlify
3. **Deploy** - Netlify will automatically build and host your site
4. **Access** your live site at `your-site.netlify.app`

## 📁 Project Structure

```
SimpleWordGame/
│
├── index.html          # Login page
├── signup.html         # User registration page
├── main.html           # Main menu after login
├── easy.html           # Easy difficulty game page
├── intermediate.html    # Intermediate difficulty game page
├── difficult.html      # Difficult game page
├── app.js              # Main JavaScript file with all game logic
├── style.css           # All styling and responsive design
├── readme.md           # This file
│
└── imgs/               # Image assets
    ├── talk.png       # Assistant character image
    ├── loginsignup.png # Screenshot of login/signup page
    ├── mainmenu.png    # Screenshot of main menu
    └── difficultassistant.png # Screenshot of gameplay
```

## 🎯 How to Play

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Enter your credentials to access the game
3. **Choose Difficulty**: Select Easy, Intermediate, or Difficult mode
4. **Guess Letters**: Fill in the missing letters in the word
5. **Submit**: Click the submit button to check your answer
6. **Progress**: Complete all words in a difficulty level to unlock the next level
7. **Track Scores**: Your high scores are saved automatically

### Tips for Success
- **Easy Mode**: Perfect for learning the game mechanics
- **Intermediate Mode**: Pay attention to the scrambled letter hints
- **Difficult Mode**: Use the word length and scrambled letters strategically
- **Time Management**: In timed modes, work quickly but accurately
- **Practice**: The more you play, the better you'll get at recognizing word patterns

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox, media queries, and animations
- **Vanilla JavaScript**: No frameworks or libraries required
- **LocalStorage API**: For persistent data storage
- **Responsive Design**: Mobile-first CSS approach

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari
- Opera
- Any modern browser with JavaScript enabled

### Key Functions

#### Authentication
- `getUsers()`: Retrieves all registered users from localStorage
- `saveUsers(users)`: Saves user data to localStorage
- `signup(event)`: Handles user registration
- `login(event)`: Handles user authentication

#### Game Logic
- `setupGame()`: Initializes the game with default values
- `generateWord()`: Selects and prepares a new word for guessing
- `checkGuess(event)`: Validates player's input against the correct word
- `startTimer()`: Manages countdown timer for timed modes
- `updateProgress()`: Tracks and displays game progress

#### User Interface
- `renderWord()`: Creates the visual word display with input fields
- `updateLives()`: Displays remaining lives
- `showAssistant(message)`: Displays assistant messages
- `updateHighScore()`: Updates and saves high scores

### Data Storage
- **Users**: Stored in `localStorage` under key `"users"`
- **Current User**: Stored as `"currentUser"` in localStorage
- **High Scores**: Stored per user and difficulty as `"{username}_{difficulty}_highscore"`

## 🎨 Customization

### Adding New Words
Edit the `wordBanks` object in `app.js`:
```javascript
const wordBanks = {
  easy: ["your", "words", "here"],
  intermediate: ["your", "words", "here"],
  difficult: ["your", "words", "here"]
};
```

### Changing Colors
Modify the color values in `style.css`:
- Primary background: `#F1EAFF`
- Secondary: `#E7BCDE`
- Accent: `#BB9CC0`
- Dark: `#67729D`

### Adjusting Difficulty
Modify these values in `app.js`:
- Number of missing letters per difficulty
- Timer duration (currently 30 seconds)
- Number of lives (currently 3)

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📧 Contact

For questions or feedback, please open an issue on the GitHub repository.

---

**Enjoy playing the Simple Word Game!** 🎉
