"use strict";

/* --------------------------------------------------
   SELECT HTML ELEMENTS
   - These connect JavaScript to the HTML structure.
   - We store them in variables so we can update them.
-------------------------------------------------- */
const boardEl = document.getElementById("board");
const gameForm = document.getElementById("gameForm");
const playerNameEl = document.getElementById("playerName");
const difficultyEl = document.getElementById("difficulty");
const restartBtn = document.getElementById("restartBtn");
const feedbackEl = document.getElementById("formFeedback");

const movesValueEl = document.getElementById("movesValue");
const timeValueEl = document.getElementById("timeValue");
const pairsValueEl = document.getElementById("pairsValue");

/* --------------------------------------------------
   GAME CONFIGURATION
   - Defines board sizes for each difficulty.
   - SYMBOLS is the list of characters used on cards.
-------------------------------------------------- */
const DIFFICULTY = {
  easy:   { cols: 2, rows: 3 },
  medium: { cols: 3, rows: 4 },
  hard:   { cols: 4, rows: 4 }
};

// Split string into an array of single letters
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split();

/* --------------------------------------------------
   GAME STATE OBJECT
   - Stores everything that changes during the game.
   - This keeps the logic organised and easy to update.
-------------------------------------------------- */
let state = {
  isRunning: false,
  cards: [],          // Array of card objects
  firstPick: null,    // First selected card
  secondPick: null,   // Second selected card
  moves: 0,
  pairsFound: 0,
  totalPairs: 0,
  seconds: 0,
  timer: null         // setInterval reference
};

/* --------------------------------------------------
   HELPER FUNCTIONS
   - Small reusable utilities
-------------------------------------------------- */

// Randomly shuffle an array (simple method)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Convert seconds into mm:ss format
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* --------------------------------------------------
   BUILD GAME BOARD
   - Creates pairs of cards
   - Shuffles them
   - Renders them into the board
-------------------------------------------------- */

// Create a deck with pairs of symbols
function createDeck(totalCards) {
  const values = SYMBOLS.slice(0, totalCards / 2); // Only take needed symbols
  const deck = [];

  values.forEach(value => {
    deck.push({ value, matched: false }); // First copy
    deck.push({ value, matched: false }); // Second copy
  });

  return shuffle(deck);
}

// Render card buttons into the board
function renderBoard() {
  boardEl.innerHTML = ""; // Clear previous board

  state.cards.forEach((card, index) => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "Card"; // Hidden state

    // When clicked, run game logic
    btn.addEventListener("click", () => onCardClick(btn, card));

    boardEl.appendChild(btn);
  });
}

/* --------------------------------------------------
   GAME LOGIC
   - Handles flipping cards
   - Checks for matches
   - Updates moves and pairs
-------------------------------------------------- */
function onCardClick(element, card) {
  // Ignore clicks on already matched or flipped cards
  if (card.matched || element.classList.contains("is-flipped")) return;

  // Reveal card
  element.textContent = card.value;
  element.classList.add("is-flipped");

  // First pick
  if (!state.firstPick) {
    state.firstPick = { element, card };
  }
  // Second pick
  else {
    state.secondPick = { element, card };
    state.moves++;
    updateStatus();
    checkMatch();
  }
}

// Compare the two selected cards
function checkMatch() {
  const first = state.firstPick;
  const second = state.secondPick;

  // If values match → mark as matched
  if (first.card.value === second.card.value) {
    first.card.matched = true;
    second.card.matched = true;
    state.pairsFound++;
    resetPicks();
  }
  // If not a match → flip back after delay
  else {
    setTimeout(() => {
      first.element.textContent = "Card";
      second.element.textContent = "Card";
      first.element.classList.remove("is-flipped");
      second.element.classList.remove("is-flipped");
      resetPicks();
    }, 600);
  }
}

// Clear selected cards
function resetPicks() {
  state.firstPick = null;
  state.secondPick = null;
}

/* --------------------------------------------------
   STATUS + TIMER
   - Updates moves, pairs, and time on screen
   - Timer increases every second
-------------------------------------------------- */
function updateStatus() {
  movesValueEl.textContent = state.moves;
  pairsValueEl.textContent = state.pairsFound;
  timeValueEl.textContent = formatTime(state.seconds);
}

function startTimer() {
  state.timer = setInterval(() => {
    state.seconds++;
    updateStatus();
  }, 1000);
}

/* --------------------------------------------------
   START GAME (FORM SUBMISSION)
   - Validates difficulty
   - Builds deck
   - Resets state
   - Renders board
-------------------------------------------------- */
gameForm.addEventListener("submit", e => {
  e.preventDefault(); // Stop page reload

  const difficulty = difficultyEl.value;

  // Basic validation
  if (!difficulty) {
    feedbackEl.textContent = "Please select a difficulty.";
    return;
  }

  // Get board size
  const config = DIFFICULTY[difficulty];
  const totalCards = config.cols * config.rows;

  // Reset game state
  state.cards = createDeck(totalCards);
  state.totalPairs = totalCards / 2;
  state.moves = 0;
  state.pairsFound = 0;
  state.seconds = 0;

  // Apply grid layout to board
  boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

  // Build UI
  renderBoard();
  startTimer();
  updateStatus();

  feedbackEl.textContent = "Game started!";
});
