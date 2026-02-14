## Purpose
This version focuses on:
- Extremely detailed beginner-friendly comments  
- Deep understanding of JavaScript logic and data flow  
- Clear explanation of DOM interaction  
- Demonstrating learning progression for assessment  

---

## Why I Chose This Project
I chose to build a Memory Matching Game because it allows me to demonstrate a wide range of core web development skills within a single, cohesive project. The game naturally requires DOM manipulation, event handling, state management, timers, user input validation, and dynamic rendering — all of which showcase my understanding of JavaScript functionality. It also provides opportunities for creative UI design, responsive layout planning, and interactive user experience. Most importantly, the project is simple enough to be approachable yet complex enough to show real problem‑solving, making it an ideal way to demonstrate my learning progression in HTML, CSS, and JavaScript.

---

## Features
- Memory card matching game  
- Player name validation (required input)  
- Difficulty selection (easy / medium / hard)  
- Move counter (1 move per pair of flips)  
- Timer (starts on game start and stops on completion)  
- Dynamic board rendering using JavaScript  
- Restart button (restarts using current difficulty)  
- Input locking (`lockBoard`) to prevent rapid clicking  
- Visual states: flipped cards and matched cards  
- Responsive layout for smaller screens  
- Keyboard focus styling for accessibility  

---

## Game Rules

- You may flip **two cards per turn**.  
- You cannot flip more than two cards at the same time.  
- Clicking the same card twice in one turn is prevented.  
- Matched cards stay face-up and cannot be flipped again.  
- Unmatched cards flip back automatically after a short delay.  
- Each pair of flips counts as **one move**.  
- The timer starts when the game begins.  
- The timer stops when all pairs are matched.  
- Rapid clicking is disabled during mismatch animations using `lockBoard`.  

---

## Learning Focus
- DOM element references (`document.getElementById`)
- Event listeners (`submit`, `click`)
- Arrays and objects (deck + game state)
- Game state management using a structured `state` object
- Conditional logic (match vs mismatch handling)
- Input locking (`lockBoard`) to prevent invalid interaction
- CSS Grid layout for dynamic board sizes
- Timer management using `setInterval()` and `clearInterval()`
- Clean separation between:
  - HTML structure
  - CSS presentation
  - JavaScript logic

---

## Technical Architecture
JavaScript Modules
renderBoard() → draws the cards
onCardClick() → handles flipping
checkMatch() → match logic
startTimer() / stopTimer() → timer system
updateStatus() → UI updates
createDeck() → generates cards
shuffle() → randomizes deck

### 1 State Management
All dynamic game values are stored inside a single `state` object:

- `cards`
- `firstPick`
- `secondPick`
- `moves`
- `pairsFound`
- `totalPairs`
- `seconds`
- `lockBoard`
- `isRunning`
- `timer`

This centralised structure ensures clean logic and predictable data flow.

---

### 2️ Game Flow Pipeline

1. User enters name and selects difficulty  
2. Form validation runs  
3. `resetGame()` clears previous state  
4. `createDeck()` builds and shuffles the deck  
5. `renderBoard()` dynamically generates card buttons  
6. `startTimer()` begins the clock  
7. Player interacts with cards  
8. `checkMatch()` determines match or mismatch  
9. `endGame()` stops timer and displays completion message  

---

## Hosting

This project is hosted using **GitHub Pages**:

 **Live URL:**  
https://iesquivelcanaviri-coder.github.io/Project_MemoryGame/

---


## Folder Structure
Project_MemoryGame  
├── index.html  
├── styles.css  
├── script.js  
├── assets/  
│   └── memorygame-wireframe_v1.png  
└── README.md  

---

## Wireframe Preview
![Memory Game Wireframe](./assets/memorygame-wireframe_v1.png)
