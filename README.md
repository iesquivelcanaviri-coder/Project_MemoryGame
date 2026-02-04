## Purpose
This version focuses on:
- Extremely detailed beginner-friendly comments
- Deep understanding of JavaScript logic and data flow
- Clear explanation of DOM interaction
- Demonstrating learning progression for assessment

---

## Features
- Memory card matching game
- Player name validation (required input)
- Difficulty selection (easy / medium / hard)
- Move counter (1 move per pair of flips)
- Timer (starts on game start and stops on completion)
- Dynamic board rendering using JavaScript
- Restart button (restarts using current difficulty)

---

## Learning Focus
- DOM element references (`getElementById`)
- Event listeners (`submit`, `click`)
- Arrays and objects (deck + game state)
- Game state management (`state` object)
- Conditional logic (match vs mismatch)
- Input locking (`lockBoard`) to prevent rapid clicking
- CSS Grid layout for dynamic board sizes

---

## Version 8 Improvements (vs Version 7)
- Added **lockBoard** to prevent flipping more than 2 cards at once
- Prevented rapid clicking while mismatch cards reset
- Added **Restart** functionality (safe reset + start again)
- Added **Win detection** (timer stops + personalised success message)
- Added **matched UI state** (`.is-matched`) so matched cards are visually distinct
- Improved consistency of comments and section alignment

---

## Hosting
This project is hosted using **GitHub Pages**.

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
