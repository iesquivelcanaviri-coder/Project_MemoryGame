"use strict";
/* --------------------------------------------------
   DOM (Document Object Model) ELEMENT REFERENCES — CONSTANT ASSIGNMENTS FOR SELECTING HTML ELEMENTS
   • These constants store references to specific HTML elements. 
   • Type -> Constant variable declarations using `const`. 
   • Purpose -> Provide direct access to UI (User Interface) components so the game logic can update text, layout, and interactivity.
   • Pattern -> Standard JavaScript practice: gather all DOM references at the top for clarity, organisation, and reuse.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   const boardEl = document.getElementById("board");
     const -> JavaScript keyword.
            -> Declares a constant variable.
            -> The variable name cannot be reassigned.
            -> The referenced element’s properties CAN still change.
     boardEl -> Developer‑chosen variable name.
            -> “El” means “Element”.
            -> Stores the returned HTML element.
            -> Not taken from HTML — this is your own identifier.
      = -> Assignment operator. Meaning: “Store the value on the right into the variable on the left.”
     document -> Built‑in JavaScript object.
            -> Represents the entire loaded HTML page.
            -> Gives access to the DOM tree.
     . ->Property/method access operator.
            ->  Used here to access the DOM method getElementById.
     getElementById-> DOM method belonging to `document`.
            -> Searches the DOM for an element with a matching id.
            -> Returns the element if found, otherwise null.
     (  -> Opens the method’s argument list.
     "board"  -> JavaScript STRING.
            -> Passed as an argument to getElementById().
            -> Must match exactly the HTML id:
                  <div id="board">
            -> Tells the browser which element to search for.
     )  -> Closes the argument list.
     ;  -> Ends the JavaScript statement.

--------------------------------------------------
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
       3) boardEl -> appendChild(btn)
            -> Inserts each card into the board container.
            -> This is when the card becomes visible to the player.
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
const historyBodyEl = document.getElementById("historyBody");

/* --------------------------------------------------
   CONSTANT OBJECT WITH NESTED SETTINGS — DIFFICULTY
   • DIFFICULTY is a constant object containing three nested objects.
   • Type -> Constant variable declaration using `const`.
   • Purpose -> Store preset board configurations for each difficulty level.
   • Pattern -> Structured data object used as a lookup table for game settings.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   const DIFFICULTY = { ... };
     const  -> JavaScript keyword. Declares a constant variable. The variable name cannot be reassigned.
     DIFFICULTY  -> Developer‑chosen variable name. Represents a collection of difficulty presets. Used throughout the game to determine board size.
     =   -> Assignment operator. “Store the value on the right into the variable on the left.”
     { }  -> Object literal. Contains key–value pairs.
         -> Each key represents a difficulty level.  Each value is another object describing board dimensions.
--------------------------------------------------
   NESTED OBJECTS — KEY–VALUE PAIRS
   easy: { cols: 2, rows: 3 }
      easy   -> Key name representing the “easy” difficulty level.
      :      -> Separates the key from its value.
      { cols: 2, rows: 3 }   -> Nested object storing board layout.
                  -> cols -> Number of columns (2).  rows -> Number of rows (3).
   medium: { cols: 3, rows: 4 }
      medium  -> Key name representing the “medium” difficulty level.
      :         -> Separates key from value.
      { cols: 3, rows: 4 }  -> Nested object storing board layout.
            -> cols -> 3 columns.  rows -> 4 rows.
   hard: { cols: 4, rows: 4 }
      hard   -> Key name representing the “hard” difficulty level.
      :      -> Separates key from value.
      { cols: 4, rows: 4 }
            -> Nested object storing board layout.
            -> cols -> 4 columns.         -> rows -> 4 rows.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) The user selects a difficulty level in the form.
   2) JavaScript reads that value (e.g., "easy", "medium", "hard").
   3) That string is used as a key to access DIFFICULTY[key].
   4) The corresponding nested object is returned:
         DIFFICULTY["easy"] -> { cols: 2, rows: 3 }
   5) The game calculates:
         totalCards -> cols * rows
   6) createDeck(totalCards) uses this number to build the deck.
   7) The board layout is updated using:
         boardEl -> style -> gridTemplateColumns
   8) The game state uses:
         state.totalPairs = totalCards / 2
-------------------------------------------------- */
const DIFFICULTY = {
  easy: { cols: 2, rows: 3 },
  medium: { cols: 3, rows: 4 },
  hard: { cols: 4, rows: 4 }
};


/* --------------------------------------------------
   CONSTANT ARRAY CREATED FROM A STRING — SYMBOLS
   • SYMBOLS is a constant array created by splitting a string of letters.
   • Type -> Constant variable declaration using `const`.
   • Purpose -> Provide a reusable pool of card symbols for deck creation.
   • Pattern -> Convert a string into an array using split("") so each
                character becomes an individual symbol.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
     const    -> JavaScript keyword.
       -> Declares a constant variable.
       -> The variable name cannot be reassigned.
       -> The array contents CAN still be read or used.
     SYMBOLS   -> Developer‑chosen variable name.
       -> Stores the array of card symbols.
       -> Used by createDeck() to generate card values.
     =    -> Assignment operator. Meaning: “Store the value on the right into the variable on the left.”
     "ABCDEFGHJKLMNPQRSTUVWXYZ"    -> JavaScript STRING. Contains all available card symbols.
         -> Each character will become one array element.
     .   -> Property/method access operator.  -> Used here to access the split() method of the string.
     split("")     -> Built‑in string method.  Splits the string into an array.
         -> "" means “split between every character”. eg: "ABC".split("") -> ["A", "B", "C"]
     RESULT  -> SYMBOLS becomes: ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z"]
         -> An array of single‑character strings.
     ;   -> Ends the JavaScript statement.
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
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

/* --------------------------------------------------
   MUTABLE GAME STATE OBJECT — state
   • state is a mutable object that stores all live game data.
   • Type -> Variable declaration using `let` (value CAN change).
   • Purpose -> Track gameplay progress, selections, timer, moves, and deck.
   • Pattern -> Centralised data container used by all game functions.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   let state = { ... };

     let
       -> JavaScript keyword.
       -> Declares a variable whose value CAN be reassigned.
       -> Used here because the state object will be updated during gameplay.

     state
       -> Developer‑chosen variable name.
       -> Stores all dynamic game data.
       -> Accessible by all functions that need to read or update game status.

     =
       -> Assignment operator.
       -> Meaning: “Store the value on the right into the variable on the left.”

     { }
       -> Object literal.
       -> Contains key–value pairs representing different pieces of game data.

     ;
       -> Ends the JavaScript statement.

--------------------------------------------------
   OBJECT PROPERTIES — KEY–VALUE PAIRS

   isRunning: false
       isRunning -> Boolean flag controlling whether gameplay is active.
       :         -> Separates property name from its value.
       false     -> Game is not running initially.

   playerName: ""
       playerName -> Stores the player’s name.
       ""         -> Empty string until user enters a name.

   cards: []
       cards -> Will store all card objects created by createDeck().
       []    -> Empty array placeholder.

   firstPick: null
       firstPick -> Stores the first selected card in a turn.
       null      -> No card selected yet.

   secondPick: null
       secondPick -> Stores the second selected card.
       null       -> No second card selected yet.

   lockBoard: false
       lockBoard -> Prevents clicks during animations or match checks.
       false     -> Board is initially unlocked.

   moves: 0
       moves -> Counts how many turns the player has taken.
       0     -> Starts at zero.

   pairsFound: 0
       pairsFound -> Increases when a matching pair is found.
       0          -> No pairs found at the beginning.

   totalPairs: 0
       totalPairs -> Set at game start based on difficulty (totalCards / 2).
       0          -> Placeholder until difficulty is chosen.

   seconds: 0
       seconds -> Tracks elapsed time.
       0       -> Timer starts at zero.

   timer: null
       timer -> Will store the setInterval() ID.
       null  -> No timer running yet.

--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS

   1) User selects difficulty.
   2) totalCards is calculated from cols * rows.
   3) createDeck(totalCards) fills:
         state.cards
   4) state.totalPairs is set to:
         totalCards / 2
   5) Timer starts:
         startTimer() updates state.seconds every second.
   6) Player interacts with cards:
         onCardClick() updates firstPick, secondPick, moves.
   7) checkMatch() updates:
         pairsFound, lockBoard, and resets picks.
   8) updateStatus() reads:
         moves, pairsFound, seconds
      to update the UI.

--------------------------------------------------
   FINAL SUMMARY
   state    -> Central data object storing everything the game needs.
   let state = { ... }       -> Mutable object whose properties change throughout gameplay.
   state feeds into:   -> renderBoard() (reads cards)
       -> updateStatus() (reads moves, pairsFound, seconds)
       -> checkMatch() (reads firstPick, secondPick)
       -> timer display (reads seconds)
   Functions that feed into state:    -> createDeck() fills cards
       -> difficulty selection sets totalPairs
       -> startTimer() updates seconds
       -> onCardClick() updates picks and moves
       -> checkMatch() updates pairsFound
-------------------------------------------------- */
let state = {
  isRunning: false,
  playerName: "",
  cards: [],
  firstPick: null,
  secondPick: null,
  lockBoard: false,
  moves: 0,
  pairsFound: 0,
  totalPairs: 0,
  seconds: 0,
  timer: null
};

/* --------------------------------------------------
   GAME HISTORY (ARRAY OF OBJECTS)
   • Stores the last 5 completed games.
   • Purpose → Provide data for the “Last 5 Games” history table.
   • Pattern → A mutable array updated after each completed game.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   let gameHistory = [];
      let → Declares a block‑scoped variable.
      gameHistory → Name of the array storing past game objects.
      = [] → Initializes as an empty array literal.
      ; → Ends the statement.
      Each stored entry is an object:
      {
         player: "Irene",
         difficulty: "medium",
         moves: 14,
         time: "01:12",
         pairs: 6
      }
      Behaviour:
         • New results added with push()
         • Oldest removed with shift() when > 5 entries
         • updateHistoryTable() reads this array to update the UI
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) Script loads → gameHistory starts empty.
   2) endGame() creates a result object.
   3) JS pushes the result into gameHistory.
   4) If length > 5 → JS removes the oldest entry.
   5) updateHistoryTable() writes rows into <tbody id="historyBody">.
   6) User sees the last 5 games displayed in the interface.
--------------------------------------------------
   FINAL SUMMARY
   Purpose → Store structured data about past games.
   Inputs → Result objects created at endGame().
   Internal steps → push → trim → update table.
   Outputs → A visible history of the last 5 games.
   Used by → endGame(), updateHistoryTable(), UI history panel.
-------------------------------------------------- */
let gameHistory = []; /* Creates an empty array that will store up to 5 past game results */



/* --------------------------------------------------
   UTILITY FUNCTIONS — SHUFFLING, TIME FORMATTING, FEEDBACK
   • These are function declarations (reusable named blocks of code).
   • shuffle() → Randomizes an array of items.
   • formatTime() → Converts raw seconds into a user‑friendly "mm:ss" string.
   • setFeedback() → Updates the feedback area in the DOM.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF shuffle():
   function shuffle(array) { ... }
      function → JavaScript keyword declaring a reusable function.
      shuffle → Developer‑chosen name; purpose: randomize array order.
      (array) → Parameter representing the array to be shuffled.
      { } → Function body containing the logic.
   for (let i = array.length - 1; i > 0; i--)
      for → Loop structure used to iterate backwards through the array.
      let i → Loop variable; starts at last index.
      array.length - 1 → Ensures loop begins at final element.
      i > 0 → Stops before index 0.
      i-- → Decrements index each iteration.
   const j = Math.floor(Math.random() * (i + 1));
      Math.random() → Generates a number between 0 and 1.
      * (i + 1) → Scales randomness to valid index range.
      Math.floor(...) → Converts to whole number index.
      j → Random index used for swapping.
   [array[i], array[j]] = [array[j], array[i]];
      Array destructuring assignment.
      Swaps the values at positions i and j.
   return array;
      return → Sends the shuffled array back to the caller.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF formatTime():
   function formatTime(seconds) { ... }
      function → Declares a reusable function.
      formatTime → Developer‑chosen name; purpose: convert seconds to "mm:ss".
      (seconds) → Parameter representing elapsed time.
      { } → Function body.
   const m = String(Math.floor(seconds / 60)).padStart(2, "0");
      Math.floor(seconds / 60) → Converts total seconds into whole minutes.
      String(...) → Converts number to string.
      padStart(2, "0") → Ensures 2‑digit formatting (e.g., "3" → "03").
   const s = String(seconds % 60).padStart(2, "0");
      seconds % 60 → Remainder after removing full minutes; produces seconds.
   return `${m}:${s}`;
      Template literal combining minutes + seconds.
      Example output: "04:27".
--------------------------------------------------
   TECHNICAL BREAKDOWN OF setFeedback():
   function setFeedback(msg) { ... }
      function → Declares a reusable function.
      setFeedback → Developer‑chosen name; purpose: update feedback text.
      (msg) → Parameter containing the message to display.
      { } → Function body.
   feedbackEl.textContent = msg;
      feedbackEl → DOM element where feedback messages appear.
      .textContent → Sets the visible text inside the element.
      msg → The string passed into the function.
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
--------------------------------------------------
   FINAL SUMMARY
   shuffle() → Randomizes card order; used in createDeck() and state.cards.
   formatTime() → Converts seconds into readable time; used in updateStatus().
   setFeedback() → Displays messages to the player; used in validation, game start, and endGame().
-------------------------------------------------- */
function shuffle(array) { /* Randomizes the order of items in an array */
  for (let i = array.length - 1; i > 0; i--) { /* Loops backward through array */
    const j = Math.floor(Math.random() * (i + 1)); /* Picks random index for swapping */
    [array[i], array[j]] = [array[j], array[i]]; /* Swaps current element with random element */
  }
  return array; /* Returns the shuffled array */
}

function formatTime(seconds) { /* Converts raw seconds into "mm:ss" format */
  const m = String(Math.floor(seconds / 60)).padStart(2, "0"); /* Calculates minutes and formats as 2 digits */
  const s = String(seconds % 60).padStart(2, "0"); /* Calculates seconds and formats as 2 digits */
  return `${m}:${s}`; /* Returns formatted time string */
}

function setFeedback(msg) { /* Updates the feedback message displayed to the player */
  feedbackEl.textContent = msg; /* Writes message into the feedback DOM element */
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
function buildBoardGrid(cols, rows) { /* Sets the number of columns in the board grid */
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; /* Creates equal-width columns based on difficulty */
}

function renderBoard() { /* Builds the visible game board from state.cards */
  boardEl.innerHTML = ""; /* Clears previous board content */

  state.cards.forEach(card => { /* Loops through each card object in the deck */
    const btn = document.createElement("button"); /* Creates a button element for the card */
    btn.className = "card"; /* Assigns base card styling */
    btn.dataset.id = card.id; /* Stores card ID for tracking */

    const front = document.createElement("div"); /* Creates the front face of the card */
    front.className = "card-inner front"; /* Assigns front face styling */
    front.textContent = card.value; /* Sets the card's visible value */

    const back = document.createElement("div"); /* Creates the back face of the card */
    back.className = "card-inner back"; /* Assigns back face styling */
    back.textContent = "Card"; /* Placeholder text for hidden state */

    btn.append(front, back); /* Inserts both faces into the card button */
    btn.addEventListener("click", onCardClick); /* Attaches click handler for flipping logic */

    boardEl.appendChild(btn); /* Adds the card button to the board */
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
  timeValueEl.textContent = formatTime(state.seconds);
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
function createDeck(totalCards) { /* Builds a full deck of card objects based on difficulty */
  const values = SYMBOLS.slice(0, totalCards / 2); /* Selects the required number of unique symbols */
  let id = 1; /* Counter used to assign unique IDs to each card */
  const deck = values.flatMap(v => ([ /* Creates two card objects for each symbol */
    { id: id++, value: v, matched: false }, /* First copy of the symbol */
    { id: id++, value: v, matched: false }  /* Second copy of the symbol */
  ]));
  return shuffle(deck); /* Randomizes the deck and returns it */
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
function startTimer() { /* Starts the game timer and updates UI every second */
  state.timerId = setInterval(() => { /* Stores interval ID for later stopping */
    state.secondsElapsed++; /* Increments elapsed time */
    updateStatus(); /* Updates timer display in UI */
  }, 1000); /* Runs every 1 second */
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
function startGame(difficultyKey) { /* Initializes a new game based on selected difficulty */
  const config = DIFFICULTTY[difficultyKey]; /* Retrieves grid configuration for difficulty */
  const totalCards = config.cols * config.rows; /* Calculates total number of cards */
  state.difficulty = difficultyKey; /* Saves selected difficulty */
  state.cards = createDeck(totalCards); /* Generates and stores shuffled deck */
  state.totalPairs = totalCards / 2; /* Calculates number of matching pairs */
  state.isRunning = true; /* Marks game as active */
  buildBoardGrid(config.cols, config.rows); /* Configures board grid layout */
  renderBoard(); /* Builds visible card grid */
  updateStatus(); /* Resets UI counters */
  startTimer(); /* Starts the game timer */
  restartBtn.disabled = false; /* Enables restart button */
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
function getCardById(id) { /* Returns the card object with the matching ID */
  return state.cards.find(c => c.id === id); /* Searches state.cards for matching ID */
}

function getCardElementById(id) { /* Returns the DOM element for a card by ID */
  return document.querySelector(`.card[data-id="${id}"]`); /* Selects card element using data-id */
}

function onCardClick(e) { /* Handles card click interactions */
  if (!state.isRunning || state.lockBoard) return; /* Prevents clicks when game inactive or board locked */
  const id = Number(e.currentTarget.dataset.id); /* Reads numeric card ID from clicked element */
  const card = getCardById(id); /* Retrieves card object from state */
  if (card.matched || state.firstPickId === id) return; /* Prevents flipping matched or same card */
  e.currentTarget.classList.add("is-flipped"); /* Visually flips the card */
  if (!state.firstPickId) { /* If this is the first selected card */
    state.firstPickId = id; /* Store first pick */
    return; /* Wait for second pick */
  }
  state.secondPickId = id; /* Store second pick */
  state.moves++; /* Increment move counter */
  updateStatus(); /* Update UI counters */
  checkForMatch(); /* Compare selected cards */
}

function checkForMatch() { /* Determines whether selected cards match */
  const first = getCardById(state.firstPickId); /* Retrieves first selected card */
  const second = getCardById(state.secondPickId); /* Retrieves second selected card */
  if (first.value === second.value) { /* If card values match */
    first.matched = true; /* Mark first card as matched */
    second.matched = true; /* Mark second card as matched */
    state.pairsFound++; /* Increase matched pair count */
    clearPicks(); /* Reset selections */
    if (state.pairsFound === state.totalPairs) { /* If all pairs matched */
      endGame(); /* Trigger end-of-game logic */
    }
  } else { /* If cards do not match */
    state.lockBoard = true; /* Prevent further clicks during animation */
    setTimeout(() => { /* Delay before flipping cards back */
      const firstEl = getCardElementById(state.firstPickId); /* DOM element for first card */
      const secondEl = getCardElementById(state.secondPickId); /* DOM element for second card */
      if (firstEl) firstEl.classList.remove("is-flipped"); /* Flip first card back */
      if (secondEl) secondEl.classList.remove("is-flipped"); /* Flip second card back */
      clearPicks(); /* Reset selections */
      state.lockBoard = false; /* Unlock board */
    }, 600); /* Delay duration */
  }
}

function clearPicks() { /* Resets selected card IDs */
  state.firstPickId = null; /* Clears first pick */
  state.secondPickId = null; /* Clears second pick */
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
function endGame() { /* Finalises the game and updates UI */
  clearInterval(state.timerId); /* Stops the running timer */
  state.isRunning = false; /* Prevents further card interactions */

  gameHistory.unshift({ /* Adds the latest game result to the top of history */
    name: state.playerName, /* Stores player name */
    difficulty: state.difficulty, /* Stores selected difficulty */
    moves: state.moves, /* Stores total moves */
    time: formatTime(state.secondsElapsed), /* Stores formatted time */
    pairs: state.pairsFound /* Stores number of matched pairs */
  });

  if (gameHistory.length > 5) { /* Ensures only last 5 games are kept */
    gameHistory.pop(); /* Removes oldest entry */
  }

  renderHistory(); /* Updates the history table in the UI */
  setFeedback(`Game complete. Well done, ${state.playerName}.`); /* Displays final message */
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
function renderHistory() { /* Updates the Last 5 Games table in the UI */
  historyBodyEl.innerHTML = ""; /* Clears existing table rows */

  gameHistory.forEach(game => { /* Loops through each saved game result */
    const row = document.createElement("tr"); /* Creates a new table row */

    row.innerHTML = ` /* Inserts game data into table cells */
      <td>${game.name}</td>
      <td>${game.difficulty}</td>
      <td>${game.moves}</td>
      <td>${game.time}</td>
      <td>${game.pairs}</td>
    `;

    historyBodyEl.appendChild(row); /* Adds the row to the table body */
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
gameForm.addEventListener("submit", e => { /* Handles form submission to start a new game */
  e.preventDefault(); /* Prevents page reload */

  const name = playerNameEl.value.trim(); /* Reads and trims player name */
  const difficulty = difficultyEl.value; /* Reads selected difficulty */

  if (!name || !difficulty) { /* Validates both fields */
    setFeedback("Please enter your name and select a difficulty."); /* Shows error message */
    return; /* Stops game start */
  }

  state.playerName = name; /* Saves player name into state */
  resetGame(); /* Clears previous game state */
  startGame(difficulty); /* Starts a new game with chosen difficulty */
  setFeedback(`Good luck, ${name}.`); /* Displays start message */
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
function resetGame() { /* Fully resets game state and UI */
  clearInterval(state.timerId); /* Stops the running timer */
  state.isRunning = false; /* Disables gameplay */
  state.cards = []; /* Clears deck */
  state.firstPickId = null; /* Clears first pick */
  state.secondPickId = null; /* Clears second pick */
  state.moves = 0; /* Resets move counter */
  state.pairsFound = 0; /* Resets matched pairs */
  state.secondsElapsed = 0; /* Resets timer */
  boardEl.innerHTML = ""; /* Clears board UI */
  updateStatus(); /* Refreshes UI counters */
}

restartBtn.addEventListener("click", () => { /* Handles restart button click */
  if (!difficultyEl.value) return; /* Prevents restart without difficulty */
  resetGame(); /* Clears previous game state */
  startGame(difficultyEl.value); /* Starts new game with selected difficulty */
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
