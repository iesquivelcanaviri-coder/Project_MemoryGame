"use strict";
/* --------------------------------------------------
   SELECT HTML ELEMENTS
   These are called:
   “DOM (Document Object Model) element references”
   because each variable stores a reference to an element
   from the HTML page.
--------------------------------------------------
const - JavaScript keyword.
      - Creates a constant variable.
      - The *name* of the variable cannot change later.
      - The *contents* (the HTML element) CAN still be modified.

boardEl   (THIS IS THE VARIABLE NAME YOU CREATED)
      - A name you chose yourself. “El” means “Element”.
      - This variable will store the HTML element once it is found.
      - This name does NOT come from HTML — you invented it.

= - Assignment operator.
  - Means: “store the value on the right into the variable on the left”.

document - A built‑in JavaScript object.
        - Represents the entire HTML page.
        - Created automatically by the browser.
        - Gives access to the DOM (the browser’s internal structure of your HTML).

.  - Dot operator. Used to access a method or property of an object.
    - Here it means: “use the getElementById method that belongs to document”.

getElementById - A DOM method (a function inside document). Searches the HTML for an element with a matching id.
                - Returns that element if found.

(   - Opens the method’s argument list.

"board" (STRING IN JS → MATCHES ID element IN HTML)
        - A STRING because it is inside quotes.
        - Also an ARGUMENT passed into getElementById().
        - Must match exactly the HTML id:
              <div id="board">
        - This tells JavaScript which element to search for.
)  - Closes the argument list.
;  - Ends the JavaScript statement.

--------------------------------------------------
2. DEEP LOGIC — WHAT ACTUALLY HAPPENS
--------------------------------------------------
Step 1:   The browser loads your HTML and builds the DOM tree.
Step 2:  JavaScript runs document.getElementById("board").
Step 3:  The browser searches the DOM for:
      <div id="board">...</div>
Step 4:  When found, the method RETURNS that HTML element.
Step 5:  The = operator stores the returned element inside:
      boardEl (your variable)
Step 6:  Now boardEl is a REFERENCE to the real HTML element.
  You can use boardEl later to update or modify the board.
--------------------------------------------------
FINAL SUMMARY
--------------------------------------------------
- "board" → STRING in JavaScript.
- id="board" → ELEMENT ID in HTML.
- boardEl → VARIABLE NAME YOU CREATED to store the element.
- document.getElementById("board") → searches HTML and returns the element.
- boardEl receives and stores that element for later use.

renderBoard() is the function that draws the entire game board.
The renderBoard() function uses boardEl as the gateway between the game’s
internal logic and what the player sees on the screen.
1. boardEl.innerHTML = ""
   → Completely clears the board before drawing new cards.
2. For each card in the game state:
   → JavaScript creates a button element in memory.
   → The card is invisible until it is added to the board.
3. boardEl.appendChild(btn)
   → Inserts each card button into the <div id="board"> element.
   → This is the moment the card becomes visible to the player.
Without boardEl:
- The board could not be cleared.
- The layout could not be updated.
- Cards could not be added to the screen.
- The game would run internally but remain completely invisible.
*/

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
   Game CONFIGURATION OBJECT:  Defines board size for each difficulty
   -Later in the script, the selected difficulty is used to look up these values, 
   - which determine the board layout, the number of cards to generate, 
   -and how the board is rendered on the screen.”
-------------------------------------------------- */
const DIFFICULTY = {
  easy:   { cols: 2, rows: 3 },
  medium: { cols: 3, rows: 4 },
  hard:   { cols: 4, rows: 4 }
};

/* constant containing an ARRAY OF SYMBOLS  */
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

/* --------------------------------------------------
   GAME STATE OBJECT
   - Stores everything that changes during the game
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

// Shuffle array randomly
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Convert seconds to mm:ss format
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* --------------------------------------------------
   CREATE GAME DECK
-------------------------------------------------- */
function createDeck(totalCards) {
  const values = SYMBOLS.slice(0, totalCards / 2);
  const deck = [];

  values.forEach(value => {
    deck.push({ value, matched: false });
    deck.push({ value, matched: false });
  });

  return shuffle(deck);
}

/* --------------------------------------------------
   RENDER GAME BOARD
-------------------------------------------------- */
function renderBoard() {
  boardEl.innerHTML = "";

  state.cards.forEach(card => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "Card";

    btn.addEventListener("click", () => onCardClick(btn, card));
    boardEl.appendChild(btn);
  });
}

/* --------------------------------------------------
   CARD INTERACTION LOGIC
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

/* --------------------------------------------------
   MATCH CHECKING
-------------------------------------------------- */
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

/* --------------------------------------------------
   RESET CARD PICKS
-------------------------------------------------- */
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
   START GAME (FORM SUBMISSION)
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
