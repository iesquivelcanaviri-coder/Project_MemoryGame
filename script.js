"use strict";

/* ------------------------------------------------------
   DOM REFERENCES
   These variables connect JavaScript to the HTML
   ------------------------------------------------------ */
const boardEl = document.getElementById("board");
const gameForm = document.getElementById("gameForm");
const playerNameEl = document.getElementById("playerName");
const feedbackEl = document.getElementById("formFeedback");

/* ------------------------------------------------------
   GAME DATA (Arrays + Objects)
   ------------------------------------------------------ */

/*
  Symbols array
  - Each value appears twice (pair)
  - Used to build the deck
*/
const symbols = ["A", "B", "C", "D", "A", "B", "C", "D"];

/*
  Central game state object
  This mirrors lecture content on state management
*/
let state = {
  isRunning: false,     // Is the game currently active?
  cards: [],            // Array of card objects
  firstPickId: null,    // ID of first selected card
  secondPickId: null,   // ID of second selected card
  lockBoard: false      // Prevents rapid clicking
};

/* ------------------------------------------------------
   UTILITY FUNCTIONS
   ------------------------------------------------------ */

/*
  Shuffles an array using Fisher-Yates algorithm
*/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/*
  Displays feedback messages to the user
*/
function setFeedback(message) {
  feedbackEl.textContent = message;
}

/* ------------------------------------------------------
   BOARD CREATION (DOM MANIPULATION)
   ------------------------------------------------------ */

/*
  Creates the card objects from the symbols array
*/
function createCards() {
  state.cards = shuffle(
    symbols.map((value, index) => ({
      id: index,
      value: value
    }))
  );
}

/*
  Dynamically creates card buttons in the DOM
*/
function renderBoard() {
  boardEl.innerHTML = "";

  state.cards.forEach(card => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "?";
    btn.dataset.id = card.id;

    // Event listener for user interaction
    btn.addEventListener("click", onCardClick);

    boardEl.appendChild(btn);
  });
}

/* ------------------------------------------------------
   CARD INTERACTION LOGIC
   ------------------------------------------------------ */

/*
  Handles clicking on a card
  Rules enforced here:
  - Only two cards per turn
  - No rapid clicking
*/
function onCardClick(e) {
  if (!state.isRunning) return;
  if (state.lockBoard) return;

  const cardId = Number(e.currentTarget.dataset.id);

  // Prevent clicking the same card twice
  if (state.firstPickId === cardId) return;

  revealCard(e.currentTarget);

  if (state.firstPickId === null) {
    // First card in the turn
    state.firstPickId = cardId;
    return;
  }

  // Second card in the turn
  state.secondPickId = cardId;
  state.lockBoard = true;

  // Temporary delay before reset (matching logic later)
  setTimeout(resetTurn, 700);
}

/*
  Reveals the card value visually
*/
function revealCard(cardEl) {
  const cardId = Number(cardEl.dataset.id);
  const card = state.cards.find(c => c.id === cardId);
  cardEl.textContent = card.value;
}

/*
  Resets turn state
  (Matching logic added in Version 4)
*/
function resetTurn() {
  state.firstPickId = null;
  state.secondPickId = null;
  state.lockBoard = false;
}

/* ------------------------------------------------------
   GAME START (FORM PROCESSING)
   ------------------------------------------------------ */

gameForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = playerNameEl.value.trim();

  if (!name) {
    setFeedback("Please enter your name.");
    return;
  }

  state.isRunning = true;
  createCards();
  renderBoard();
  setFeedback(`Game started. Good luck, ${name}.`);
});
