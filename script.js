"use strict";

/* ------------------------
   DOM REFERENCES
------------------------*/
const boardEl = document.getElementById("board");
const gameForm = document.getElementById("gameForm");
const playerNameEl = document.getElementById("playerName");
const feedbackEl = document.getElementById("formFeedback");

/* ------------------------
   GAME DATA (Arrays & Objects)
------------------------ */
const symbols = ["A", "B", "C", "D", "A", "B", "C", "D"];

let cards = [];
let isRunning = false;

/* ------------------------
   UTILITY FUNCTIONS
------------------------ */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setFeedback(message) {
  feedbackEl.textContent = message;
}

/* ------------------------
   BOARD CREATION
------------------------ */
function createCards() {
  cards = shuffle(
    symbols.map((value, index) => ({
      id: index,
      value: value
    }))
  );
}

function renderBoard() {
  boardEl.innerHTML = "";

  cards.forEach(card => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "?";

    btn.addEventListener("click", () => {
      if (!isRunning) return;
      btn.textContent = card.value;
    });

    boardEl.appendChild(btn);
  });
}

/* ------------------------
   GAME START
------------------------ */
gameForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = playerNameEl.value.trim();

  if (!name) {
    setFeedback("Please enter your name.");
    return;
  }

  isRunning = true;
  createCards();
  renderBoard();
  setFeedback(`Game started. Good luck, ${name}.`);
});
