## Project Title

JavaScript Memory Matching Game

---

## Project Description

This project is a browser-based Memory Matching Game developed using HTML, CSS, and JavaScript.

The purpose of the project is to demonstrate core web development principles including:

- DOM manipulation  
- Event handling  
- State management  
- Conditional logic  
- Timer implementation  
- Form validation  
- Dynamic rendering  
- Responsive design  

The game challenges players to match all card pairs using the fewest possible moves and in the shortest time.

This final version (Version 10) represents the complete, fully aligned submission version of the project.

---

## Features

### Feature 1 — Memory Card Matching

Players flip two cards per turn to find matching pairs.  
If the cards match, they remain visible.  
If not, they flip back automatically after a short delay.

---

### Feature 2 — Player Name & Difficulty Selection

Users must:

- Enter their name (required field)
- Select a difficulty level (Easy / Medium / Hard)

The game validates inputs before starting and displays a message if fields are incomplete.

Difficulty levels dynamically change the board size:

- Easy → 2 × 3 grid (3 pairs)
- Medium → 3 × 4 grid (6 pairs)
- Hard → 4 × 4 grid (8 pairs)

---

### Feature 3 — Timer & Move Counter

- The timer starts when the game begins.
- The timer updates every second using `setInterval()`.
- The timer stops using `clearInterval()` when the game ends.
- Moves increase only after two cards are flipped.
- A completion message displays player name and final results.

---

### Additional Features

- Restart button
- Locking mechanism (`lockBoard`) to prevent rapid clicking
- Dynamic board generation based on difficulty
- Visual states:
  - Default
  - Flipped (`is-flipped`)
  - Matched (`is-matched`)
- Last 5 Games history table
- Responsive layout for mobile screens
- Clear user feedback messaging

---

## Game Rules

- You may flip **two cards per turn**.
- You cannot flip more than two cards at the same time.
- Clicking the same card twice in one turn is prevented.
- Matched cards stay face-up permanently.
- Unmatched cards flip back after a short delay.
- Each pair of flips counts as **one move**.
- The timer starts when the game begins.
- The timer stops when all pairs are matched.
- Rapid clicking is disabled during mismatch animations using `lockBoard`.

---

## Design Choices

### Colors

A dark-mode palette was selected to:

- Provide strong contrast
- Improve accessibility
- Reduce visual strain
- Create a modern interface

Color values are defined using CSS custom properties (`:root`) to ensure maintainability and consistency.

---

### Typography

System UI fonts are used because they:

- Are accessible and readable
- Ensure cross-device compatibility
- Load quickly without external dependencies

---

### Layout & Structure

CSS Grid is used for:

- The game board layout
- The form layout
- The status panel layout

The layout is organised into structured panels:

1. Header
2. Rules panel
3. Game controls
4. Status panel
5. Game board
6. History table
7. Footer

Responsive media queries ensure usability on smaller screens.

---

## Development Process

### Initial Scope

- Memory game logic
- Deck generation
- Match detection
- Timer
- Move counter
- Restart functionality

### Enhancements Added

- Lock mechanism (`lockBoard`)
- Clean state management inside a single object
- History tracking (last 5 games)
- Improved validation logic
- Structured function separation
- Extensive inline commenting for learning documentation

---

## Interactivity (JavaScript Implementation)

JavaScript enables full interactivity using:

- `document.getElementById()`
- `querySelector()`
- `addEventListener()`
- `createElement()`
- `classList.add()` / `remove()`
- `setInterval()` / `clearInterval()`
- Template literals
- Structured state management

---

## Technical Architecture

### Core JavaScript Functions

- `createDeck(totalCards)` → Generates paired card objects
- `shuffle(array)` → Randomises deck order
- `renderBoard()` → Draws the board dynamically
- `buildBoardGrid(cols, rows)` → Configures grid layout
- `onCardClick(e)` → Handles card interaction
- `checkForMatch()` → Match detection logic
- `clearPicks()` → Resets selected cards
- `updateStatus()` → Updates move/time/pairs display
- `startTimer()` → Starts interval timer
- `endGame()` → Stops timer and saves result
- `resetGame()` → Clears all state and UI
- `renderHistory()` → Updates history table

---

## State Management

All dynamic values are stored inside a single `state` object:

- `isRunning`
- `playerName`
- `difficulty`
- `cards`
- `firstPickId`
- `secondPickId`
- `lockBoard`
- `moves`
- `pairsFound`
- `totalPairs`
- `timerId`
- `secondsElapsed`

This ensures predictable data flow and maintainable logic.

---

## Game Flow Pipeline

1. User enters name and selects difficulty  
2. Form validation runs  
3. `resetGame()` clears previous state  
4. `createDeck()` builds and shuffles deck  
5. `buildBoardGrid()` configures layout  
6. `renderBoard()` draws cards  
7. `startTimer()` begins timer  
8. Player interacts with cards  
9. `checkForMatch()` processes logic  
10. `endGame()` stops timer and saves history  

---

## Hosting

This site is deployed using GitHub Pages:

**Live URL:**  
https://iesquivelcanaviri-coder.github.io/Project_MemoryGame/

---

## Folder Structure

Project_MemoryGame  
├── index.html  
├── styles.css  
├── script.js  
├── assets/  
│   |── memorygame-wireframe_v1.png  
│   |── lighthouse/
│   |   └── lighthouse-100-desktop.png  
│   |   └── lighthouse-report-100-mobile .png
│   └── validation/ 
│        └── css validation.png   
│        └── html validation.png  
│        └── javascript validation.png  
└── README.md  

---

## Wireframe Preview
![Memory Game Wireframe](./assets/memorygame-wireframe_v1.png)
