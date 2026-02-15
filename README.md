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

This final version (Version 10) represents the complete, polished submission version of the project.

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

---

### Feature 3 — Timer & Move Counter

- The timer starts when the game begins.
- The timer stops when all pairs are matched.
- Moves increase only after two cards are flipped.
- Final message displays player name, total moves, and completion time.

---

### Additional Features

- Restart button
- Locking mechanism (`lockBoard`) to prevent rapid clicking
- Dynamic board generation based on difficulty
- Visual states:
  - Default
  - Flipped
  - Matched
- Responsive layout for mobile screens
- Keyboard focus styling for accessibility
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

I selected a dark-mode color palette because:

- It provides strong contrast for accessibility.
- It reduces visual strain.
- It creates a modern interface style.
- Highlight yellow improves visibility of flipped cards.

Color variables are defined using CSS custom properties for consistency and maintainability.

---

### Fonts / Typography

I used system UI fonts because:

- They are readable and accessible.
- They ensure cross-device compatibility.
- They load quickly without external dependencies.

Typography was kept clean and simple to maintain focus on gameplay.

---

### Layout & Structure

- CSS Grid is used for:
  - The card board layout
  - The form layout
  - The status panel layout

- Panels are visually separated for clarity.
- Consistent spacing and rounded corners create a clean interface.
- Responsive media queries ensure usability on smaller screens.

---

## Development Process

### Project Planning

Initial scope included:

- Memory game logic
- Dynamic board rendering
- Match detection
- Timer
- Move counter
- Restart functionality

Later enhancements included:

- Lock mechanism to prevent invalid clicks
- Improved validation logic
- Accessibility focus styles
- Detailed commenting for learning documentation
- Clean separation between HTML, CSS, and JavaScript

---

### Wireframes

The project layout was planned using a simple structural wireframe:

- Header (title + subtitle)
- Rules panel
- Game controls (form)
- Status panel
- Game board
- Footer

![Memory Game Wireframe](./assets/memorygame-wireframe_v1.png)

---

### Challenges Faced

1. Preventing rapid clicking  
   → Solved using `lockBoard` boolean state.

2. Preventing duplicate card selection  
   → Compared selected index with `firstPick.index`.

3. Avoiding multiple timers  
   → Used `clearInterval()` before starting new timers.

4. Managing clean state resets  
   → Centralised all values inside a single `state` object.

5. Keeping logic readable  
   → Separated concerns into dedicated functions.

---

## Interactivity (JavaScript Implementation)

JavaScript makes the project fully interactive through:

- DOM element selection using `document.getElementById()`
- Event listeners for:
  - `submit`
  - `click`
- Dynamic element creation using `createElement()`
- Class manipulation with `classList.add()` / `remove()`
- Timer management with:
  - `setInterval()`
  - `clearInterval()`
- State management using a structured `state` object

---

## Technical Architecture

### Core JavaScript Modules

- `createDeck()` → Generates paired cards
- `shuffle()` → Randomises deck
- `renderBoard()` → Draws the game board
- `onCardClick()` → Handles flipping
- `checkMatch()` → Match detection logic
- `resetPicks()` → Clears selections
- `updateStatus()` → Updates UI counters
- `startTimer()` / `stopTimer()` → Controls timer
- `endGame()` → Displays completion message
- `resetGame()` → Clears all state

---

## State Management

All dynamic values are stored inside a single `state` object:

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
- `playerName`

This ensures predictable data flow and maintainable logic.

---

## Game Flow Pipeline

1. User enters name and selects difficulty  
2. Form validation runs  
3. `resetGame()` clears previous state  
4. `createDeck()` builds and shuffles deck  
5. `renderBoard()` draws cards  
6. `startTimer()` begins timer  
7. Player interacts with cards  
8. `checkMatch()` processes logic  
9. `endGame()` stops timer and displays final message  

---

## Hosting

This site has been deployed to GitHub Pages:

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