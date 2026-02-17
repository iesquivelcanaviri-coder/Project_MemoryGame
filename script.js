(function () { "use strict";
/* --------------------------------------------------
   DOM (Document Object Model) ELEMENT REFERENCES — CONSTANT ASSIGNMENTS FOR SELECTING HTML ELEMENTS
   • These constants store references to specific HTML elements. 
   • Type -> Constant variable declarations using `const`. 
   • Purpose -> Provide direct access to UI (User Interface) components so the game logic can update text, layout, and interactivity.
   • Pattern -> Standard JavaScript practice: gather all DOM references at the top for clarity, organisation, and reuse.
-------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) The browser loads your HTML and builds the DOM tree.
   2) JavaScript executes document -> getElementById("board").
   3) The browser searches the DOM for:
          <div id="board"> ... </div>
   4) If found, the method RETURNS that HTML element.
   5) The assignment operator (=) stores the returned element in boardEl.
   6) boardEl now becomes a REFERENCE to the real HTML element.
        -> You can modify it later (innerHTML, styles, children, etc.).
        -> It acts as the bridge between game logic and visible UI.
--------------------------------------------------
   FINAL SUMMARY
   "board"  -> JavaScript STRING passed to getElementById().
   id="board"  -> HTML identifier used to locate the element.
   boardEl -> Your JavaScript variable storing the DOM element.
   document -> getElementById("board")  -> DOM lookup method that retrieves the element.
   boardEl  -> Used throughout the game to update the board visually.
   Example usage in renderBoard():
       1) boardEl -> innerHTML = ""   -> Clears the board before drawing new cards.
       2) JavaScript creates button elements for each card.
       3) boardEl -> appendChild(btn) Inserts each card into the board container. This is when the card becomes visible to the player.
-------------------------------------------------- */
const boardEl = document.getElementById("board");
/*const -> JavaScript keyword. Declares a constant variable.
        -> The variable name cannot be reassigned. The referenced element’s properties CAN still change.
boardEl -> Developer‑chosen variable name. “El” means “Element”. Stores the returned HTML element.
        -> Not taken from HTML — this is your own identifier.
= -> Assignment operator. Meaning: “Store the value on the right into the variable on the left.”
document -> Built‑in JavaScript object. Represents the entire loaded HTML page. Gives access to the DOM tree.
. ->Property/method access operator. Used here to access the DOM method getElementById.
getElementById-> DOM method belonging to `document`. Searches the DOM for an element with a matching id.
        -> Returns the element if found, otherwise null.
(  -> Opens the method’s argument list.
"board"  -> JavaScript STRING.  Passed as an argument to getElementById().
         -> Must match exactly the HTML id:  <div id="board">
         -> Tells the browser which element to search for.
)  -> Closes the argument list. */
const gameForm = document.getElementById("gameForm");
const playerNameEl = document.getElementById("playerName");
const difficultyEl = document.getElementById("difficulty"); 
const restartBtn = document.getElementById("restartBtn"); 
const feedbackEl = document.getElementById("formFeedback"); 


const movesValueEl = document.getElementById("movesValue");
const timeValueEl = document.getElementById("timeValue");
const pairsValueEl = document.getElementById("pairsValue");

const historyBodyEl = document.getElementById("historyBody");

/* --------------------------------------------------
   CONSTANT OBJECT WITH NESTED SETTINGS — DIFFICULTY
   • DIFFICULTY is a constant object containing three nested objects.
   • Type -> Constant variable declaration using `const`.
   • Purpose -> Store preset board configurations for each difficulty level.
   • Pattern -> Structured data object used as a lookup table for game settings.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) The user selects a difficulty level in the form.
   2) JavaScript reads that value (e.g., "easy", "medium", "hard").
   3) That string is used as a key to access DIFFICULTY[key].
   4) The corresponding nested object is returned: DIFFICULTY["easy"] -> { cols: 2, rows: 3 }
   5) The game calculates: totalCards -> cols * rows
   6) createDeck(totalCards) uses this number to build the deck.
   7) The board layout is updated using:  boardEl -> style -> gridTemplateColumns
   8) The game state uses: state.totalPairs = totalCards / 2
-------------------------------------------------- */
const DIFFICULTY = { /* const -> Declares a constant (cannot be reassigned, protects configuration); DIFFICULTY -> Lookup table storing difficulty presets; = -> Assigns the object to the constant; { } -> Object literal containing all difficulty levels */ 
  easy: { cols: 2, rows: 3 }, /* easy -> Key identifying the easy difficulty; : -> Separates key from value; {cols:2, rows:3} -> Nested object defining board layout; cols -> number of columns; rows -> number of rows; total cards = 2×3 = 6 (3 pairs); Why -> smallest grid, beginner‑friendly */
  medium: { cols: 3, rows: 4 }, /* medium -> Key for medium difficulty; {cols:3, rows:4} -> Layout object; cols -> 3 columns; rows -> 4 rows; total cards = 3×4 = 12 (6 pairs); Why -> moderate challenge, more symbols to remember */
  hard: { cols: 4, rows: 4 } /* hard -> Key for hardest difficulty; {cols:4, rows:4} -> Layout object; cols -> 4 columns; rows -> 4 rows; total cards = 4×4 = 16 (8 pairs); Why -> largest grid, highest memory load */
}; 

/* --------------------------------------------------
   CONSTANT ARRAY CREATED FROM A STRING — SYMBOLS
   • SYMBOLS is a constant array created by splitting a string of letters.
   • Type -> Constant variable declaration using `const`.
   • Purpose -> Provide a reusable pool of card symbols for deck creation.
   • Pattern -> Convert a string into an array using split("") so each
                character becomes an individual symbol.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) JavaScript reads the string of letters.
   2) split("") breaks it into individual characters.
   3) The resulting array is stored in SYMBOLS.
   4) When a game starts, createDeck() uses: SYMBOLS -> slice(0, totalCards / 2)  to select the number of symbols needed.
   5) Each selected symbol is duplicated to form a pair.
   6) The deck is shuffled to randomize card order.
   7) The shuffled deck is stored in:  state.cards
   8) renderBoard() uses state.cards to draw the visible cards.
-------------------------------------------------- */
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".split(""); 
/*const    -> JavaScript keyword. Declares a constant variable. -> The variable name cannot be reassigned.  The array contents CAN still be read or used.
  SYMBOLS   -> Developer‑chosen variable name. -> Stores the array of card symbols. -> Used by createDeck() to generate card values.
  =    -> Assignment operator. Meaning: “Store the value on the right into the variable on the left.”
  "ABCDEFGHJKLMNPQRSTUVWXYZ"    -> JavaScript STRING. Contains all available card symbols. -> Each character will become one array element.
  .   -> Property/method access operator.  -> Used here to access the split() method of the string.
  split("")   -> Built‑in string method.  Splits the string into an array. -> "" means “split between every character”. eg: "ABC".split("") -> ["A", "B", "C"]
  RESULT  -> SYMBOLS becomes: ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z"] -> An array of single‑character strings. */ 

/* --------------------------------------------------
   MUTABLE GAME STATE OBJECT — state
   • state is a mutable object that stores all live game data.
   • Type -> Variable declaration using `let` (value CAN change).
   • Purpose -> Track gameplay progress, selections, timer, moves, and deck.
   • Pattern -> Centralised data container used by all game functions.
--------------------------------------------------
1) User selects difficulty → this sets state.difficulty and determines board size (state is the central data object storing all game information).  
2) totalCards is calculated from cols × rows → difficulty selection feeds into state.totalPairs and deck creation.  
3) createDeck(totalCards) fills state.cards → createDeck() is one of the functions that writes into state.  
4) state.totalPairs is set to totalCards / 2 → used later by checkMatch() and updateStatus().  
5) Timer starts → startTimer() updates state.seconds every second → state feeds into the timer display.  
6) Player interacts with cards → onCardClick() updates firstPickId, secondPickId, moves → onCardClick() is another function that modifies state.  
7) checkMatch() updates pairsFound, lockBoard, and resets picks → checkMatch() both reads and writes state.  
8) updateStatus() reads moves, pairsFound, secondsElapsed to update the UI → renderBoard(), updateStatus(), and the timer all read from state to keep the interface in sync.
-------------------------------------------------- */
let state = { /* let -> Declares a mutable variable; state -> central game data object; = {} -> object literal storing all game state properties */
  isRunning: false, /* isRunning -> Boolean flag for active gameplay; false -> game not started yet */
  playerName: "", /* playerName -> Stores player's name; "" -> empty until user enters a name */
  difficulty: null, /* difficulty -> Stores selected difficulty level; null -> none chosen yet */
  cards: [], /* cards -> Array of card objects created by createDeck(); [] -> empty until game starts */
  firstPickId: null, /* firstPickId -> ID of first selected card; null -> no selection yet */
  secondPickId: null, /* secondPickId -> ID of second selected card; null -> no second selection yet */
  lockBoard: false, /* lockBoard -> Prevents clicks during animations; false -> board initially unlocked */
  moves: 0, /* moves -> Counts number of turns taken; 0 -> starts at zero */
  pairsFound: 0, /* pairsFound -> Number of matched pairs; 0 -> none found at start */
  totalPairs: 0, /* totalPairs -> Total number of pairs based on difficulty; 0 -> placeholder until game starts */
  timerId: null, /* timerId -> Stores setInterval() ID for timer; null -> timer not running */
  secondsElapsed: 0 /* secondsElapsed -> Tracks elapsed time in seconds; 0 -> timer starts at zero */
};


/* --------------------------------------------------
   GAME HISTORY (ARRAY OF OBJECTS)
   • Stores the last 5 completed games.
   • Purpose → Provide data for the “Last 5 Games” history table.
   • Pattern → A mutable array updated after each completed game.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
1) Script loads → gameHistory starts empty (Purpose → store structured data about past games).  
2) endGame() creates a result object (Inputs → result objects created at endGame()).  
3) JS pushes the result into gameHistory (Internal step → push new result).  
4) If length > 5 → JS removes the oldest entry (Internal step → trim array to last 5).  
5) updateHistoryTable() writes rows into <tbody id="historyBody"> (Internal step → update table).  
6) User sees the last 5 games displayed in the interface (Output → visible history of recent games; Used by → endGame(), updateHistoryTable(), UI history panel).

-------------------------------------------------- */
let gameHistory = []; /* let -> Declares a mutable variable (value can change during gameplay);
                         gameHistory -> Developer‑chosen name for an array storing past game results;
                         = -> Assignment operator (“store the value on the right into the variable on the left”);
                         [] -> Empty array literal; acts as a container that will hold history objects after each completed game;
                         Why -> Used to display the “Last 5 Games” table by storing player, difficulty, moves, time, and pairs for each finished game */

/* --------------------------------------------------
   UTILITY FUNCTIONS — SHUFFLING, TIME FORMATTING, FEEDBACK
   • These are function declarations (reusable named blocks of code).
   • shuffle() → Randomizes an array of items.
   • formatTime() → Converts raw seconds into a user‑friendly "mm:ss" string.
   • setFeedback() → Updates the feedback area in the DOM. → Displays messages to the player; used in validation, game start, and endGame().
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   shuffle()
      1) Receives an array of card objects.
      2) Iterates backward through the array.
      3) Swaps each element with a random index.
      4) Returns the randomized array.
      5) Used by createDeck() to shuffle card pairs.
   formatTime()
      1) Receives total elapsed seconds.
      2) Calculates minutes and seconds.
      3) Formats both as two‑digit strings.
      4) Returns a UI‑friendly "mm:ss" value.
      5) Used by updateStatus() to update the timer display.
   setFeedback()
      1) Receives a message string.
      2) Writes it into the feedback DOM element.
      3) Used for validation errors, instructions, and end‑game messages.
-------------------------------------------------- */
function shuffle(array) { /* function -> declares a reusable block of code; shuffle -> function name; (array) -> parameter receiving the array to randomize; { } -> function body */
  for (let i = array.length - 1; i > 0; i--) { /* for -> loop keyword; let i -> loop counter; array.length - 1 -> start at last index; i > 0 -> stop before index 0; i-- -> decrement each iteration */
    const j = Math.floor(Math.random() * (i + 1)); /* const -> constant variable; j -> random index; Math.random() -> random number 0–1; * (i+1) -> scale to valid index; Math.floor -> convert to whole number */
    [array[i], array[j]] = [array[j], array[i]]; /* [a,b]=[b,a] -> destructuring swap; array[i] <-> array[j] -> exchanges elements to shuffle order */
  }
  return array; /* return -> outputs the shuffled array back to the caller */
}

function formatTime(seconds) { /* function -> declares reusable code; formatTime -> name; (seconds) -> input value representing elapsed seconds */
  const m = String(Math.floor(seconds / 60)).padStart(2, "0"); /* const m -> minutes string; seconds/60 -> convert to minutes; Math.floor -> whole minutes; String() -> convert to text; padStart(2,"0") -> ensure 2 digits */
  const s = String(seconds % 60).padStart(2, "0"); /* const s -> seconds string; seconds % 60 -> remainder after minutes; padStart -> ensures "00"–"59" format */
  return `${m}:${s}`; /* return -> output formatted time; `${}` -> template literal combining minutes and seconds */
}

function setFeedback(msg) { /* function -> declares reusable code; setFeedback -> name; (msg) -> message string to display */
  feedbackEl.textContent = msg; /* feedbackEl -> DOM element for feedback; .textContent -> sets visible text; = msg -> assign the message to the element */
}


/* --------------------------------------------------
   FUNCTION DECLARATION + BOARD RENDERING LOGIC — renderBoard()
   • buildBoardGrid() → Sets the CSS grid layout for the board.
   • renderBoard() → Creates the visible card elements and inserts them into the DOM.
   • Purpose → Build a fresh, interactive game board based on state.cards.
   • Pattern → Clear board → loop cards → create elements → attach listeners → append to DOM.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF buildBoardGrid():
   function buildBoardGrid(cols, rows) { ... }
      function → Declares a reusable function.
      buildBoardGrid → Developer‑chosen name; purpose: configure board layout.
      (cols, rows) → Parameters defining number of columns and rows.
      { } → Function body.
   boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      boardEl → DOM element representing the game board.
      .style.gridTemplateColumns → CSS property controlling column layout.
      repeat(${cols}, 1fr) → Creates a grid with N equal‑width columns.
      ; → Ends the statement.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF renderBoard():
   function renderBoard() { ... }
      function → Declares a reusable function.
      renderBoard → Developer‑chosen name; purpose: build the visible card grid.
      { } → Function body.
   boardEl.innerHTML = "";
      boardEl → DOM container for all cards.
      .innerHTML = "" → Clears any existing cards from previous games.
      ; → Ends the statement.
   state.cards.forEach(card => { ... });
      state → Global game state object.
      .cards → Array of card objects created by createDeck().
      .forEach(...) → Loops through each card.
      (card) → Parameter representing the current card object.
      => → Arrow function.
      { } → Logic executed for each card.
   const btn = document.createElement("button");
      const → Declares a block‑scoped constant.
      btn → Variable holding the new button element.
      document.createElement("button") → Creates a <button> element.
      ; → Ends the statement.
   btn.className = "card";
      .className → Assigns CSS class for styling.
      "card" → Base class for all card buttons.
      ; → Ends the statement.
   btn.dataset.id = card.id;
      .dataset → Stores custom data attributes.
      .id → Custom attribute used to track card identity.
      card.id → Unique ID from the card object.
      ; → Ends the statement.
   const front = document.createElement("div");
      Creates the front face of the card (revealed value).
   front.className = "card-inner front";
      Assigns styling classes for the front face.
   front.textContent = card.value;
      Sets the visible letter/emoji/value for the card.
   const back = document.createElement("div");
      Creates the back face of the card (default hidden side).
   back.className = "card-inner back";
      Assigns styling classes for the back face.
   back.textContent = "Card";
      Placeholder text shown before flipping.
   btn.append(front, back);
      append() → Inserts both faces into the button element.
   btn.addEventListener("click", onCardClick);
      addEventListener → Attaches click handler.
      "click" → Event type.
      onCardClick → Function that processes card flipping logic.
      ; → Ends the statement.
   boardEl.appendChild(btn);
      appendChild → Adds the card button to the board.
      btn → The fully constructed card element.
      ; → Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   buildBoardGrid()
      1) Receives number of columns and rows.
      2) Updates CSS grid layout.
      3) Ensures board visually matches difficulty level.
   renderBoard()
      1) Clears old board content.
      2) Loops through state.cards.
      3) Creates a button for each card.
      4) Builds front + back faces.
      5) Attaches click listener for flipping.
      6) Appends card to boardEl.
      7) Player sees a fresh, interactive grid.
--------------------------------------------------
   FINAL SUMMARY
   buildBoardGrid() → Configures board layout based on difficulty.
   renderBoard() → Builds the visible card grid from state.cards.
   Inputs → state.cards, boardEl, card values.
   Internal steps → clear board → loop → create elements → attach listeners → append.
   Outputs → Fully rendered, interactive memory game board.
   Used by → startGame(), resetGame(), difficulty changes.
-------------------------------------------------- */
function buildBoardGrid(cols, rows) {
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function renderBoard() {
  boardEl.innerHTML = "";

  state.cards.forEach(card => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.dataset.id = card.id;

    const front = document.createElement("div");
    front.className = "card-inner front";
    front.textContent = card.value;

    const back = document.createElement("div");
    back.className = "card-inner back";
    back.textContent = "Card";

    btn.append(front, back);
    btn.addEventListener("click", onCardClick);

    boardEl.appendChild(btn);
  });
}




/* --------------------------------------------------
   FUNCTION DECLARATION + STATUS UPDATE LOGIC — updateStatus()
   • updateStatus() is a function declaration.
   • Purpose -> Refresh the UI values for moves, pairs, and time.
   • Pattern -> Read state → format values → write to DOM.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function updateStatus() { ... }
      function -> JavaScript keyword; declares a reusable function.
      updateStatus -> Developer‑chosen name; updates visible game stats.
      { } -> Function body containing all instructions.
   movesValueEl.textContent = state.moves;
      movesValueEl -> DOM element showing the number of moves.
      .textContent -> Sets the visible text inside the element.
      = state.moves -> Writes the current move count from state.
      ; -> Ends the statement.
   pairsValueEl.textContent = state.pairsFound;
      pairsValueEl -> DOM element showing number of matched pairs.
      .textContent -> Updates the displayed value.
      = state.pairsFound -> Writes the number of pairs found.
      ; -> Ends the statement.
   timeValueEl.textContent = formatTime(state.seconds);
      timeValueEl -> DOM element showing elapsed time.
      .textContent -> Updates the displayed time.
      formatTime(state.seconds) -> Converts raw seconds into "mm:ss".
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) updateStatus() is called after moves, pairs, or time changes.
   2) It reads state.moves and writes it to movesValueEl.
   3) It reads state.pairsFound and writes it to pairsValueEl.
   4) It formats state.seconds using formatTime().
   5) It writes the formatted time into timeValueEl.
   6) The UI instantly reflects the current game progress.
--------------------------------------------------
   FINAL SUMMARY
   updateStatus() -> Synchronises the UI with the current game state.
   Inputs -> state.moves, state.pairsFound, state.seconds.
   Internal steps -> read state → format → write to DOM.
   Outputs -> Updated moves, pairs, and timer on screen.
   Used by -> onCardClick(), checkMatch(), startTimer(), resetGame().
-------------------------------------------------- */
function updateStatus() {
  movesValueEl.textContent = state.moves;
  pairsValueEl.textContent = state.pairsFound;
  timeValueEl.textContent = formatTime(state.secondsElapsed);
}

/* --------------------------------------------------
   FUNCTION DECLARATION + DECK CREATION LOGIC — createDeck(totalCards)
   • createDeck() → Builds a complete deck of card objects for the game.
   • Purpose → Select symbols → duplicate → assign IDs → shuffle → return.
   • Pattern → Slice symbols → duplicate → create objects → shuffle → return.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF createDeck():
   function createDeck(totalCards) { ... }
      function → Declares a reusable function.
      createDeck → Developer‑chosen name; builds the full deck.
      (totalCards) → Parameter; number of cards required for the chosen difficulty.
      { } → Function body.
   const values = SYMBOLS.slice(0, totalCards / 2);
      const → Declares a constant variable.
      values → Array of unique symbols used for this game.
      SYMBOLS → Master list of all possible card symbols.
      .slice(0, totalCards / 2) → Extracts only the number of symbols needed.
      ; → Ends the statement.
   let id = 1;
      let → Declares a mutable variable.
      id → Unique numeric identifier assigned to each card.
      1 → Starting ID value.
      ; → Ends the statement.
   const deck = values.flatMap(v => ([ ... ]));
      values → Array of unique symbols.
      .flatMap(...) → Maps each symbol to TWO card objects and flattens the result.
      v → Current symbol.
      => → Arrow function.
      [ { ... }, { ... } ] → Creates a pair of card objects.
      ; → Ends the statement.
   { id: id++, value: v, matched: false }
      id: id++ → Assigns unique ID, then increments id.
      value: v → Stores the symbol.
      matched: false → Initial state; card is not matched yet.
   return shuffle(deck);
      return → Sends the final deck back to the caller.
      shuffle(deck) → Randomizes card order.
      ; → Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) totalCards is calculated from difficulty (cols × rows).
   2) SYMBOLS.slice(...) selects the correct number of unique symbols.
   3) Each symbol is duplicated to form a matching pair.
   4) Each card receives a unique ID.
   5) flatMap() builds the full deck of objects.
   6) shuffle(deck) randomizes the order.
   7) The shuffled deck is returned.
   8) state.cards receives the final deck.
   9) renderBoard() uses state.cards to draw the grid.
--------------------------------------------------
   FINAL SUMMARY
   createDeck(totalCards) → Builds the full deck for the game.
   Inputs → totalCards (from difficulty), SYMBOLS (master symbol list).
   Internal steps → slice symbols → duplicate → assign IDs → shuffle.
   Outputs → A fully randomized deck stored in state.cards.
   Used by → startGame(), resetGame(), difficulty changes.
-------------------------------------------------- */
function createDeck(totalCards) {
  const values = SYMBOLS.slice(0, totalCards / 2);
  let id = 1;

  const deck = values.flatMap(v => ([
    { id: id++, value: v, matched: false },
    { id: id++, value: v, matched: false }
  ]));
  return shuffle(deck);
}

/* --------------------------------------------------
   TIMER LOGIC — startTimer()
   • startTimer() → Begins the game timer.
   • Purpose → Increment elapsed seconds and update UI every second.
   • Pattern → setInterval → increment → updateStatus().
--------------------------------------------------
   TECHNICAL BREAKDOWN:
   state.timerId = setInterval(() => { ... }, 1000);
      state.timerId → Stores interval ID so it can be stopped later.
      setInterval → Repeats a function every X milliseconds.
      () => { ... } → Arrow function executed every second.
      1000 → Runs once per second.
   state.secondsElapsed++;
      Increments total elapsed seconds.
   updateStatus();
      Refreshes UI timer display.
--------------------------------------------------
   FINAL SUMMARY
   startTimer() → Begins the timer loop.
   Inputs → None.
   Internal steps → increment seconds → update UI.
   Outputs → Updated timer display every second.
   Used by → startGame(), resume logic.
-------------------------------------------------- */
function startTimer() {
  state.timerId = setInterval(() => {
    state.secondsElapsed++;
    updateStatus();
  }, 1000);
}

/* --------------------------------------------------
   GAME INITIALIZATION LOGIC — startGame(difficultyKey)
   • startGame() → Prepares all game state and UI for a new game.
   • Purpose → Configure difficulty → build deck → render board → start timer.
   • Pattern → Read config → update state → build grid → render → start timer.
--------------------------------------------------
   TECHNICAL BREAKDOWN:
   const config = DIFFICULTY[difficultyKey];
      DIFFICULTY → Lookup table containing cols/rows for each difficulty.
      difficultyKey → "easy", "medium", or "hard".
      config → Object containing { cols, rows }.
   const totalCards = config.cols * config.rows;
      Calculates total number of cards needed.
   state.difficulty = difficultyKey;
      Saves selected difficulty.
   state.cards = createDeck(totalCards);
      Generates full deck and stores it in state.
   state.totalPairs = totalCards / 2;
      Calculates number of matching pairs.
   state.isRunning = true;
      Marks game as active.
   buildBoardGrid(config.cols, config.rows);
      Configures CSS grid layout.
   renderBoard();
      Builds visible card buttons.
   updateStatus();
      Resets UI counters.
   startTimer();
      Begins timer.
   restartBtn.disabled = false;
      Enables restart button.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) Difficulty is read from DIFFICULTY table.
   2) Total cards are calculated.
   3) Deck is created and shuffled.
   4) State is updated (difficulty, cards, pairs, running flag).
   5) Board grid is configured.
   6) Cards are rendered.
   7) Timer starts.
   8) Restart button becomes active.
--------------------------------------------------
   FINAL SUMMARY
   startGame(difficultyKey) → Fully initializes a new game.
   Inputs → difficultyKey ("easy", "medium", "hard").
   Internal steps → configure → create deck → render → start timer.
   Outputs → Fresh board, running timer, updated UI.
   Used by → Form submission, restart logic.
-------------------------------------------------- */
function startGame(difficultyKey) {
  const config = DIFFICULTY[difficultyKey];
  const totalCards = config.cols * config.rows;

  state.difficulty = difficultyKey;
  state.cards = createDeck(totalCards);
  state.totalPairs = totalCards / 2;
  state.isRunning = true;

  buildBoardGrid(config.cols, config.rows);
  renderBoard();
  updateStatus();
  startTimer();

  restartBtn.disabled = false;
}


/* --------------------------------------------------
   FUNCTION DECLARATION + CLICK LOGIC — onCardClick(e)
   • onCardClick() → Handles all card‑click interactions.
   • Purpose → Validate click → flip card → store pick → update state → trigger match logic.
   • Pattern → Guard clauses → flip → store pick → increment → update → check match.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF onCardClick():
   function onCardClick(e) { ... }
      function → Declares a reusable function.
      onCardClick → Developer‑chosen name; handles card flipping logic.
      (e) → Event object from the click event.
      { } → Function body.
   if (!state.isRunning || state.lockBoard) return;
      state.isRunning → Ensures game has started.
      state.lockBoard → Prevents clicks during mismatch animation.
      return → Exits early if interaction is invalid.
      ; → Ends the statement.
   const id = Number(e.currentTarget.dataset.id);
      e.currentTarget → The clicked button element.
      .dataset.id → Reads the card’s ID stored in HTML.
      Number(...) → Converts string to number.
      id → Numeric card identifier.
      ; → Ends the statement.
   const card = getCardById(id);
      getCardById(id) → Retrieves the card object from state.cards.
      card → The card object associated with this button.
      ; → Ends the statement.
   if (card.matched || state.firstPickId === id) return;
      card.matched → Prevents flipping already matched cards.
      state.firstPickId === id → Prevents clicking the same card twice.
      return → Exits early.
      ; → Ends the statement.
   e.currentTarget.classList.add("is-flipped");
      .classList.add → Applies flipped styling.
      "is-flipped" → CSS class that reveals the card.
      ; → Ends the statement.
   if (!state.firstPickId) { ... }
      !state.firstPickId → True when no card has been selected yet.
      { } → First‑pick logic block.
      state.firstPickId = id;
         Stores ID of the first selected card.
         ; → Ends the statement.
      return;
         Ends function; waits for second card.
         ; → Ends the statement.
   state.secondPickId = id;
      Stores ID of the second selected card.
      ; → Ends the statement.
   state.moves++;
      Increments move counter.
      ; → Ends the statement.
   updateStatus();
      Refreshes UI counters (moves, pairs, time).
      ; → Ends the statement.
   checkForMatch();
      Compares firstPickId and secondPickId.
      ; → Ends the statement.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF checkForMatch():
   function checkForMatch() { ... }
      function → Declares a reusable function.
      checkForMatch → Compares selected cards.
      { } → Function body.
   const first = getCardById(state.firstPickId);
      Retrieves first selected card object.
   const second = getCardById(state.secondPickId);
      Retrieves second selected card object.
   if (first.value === second.value) { ... }
      Compares card values.
      Match → Mark both as matched.
      state.pairsFound++ → Increase matched pair count.
      clearPicks() → Reset selection.
      endGame() → Triggered when all pairs found.
   else { ... }
      Mismatch → lock board → wait → flip back → unlock.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF clearPicks():
   function clearPicks() { ... }
      Resets firstPickId and secondPickId to null.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) Player clicks a card.
   2) Guard clauses ensure:
        → Game is running
        → Board is not locked
        → Card is not matched
        → Card is not the same as firstPick
   3) Card is visually flipped.
   4) If no firstPick:
        → Store firstPickId and exit.
   5) If secondPick:
        → Store secondPickId
        → Increment moves
        → updateStatus()
        → checkForMatch()
   6) checkForMatch():
        → If match → mark matched → increment pairs → clear picks → maybe endGame()
        → If mismatch → lock board → flip back after delay → unlock → clear picks
--------------------------------------------------
   FINAL SUMMARY
   onCardClick(e) → Core interaction handler for flipping cards.
   checkForMatch() → Determines match/mismatch and updates state.
   clearPicks() → Resets selection after each turn.
   Inputs → Click event, card IDs, state.cards.
   Internal steps → validate → flip → store → update → compare.
   Outputs → Updated UI, updated state, match/mismatch resolution.
   Used by → renderBoard() (event listeners), updateStatus(), endGame().
-------------------------------------------------- */
function getCardById(id) {
  return state.cards.find(c => c.id === id);
}

function getCardElementById(id) {
  return document.querySelector(`.card[data-id="${id}"]`);
}

function onCardClick(e) {
  if (!state.isRunning || state.lockBoard) return;

  const id = Number(e.currentTarget.dataset.id);
  const card = getCardById(id);

  if (card.matched || state.firstPickId === id) return;

  e.currentTarget.classList.add("is-flipped");

  if (!state.firstPickId) {
    state.firstPickId = id;
    return;
  }

  state.secondPickId = id;
  state.moves++;
  updateStatus();
  checkForMatch();
}

function checkForMatch() {
  const first = getCardById(state.firstPickId);
  const second = getCardById(state.secondPickId);

  if (first.value === second.value) {
    first.matched = true;
    second.matched = true;

    state.pairsFound++;
    clearPicks();

    if (state.pairsFound === state.totalPairs) {
      endGame();
    }
  } else {
    state.lockBoard = true;

    setTimeout(() => {
      const firstEl = getCardElementById(state.firstPickId);
      const secondEl = getCardElementById(state.secondPickId);

      if (firstEl) firstEl.classList.remove("is-flipped");
      if (secondEl) secondEl.classList.remove("is-flipped");

      clearPicks();
      state.lockBoard = false;
    }, 600);
  }
}

function clearPicks() {
  state.firstPickId = null;
  state.secondPickId = null;
}

/* --------------------------------------------------
   FUNCTION DECLARATION + INTERNAL ACTIONS — endGame()
   • endGame() → Cleanly finishes the game and updates the UI.
   • Purpose → Stop gameplay, stop the timer, save history, update UI with final message.
   • Pattern → Stop timer → update state → save history → update UI.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF endGame():
   function endGame() { ... }
      function → Declares a reusable function.
      endGame → Developer‑chosen name; handles game completion.
      { } → Function body.
   clearInterval(state.timerId);
      clearInterval → Built‑in function that stops a running interval.
      state.timerId → ID returned by setInterval() in startTimer().
      Stops the timer immediately.
      ; → Ends the statement.
   state.isRunning = false;
      state.isRunning → Boolean controlling whether gameplay is active.
      = false → Prevents further card clicks.
      ; → Ends the statement.
   gameHistory.unshift({ ... });
      gameHistory → Array storing last 5 completed games.
      .unshift(...) → Inserts new result at the beginning of the array.
      { ... } → Game result object containing:
         name → Player name
         difficulty → Difficulty level
         moves → Total moves taken
         time → Formatted time string
         pairs → Total matched pairs
      ; → Ends the statement.
   if (gameHistory.length > 5) { gameHistory.pop(); }
      Ensures history stores only the last 5 games.
      .pop() → Removes the oldest entry.
      ; → Ends the statement.
   renderHistory();
      renderHistory → Updates the history table in the UI.
      ; → Ends the statement.
   setFeedback(`Game complete. Well done, ${state.playerName}.`);
      setFeedback → Updates feedback message area.
      Template literal → Allows embedding player name.
      ; → Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) endGame() is triggered when all pairs are matched.
   2) Timer is stopped using clearInterval().
   3) state.isRunning is set to false to disable further clicks.
   4) A new game result object is created and added to gameHistory.
   5) History is trimmed to the last 5 games.
   6) renderHistory() updates the UI table.
   7) setFeedback() displays a personalised completion message.
--------------------------------------------------
   FINAL SUMMARY
   endGame() → Finalises the game, saves results, and updates UI.
   Inputs → state.playerName, state.difficulty, state.moves, state.secondsElapsed, state.pairsFound.
   Internal steps → stop timer → update state → save history → update UI.
   Outputs → Updated history table + final feedback message.
   Used by → checkForMatch() when all pairs are found.
-------------------------------------------------- */
function endGame() {
  clearInterval(state.timerId);
  state.isRunning = false;

  gameHistory.unshift({
    name: state.playerName,
    difficulty: state.difficulty,
    moves: state.moves,
    time: formatTime(state.secondsElapsed),
    pairs: state.pairsFound
  });

  if (gameHistory.length > 5) {
    gameHistory.pop();
  }

  renderHistory();
  setFeedback(`Game complete. Well done, ${state.playerName}.`);
}

/* --------------------------------------------------
   FUNCTION DECLARATION + HISTORY TABLE RENDERING — renderHistory()
   • renderHistory() → Updates the “Last 5 Games” table in the UI.
   • Purpose → Clear existing rows → loop through gameHistory → insert new rows.
   • Pattern → Clear table → iterate history → build <tr> → append to <tbody>.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF renderHistory():
   function renderHistory() { ... }
      function → Declares a reusable function.
      renderHistory → Developer‑chosen name; updates the history table.
      { } → Function body.
   historyBodyEl.innerHTML = "";
      historyBodyEl → <tbody> element where history rows are displayed.
      .innerHTML = "" → Clears all existing rows before inserting new ones.
      ; → Ends the statement.
   gameHistory.forEach(game => { ... });
      gameHistory → Array storing last 5 completed games.
      .forEach(...) → Loops through each stored game object.
      game → Current game object in the loop.
      => → Arrow function.
      { } → Logic executed for each game.
   const row = document.createElement("tr");
      document.createElement("tr") → Creates a new table row element.
      row → Variable holding the <tr>.
      ; → Ends the statement.
   row.innerHTML = ` ... `;
      .innerHTML → Inserts HTML markup inside the row.
      Template literal → Allows embedding game properties.
      <td>${game.name}</td> → Player name.
      <td>${game.difficulty}</td> → Difficulty level.
      <td>${game.moves}</td> → Total moves.
      <td>${game.time}</td> → Formatted time.
      <td>${game.pairs}</td> → Number of matched pairs.
      ; → Ends the statement.
   historyBodyEl.appendChild(row);
      appendChild → Adds the completed row to the table body.
      row → The <tr> created above.
      ; → Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) renderHistory() is called after endGame().
   2) The table body is cleared to avoid duplicate rows.
   3) gameHistory is looped through (max 5 entries).
   4) For each game:
        → A <tr> is created
        → Game data is inserted into <td> cells
        → The row is appended to the table
   5) The UI updates instantly with the latest results.
--------------------------------------------------
   FINAL SUMMARY
   renderHistory() → Rebuilds the “Last 5 Games” table.
   Inputs → gameHistory array.
   Internal steps → clear table → loop → create rows → append.
   Outputs → Updated history table visible to the player.
   Used by → endGame() after saving a new game result.
-------------------------------------------------- */
function renderHistory() {
  historyBodyEl.innerHTML = "";

  gameHistory.forEach(game => {
    const row = document.createElement("tr");
   row.innerHTML = `
  <td data-label="Player">${game.name}</td>
  <td data-label="Difficulty">${game.difficulty}</td>
  <td data-label="Moves">${game.moves}</td>
  <td data-label="Time">${game.time}</td>
  <td data-label="Pairs">${game.pairs}</td>
`;
    historyBodyEl.appendChild(row);
  });
}


/* --------------------------------------------------
   EVENT LISTENER + GAME INITIALISATION LOGIC — form submit
   • This event listener starts a new game based on user input.
   • Purpose → Validate input, reset game, load difficulty, create deck, update UI, start timer.
   • Pattern → preventDefault → validate → reset → configure → build deck → update state → render → start timer.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   gameForm.addEventListener("submit", e => { ... })
      gameForm → <form> element containing name + difficulty.
      .addEventListener → Registers a listener for a specific event.
      "submit" → Event fired when the form is submitted.
      e → Event object representing the submission.
      => → Arrow function handling the event.
      { } → Function body.
   e.preventDefault();
      preventDefault → Stops the browser from reloading the page.
      Allows full control using JavaScript.
      ; → Ends the statement.
   const name = playerNameEl.value.trim();
      const → Declares a constant variable.
      name → Stores the player's name.
      playerNameEl → Input field for the player's name.
      .value → Reads user input.
      .trim() → Removes leading/trailing spaces.
      ; → Ends the statement.
   const difficulty = difficultyEl.value;
      difficultyEl → <select> element for difficulty.
      .value → The chosen difficulty option.
      ; → Ends the statement.
   if (!name || !difficulty) { ... }
      !name || !difficulty → Guard clause ensuring both fields are filled.
      setFeedback("Please enter your name and select a difficulty.");
         setFeedback → Displays error message.
         ; → Ends the statement.
      return;
         return → Stops execution; prevents game start.
         ; → Ends the statement.
   state.playerName = name;
      Stores validated player name in game state.
      ; → Ends the statement.
   resetGame();
      resetGame → Clears previous game state for a clean start.
      ; → Ends the statement.
   startGame(difficulty);
      startGame → Handles full game setup based on difficulty.
      ; → Ends the statement.
   setFeedback(`Good luck, ${name}.`);
      setFeedback → Displays a friendly start message.
      Template literal → Embeds player name.
      ; → Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) User submits the form.
   2) preventDefault() stops page reload.
   3) Name + difficulty are validated.
   4) If invalid → show error → stop.
   5) If valid:
        → Save player name
        → resetGame() clears previous state
        → startGame() handles:
             - difficulty config
             - deck creation
             - board rendering
             - timer start
             - UI updates
   6) Feedback message confirms game start.
--------------------------------------------------
   FINAL SUMMARY
   Form submit event → Entry point for starting a new game.
   Inputs → player name, difficulty selection.
   Internal steps → validate → reset → configure → build deck → update state → render → start timer.
   Outputs → Fully initialised game ready for play.
   Used by → User interaction (form submission), new game flow.
-------------------------------------------------- */
gameForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = playerNameEl.value.trim();
  const difficulty = difficultyEl.value;

  if (!name || !difficulty) {
    setFeedback("Please enter your name and select a difficulty.");
    return;
  }

  state.playerName = name;
  resetGame();
  startGame(difficulty);
  setFeedback(`Good luck, ${name}.`);
});



/* --------------------------------------------------
   FUNCTION DECLARATION + GAME RESET LOGIC — resetGame()
   • resetGame() → Fully clears all game state and UI elements.
   • Purpose → Stop timer, reset state variables, clear board, refresh UI.
   • Pattern → stop timer → reset state → clear board → update UI.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF resetGame():
   function resetGame() { ... }
      function → Declares a reusable function.
      resetGame → Developer‑chosen name; resets all game data.
      { } → Function body.
   clearInterval(state.timerId);
      clearInterval → Stops the running timer.
      state.timerId → ID created by startTimer().
      ; → Ends the statement.
   state.isRunning = false;
      Disables gameplay; prevents card clicks.
      ; → Ends the statement.
   state.cards = [];
      Clears the deck.
      ; → Ends the statement.
   state.firstPickId = null;
      Removes stored first card selection.
      ; → Ends the statement.
   state.secondPickId = null;
      Removes stored second card selection.
      ; → Ends the statement.
   state.moves = 0;
      Resets move counter.
      ; → Ends the statement.
   state.pairsFound = 0;
      Resets matched pair counter.
      ; → Ends the statement.
   state.secondsElapsed = 0;
      Resets timer value.
      ; → Ends the statement.
   boardEl.innerHTML = "";
      Clears all card elements from the board.
      ; → Ends the statement.
   updateStatus();
      Refreshes UI counters (moves, pairs, time).
      ; → Ends the statement.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF restart button listener:
   restartBtn.addEventListener("click", () => { ... })
      restartBtn → Restart button element.
      .addEventListener → Registers click handler.
      "click" → Event type.
      () => { ... } → Arrow function executed on click.
   if (!difficultyEl.value) return;
      Prevents restart if no difficulty is selected.
      ; → Ends the statement.
   resetGame();
      Clears previous game state.
      ; → Ends the statement.
   startGame(difficultyEl.value);
      Starts a new game using the selected difficulty.
      ; → Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   resetGame()
      1) Stops timer.
      2) Clears all state variables.
      3) Clears board UI.
      4) Resets counters.
      5) Prepares system for a fresh game.
   restart button
      1) Ensures difficulty is selected.
      2) Calls resetGame() to wipe old state.
      3) Calls startGame() to begin a new game immediately.
--------------------------------------------------
   FINAL SUMMARY
   resetGame() → Fully resets game state and UI.
   restart button → Provides quick restart using current difficulty.
   Inputs → None (reset), difficultyEl.value (restart).
   Internal steps → stop timer → clear state → clear board → update UI.
   Outputs → Clean, ready‑to‑start game environment.
   Used by → Form submit, restart button, new game flow.
-------------------------------------------------- */
function resetGame() {
  clearInterval(state.timerId);

  state.isRunning = false;
  state.cards = [];
  state.firstPickId = null;
  state.secondPickId = null;
  state.moves = 0;
  state.pairsFound = 0;
  state.secondsElapsed = 0;

  boardEl.innerHTML = "";
  updateStatus();
}

restartBtn.addEventListener("click", () => {
  if (!difficultyEl.value) return;
  resetGame();
  startGame(difficultyEl.value);
});


/* --------------------------------------------------
   FUNCTION INVOCATIONS + INITIAL UI STATE — updateStatus() & setFeedback()
   • These are function invocation statements — they EXECUTE previously defined functions.
   • Purpose -> Prepare the UI before the game starts.
   • Pattern -> Call expression statements that update counters + show instructions.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENTS:
   updateStatus();
      updateStatus -> Function call; refreshes all UI counters.
      () -> Executes the function immediately.
      ; -> Ends the statement.
      Effects:
         • moves -> Displays 0
         • pairs found -> Displays 0
         • time -> Displays "00:00"
      Ensures the interface shows a clean, neutral state.
   setFeedback("Enter your name and select a difficulty to start.");
      setFeedback -> Function call; updates the feedback message area.
      "Enter your name and select a difficulty to start." -> Instruction shown on page load.
      Guides the player on what to do next.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) Page loads and script runs.
   2) updateStatus() reads default state values:
        -> moves = 0
        -> pairsFound = 0
        -> seconds = 0
      and writes them to the UI.
   3) setFeedback() displays the initial instruction message.
   4) The player sees a clean, ready‑to‑start interface.
--------------------------------------------------
   FINAL SUMMARY
   Initial UI state -> Prepares the screen before gameplay.
   Inputs -> Default state values.
   Internal steps -> update counters → show instructions.
   Outputs -> Clean UI with clear guidance.
   Used by -> Page load, before any game begins.
-------------------------------------------------- */
updateStatus();
setFeedback("Enter your name and select a difficulty to start.");
})();