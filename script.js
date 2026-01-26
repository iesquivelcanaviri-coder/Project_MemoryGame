"use strict";

/* --------------------------------------------------
   SELECT HTML ELEMENTS
   - These variables connect JavaScript to HTML
   - We use getElementById to access elements
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
   - Defines board sizes for each difficulty
-------------------------------------------------- */
const DIFFICULTY = {
  easy:   { cols: 2, rows: 3 },
  medium: { cols: 3, rows: 4 },
  hard:   { cols: 4, rows: 4 }
};

/* Letters used on the cards */
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

/* --------------------------------------------------
   GAME STATE OBJECT
   - Stores all changing values during the game
-------------------------------------------------- */
let state = {
  isRunning: false,
  cards: [],
  firstPick: null,
  secondPick: null,
  moves: 0,
  pairsFound: 0,
  totalPairs: 0,
  seconds: 0,
  timer: null
};

/* --------------------------------------------------
   HELPER FUNCTIONS
-------------------------------------------------- */

// Shuffle an array randomly
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
   CREATE AND RENDER GAME BOARD
-------------------------------------------------- */

// Create card pairs
function createDeck(totalCards) {
  const values = SYMBOLS.slice(0, totalCards / 2);
  const deck = [];

  values.forEach(value => {
    deck.push({ value, matched: false });
    deck.push({ value, matched: false });
  });

  return shuffle(deck);
}

// Render cards into the board
function renderBoard() {
  boardEl.innerHTML = "";

  state.cards.forEach((card) => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "Card";

    btn.addEventListener("click", () => onCardClick(btn, card));
    boardEl.appendChild(btn);
  });
}

/* --------------------------------------------------
   GAME LOGIC
-------------------------------------------------- */

function onCardClick(element, card) {
  if (card.matched || element.classList.contains("is-flipped")) return;

  element.textContent = card.value;
  element.classList.add("is-flipped");

  if (!state.firstPick) {
    state.firstPick = { element, card };
  } else {
    state.secondPick = { element, card };
    state.moves++;
    updateStatus();
    checkMatch();
  }
}

function checkMatch() {
  const first = state.firstPick;
  const second = state.secondPick;

  if (first.card.value === second.card.value) {
    first.card.matched = true;
    second.card.matched = true;
    state.pairsFound++;
    resetPicks();
  } else {
    setTimeout(() => {
      first.element.textContent = "Card";
      second.element.textContent = "Card";
      first.element.classList.remove("is-flipped");
      second.element.classList.remove("is-flipped");
      resetPicks();
    }, 600);
  }
}

function resetPicks() {
  state.firstPick = null;
  state.secondPick = null;
}

/* --------------------------------------------------
   STATUS AND TIMER
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
   FORM SUBMISSION (START GAME)
-------------------------------------------------- */
gameForm.addEventListener("submit", e => {
  e.preventDefault();

  const difficulty = difficultyEl.value;
  if (!difficulty) {
    feedbackEl.textContent = "Please select a difficulty.";
    return;
  }

  const config = DIFFICULTY[difficulty];
  const totalCards = config.cols * config.rows;

  state.cards = createDeck(totalCards);
  state.totalPairs = totalCards / 2;
  state.moves = 0;
  state.pairsFound = 0;
  state.seconds = 0;

  boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

  renderBoard();
  startTimer();
  updateStatus();

  feedbackEl.textContent = "Game started!";
});
