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
   UTILITY FUNCTIONS — SHUFFLING, TIME FORMATTING, FEEDBACK
   • These are function declarations (reusable named blocks of code).
   • shuffle() -> Randomizes an array of items.
   • formatTime() -> Converts raw seconds into a user‑friendly "mm:ss" string.
   • setFeedback() -> Updates the feedback area in the DOM.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function shuffle(array) { ... }
      function -> JavaScript keyword. Declares a reusable function.
      shuffle  -> Developer‑chosen function name.  Purpose: Randomize the order of items in an array.
      (array) -> Parameter.  The array that will be shuffled.
      { }    -> Function body containing the logic.
   return array.sort(() => Math.random() - 0.5);
      return  -> Sends a value back to the caller. Here: returns the shuffled array.
      array.sort(...)   -> Built‑in array method. Reorders items based on a comparator function.
      () => Math.random() - 0.5
            -> Arrow function used as the comparator.
            -> Math.random() -> Generates a number between 0 and 1.
            -> Subtracting 0.5 gives positive/negative values.  This randomness produces a shuffled order.
     ;   -> Ends the JavaScript statement.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function formatTime(seconds) { ... }
     function    -> Declares a reusable function.
     formatTime  -> Developer‑chosen name. Purpose: Convert seconds into "mm:ss" format.
     (seconds)  -> Parameter representing elapsed time.
     { }       -> Function body.
   const m = String(Math.floor(seconds / 60)).padStart(2, "0");
      Math.floor(seconds / 60)    -> Converts total seconds into whole minutes.
      String(...)  -> Converts the number into a string.
      .padStart(2, "0")     -> Ensures the string is always 2 characters long. Example: "3" becomes "03".
   const s = String(seconds % 60).padStart(2, "0");
     seconds % 60       -> Remainder after removing full minutes. Produces the seconds part.
   return `${m}:${s}`;   -> Combines minutes + seconds into final time string. Example output: "04:27".
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function setFeedback(message) { ... }
      function       -> Declares a reusable function.
      setFeedback        -> Developer‑chosen name. Purpose: Display a message to the player.
      (message)    -> Parameter containing the text to show.
      { }       -> Function body.
   feedbackEl.textContent = message;
     feedbackEl        -> DOM element where feedback messages appear.
     .textContent       -> Sets the visible text inside the element.
     message       -> The string passed into the function.
     ;       -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   shuffle()
     1) Receives an array of card objects.
     2) Uses sort() with a random comparator.
     3) Returns the array in a randomized order.
     4) createDeck() uses this to shuffle card pairs.
   formatTime()
     1) Receives total elapsed seconds.
     2) Calculates minutes and seconds.
     3) Formats both as two‑digit strings.
     4) Returns a UI‑friendly "mm:ss" value.
     5) updateStatus() uses this to update the timer display.
   setFeedback()
     1) Receives a message string.
     2) Writes it into the feedback DOM element.
     3) Used for errors, instructions, and end‑game messages.
--------------------------------------------------
   FINAL SUMMARY
   shuffle()   -> Randomizes card order. Feeds into createDeck() and state.cards.
   formatTime()  -> Converts seconds into readable time. Feeds into updateStatus() and the UI timer.
   setFeedback()  -> Displays messages to the player. Feeds into form validation, game start, and endGame().
-------------------------------------------------- */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function setFeedback(message) {
  feedbackEl.textContent = message;
}

/* --------------------------------------------------
   FUNCTION DECLARATION + DECK CREATION LOGIC — createDeck(totalCards)
   • createDeck() is a function declaration (reusable named block of code).
   • Purpose -> Build a complete deck of card objects for the game.
   • Pattern -> Slice symbols → duplicate → create objects → shuffle → return.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function createDeck(totalCards) { ... }
      function -> JavaScript keyword; declares a reusable function.
      createDeck -> Developer‑chosen name; builds the full deck.
      (totalCards) -> Parameter; number of cards required for the chosen difficulty.
      { } -> Function body containing all instructions.
   const values = SYMBOLS.slice(0, totalCards / 2);
      const -> Declares a constant variable (cannot be reassigned).
      values -> Array of unique symbols used for this game.
      SYMBOLS -> Master list of all possible card symbols.
      .slice(0, totalCards / 2) -> Extracts only the number of symbols needed.
      ; -> Ends the statement.
   const deck = [];
      deck -> Empty array that will store all card objects.
      [] -> Empty array literal.
      ; -> Ends the statement.
   values.forEach(value => { ... });
      values -> Array of unique symbols.
      .forEach(...) -> Loops through each symbol.
      value -> Current symbol in the loop.
      => -> Arrow function syntax.
      { } -> Function body executed for each symbol.
   deck.push({ value, matched: false });
      deck.push -> Adds a new card object to the deck.
      { value, matched: false } -> Card object; value = symbol; matched = false.
      ; -> Ends the statement.
   deck.push({ value, matched: false });
      Adds the second copy of the same symbol; ensures each symbol appears twice.
      ; -> Ends the statement.
   return shuffle(deck);
      return -> Sends the final deck back to the caller.
      shuffle(deck) -> Randomizes card order.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) totalCards is passed in based on difficulty.
   2) SYMBOLS.slice(...) selects the correct number of unique symbols.
   3) Each symbol is duplicated to form a matching pair.
   4) Card objects are pushed into deck.
   5) shuffle(deck) randomizes the order.
   6) The shuffled deck is returned.
   7) state.cards receives the final deck.
   8) renderBoard() uses state.cards to draw the grid.
--------------------------------------------------
   FINAL SUMMARY
   createDeck(totalCards) -> Builds the full deck for the game.
   Inputs -> totalCards (from difficulty), SYMBOLS (master symbol list).
   Internal steps -> slice symbols → duplicate → create objects → shuffle.
   Outputs -> A fully randomized deck stored in state.cards.
   Used by -> renderBoard() to display cards, checkMatch() to compare values.
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
   FUNCTION DECLARATION + BOARD RENDERING LOGIC — renderBoard()
   • renderBoard() is a function declaration.
   • Purpose -> Build the visible game board by creating card buttons.
   • Pattern -> Clear board → loop cards → create elements → attach listeners → append to DOM.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function renderBoard() { ... }
      function -> JavaScript keyword; declares a reusable function.
      renderBoard -> Developer‑chosen name; builds the visual board.
      { } -> Function body containing all instructions.
   boardEl.innerHTML = "";
      boardEl -> DOM element representing the game board grid.
      .innerHTML -> Property controlling the element’s HTML content.
      = "" -> Clears all previous cards from the board.
      ; -> Ends the statement.
   state.cards.forEach((card, index) => { ... });
      state -> Game state object.
      .cards -> Array of card objects created by createDeck().
      .forEach(...) -> Loops through each card in the deck.
      (card, index) -> card = card object; index = card position.
      => -> Arrow function.
      { } -> Function body executed for each card.
   const btn = document.createElement("button");
      const -> Declares a constant variable.
      btn -> New button element representing a single card.
      document.createElement("button") -> Creates a <button> element in the DOM.
      ; -> Ends the statement.
   btn.className = "card";
      .className -> Sets the CSS class for styling.
      "card" -> Base class used for all card buttons.
      ; -> Ends the statement.
   btn.textContent = "Card";
      .textContent -> Sets visible text inside the button.
      "Card" -> Placeholder text until flipped.
      ; -> Ends the statement.
   btn.dataset.index = index;
      .dataset -> Stores custom data attributes.
      .index -> Custom attribute used to track card position.
      index -> The card’s index in state.cards.
      ; -> Ends the statement.
   btn.addEventListener("click", () => onCardClick(btn, index));
      addEventListener -> Attaches an event listener.
      "click" -> Event type.
      () => onCardClick(btn, index) -> Arrow function calling your click handler.
      ; -> Ends the statement.
   boardEl.appendChild(btn);
      appendChild -> Adds the button to the game board.
      btn -> The card button created above.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) The board is cleared so old cards disappear.
   2) state.cards is looped through; each card triggers creation of a button.
   3) Each button receives:
        -> className for styling
        -> placeholder text
        -> dataset.index for tracking
        -> click listener calling onCardClick()
   4) Each button is appended to boardEl.
   5) The player sees a fresh grid of clickable cards.
--------------------------------------------------
   FINAL SUMMARY
   renderBoard() -> Builds the visible board from state.cards.
   Inputs -> state.cards (full deck), boardEl (DOM container).
   Internal steps -> clear board → loop cards → create buttons → attach listeners → append.
   Outputs -> Fully rendered grid of interactive card buttons.
   Used by -> resetGame(), startGame(), difficulty changes, and any time the board must refresh.
-------------------------------------------------- */
function renderBoard() {
  boardEl.innerHTML = "";
  state.cards.forEach((card, index) => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "Card";
    btn.dataset.index = index;
    btn.addEventListener("click", () => onCardClick(btn, index));
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
  timeValueEl.textContent = formatTime(state.seconds);
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
   FUNCTION DECLARATION + CLICK LOGIC — onCardClick(element, index)
   • onCardClick() is a function declaration.
   • Purpose -> Handle card flipping, validation, state updates, and match checks.
   • Pattern -> Guard clauses → flip card → store pick → update → check match.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function onCardClick(element, index) { ... }
      function -> JavaScript keyword; declares a reusable function.
      onCardClick -> Developer‑chosen name; handles card flipping logic.
      (element, index) -> Parameters; element = clicked button, index = card position.
      { } -> Function body containing all instructions.
   if (!state.isRunning) return;
      state -> Game state object.
      .isRunning -> Boolean controlling whether gameplay is active.
      !state.isRunning -> True when game has not started.
      return -> Exits the function immediately.
      ; -> Ends the statement.
   if (state.lockBoard) return;
      state.lockBoard -> Prevents clicks during mismatch animation.
      return -> Stops further processing.
      ; -> Ends the statement.
   const card = state.cards[index];
      const -> Declares a constant variable.
      card -> The card object at the clicked index.
      state.cards -> Array of all card objects.
      [index] -> Retrieves the specific card.
      ; -> Ends the statement.
   if (card.matched) return;
      card.matched -> True if card already matched.
      return -> Prevents flipping matched cards.
      ; -> Ends the statement.
   if (state.firstPick && state.firstPick.index === index) return;
      state.firstPick -> First selected card.
      .index -> Position of that card.
      Prevents clicking the same card twice.
      return -> Exits function.
      ; -> Ends the statement.
   element.textContent = card.value;
      element -> The button representing the card.
      .textContent -> Sets visible text inside the button.
      card.value -> Symbol stored in the card object.
      ; -> Ends the statement.
   element.classList.add("is-flipped");
      .classList -> List of CSS classes on the element.
      .add("is-flipped") -> Applies flipped styling.
      ; -> Ends the statement.
   if (!state.firstPick) {
      !state.firstPick -> True when no card has been selected yet.
      { } -> First‑pick logic block.
      state.firstPick = { element, index, card };
         Stores the first selected card’s element, index, and data object.
         ; -> Ends the statement.
      return;
         return -> Ends function; waits for second card.
         ; -> Ends the statement.
   }
   state.secondPick = { element, index, card };
      Stores the second selected card.
      ; -> Ends the statement.
   state.moves++;
      state.moves -> Move counter.
      ++ -> Increment operator; adds 1 move.
      ; -> Ends the statement.
   updateStatus();
      updateStatus -> Refreshes UI (moves, pairs, time).
      ; -> Ends the statement.
   checkMatch();
      checkMatch -> Compares firstPick and secondPick.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) Player clicks a card.
   2) Guard clauses ensure:
        -> Game is running
        -> Board is not locked
        -> Card is not matched
        -> Card is not the same as firstPick
   3) Card is flipped visually (text + class).
   4) If no firstPick:
        -> Store firstPick and exit.
   5) If secondPick:
        -> Store secondPick
        -> Increment moves
        -> updateStatus()
        -> checkMatch()
   6) Game continues based on match or mismatch.
--------------------------------------------------
   FINAL SUMMARY
   onCardClick(element, index) -> Handles all card‑click interactions.
   Inputs -> element (button), index (card position), state.cards.
   Internal steps -> validate → flip → store pick → update → check match.
   Outputs -> Updated UI, updated state, triggers match logic.
   Used by -> renderBoard() (event listeners), checkMatch(), updateStatus().
-------------------------------------------------- */
function onCardClick(element, index) {
  if (!state.isRunning) return;
  if (state.lockBoard) return;
  const card = state.cards[index];
  if (card.matched) return;
  if (state.firstPick && state.firstPick.index === index) return;
  element.textContent = card.value;
  element.classList.add("is-flipped");
  if (!state.firstPick) {
    state.firstPick = { element, index, card };
    return;
  }
  state.secondPick = { element, index, card };
  state.moves++;
  updateStatus();
  checkMatch();
}


/* --------------------------------------------------
   FUNCTION DECLARATION + MATCH CHECKING LOGIC — checkMatch()
   • checkMatch() is a function declaration.
   • Purpose -> Compare the two selected cards and handle match/mismatch.
   • Pattern -> Read picks → compare → update state → animate mismatch → reset.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function checkMatch() { ... }
      function -> JavaScript keyword; declares a reusable function.
      checkMatch -> Developer‑chosen name; evaluates card matches.
      { } -> Function body containing all instructions.
   const first = state.firstPick;
   const second = state.secondPick;
      const -> Declares read‑only variables.
      first / second -> Objects storing element, index, and card data.
      state.firstPick / state.secondPick -> Values set in onCardClick().
      ; -> Ends the statements.
   if (!first || !second) return;
      !first || !second -> Guard clause; ensures both picks exist.
      return -> Stops execution early if picks are missing.
      ; -> Ends the statement.
   if (first.card.value === second.card.value) {
      first.card.value === second.card.value -> Compares card symbols; true means match.
      { } -> Match‑handling block.
      first.card.matched = true;
         Marks first card as permanently matched.
         ; -> Ends the statement.
      second.card.matched = true;
         Marks second card as permanently matched.
         ; -> Ends the statement.
      first.element.classList.add("is-matched");
         Adds matched styling to first card button.
         ; -> Ends the statement.
      second.element.classList.add("is-matched");
         Adds matched styling to second card button.
         ; -> Ends the statement.
      state.pairsFound++;
         Increments number of matched pairs.
         ; -> Ends the statement.
      updateStatus();
         Refreshes UI (pairs, moves, time).
         ; -> Ends the statement.
      resetPicks();
         Clears firstPick and secondPick for next turn.
         ; -> Ends the statement.
      if (state.pairsFound === state.totalPairs) {
         state.pairsFound === state.totalPairs -> Checks if all pairs are matched.
         { } -> End‑game block.
         endGame();
            endGame -> Handles game completion.
            ; -> Ends the statement.
      }
      return;
         Ends function after handling match.
         ; -> Ends the statement.
   }
   state.lockBoard = true;
      No match -> Temporarily disable clicking.
      Prevents flipping more cards during animation.
      ; -> Ends the statement.
   setTimeout(() => {
      setTimeout -> Delays execution for mismatch animation.
      () => { } -> Arrow function executed after delay.
      600 -> Delay in milliseconds (0.6 seconds).
      first.element.textContent = "Card";
         Resets first card text to placeholder.
         ; -> Ends the statement.
      second.element.textContent = "Card";
         Resets second card text to placeholder.
         ; -> Ends the statement.
      first.element.classList.remove("is-flipped");
         Removes flipped styling from first card.
         ; -> Ends the statement.
      second.element.classList.remove("is-flipped");
         Removes flipped styling from second card.
         ; -> Ends the statement.
      resetPicks();
         Clears stored selections.
         ; -> Ends the statement.
      state.lockBoard = false;
         Re‑enables clicking after animation.
         ; -> Ends the statement.
   }, 600);
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) checkMatch() runs after two cards are selected.
   2) If either pick is missing → exit.
   3) If values match:
        -> Mark both cards as matched
        -> Add matched styling
        -> Increase pairsFound
        -> updateStatus()
        -> resetPicks()
        -> If all pairs found → endGame()
   4) If values do NOT match:
        -> lockBoard = true
        -> Wait 600ms
        -> Flip cards back visually
        -> resetPicks()
        -> lockBoard = false
--------------------------------------------------
   FINAL SUMMARY
   checkMatch() -> Compares selected cards and handles match/mismatch.
   Inputs -> state.firstPick, state.secondPick, state.cards.
   Internal steps -> compare → match or mismatch → update → animate → reset.
   Outputs -> Updated UI, updated state, possible endGame() trigger.
   Used by -> onCardClick(), updateStatus(), resetPicks().
-------------------------------------------------- */
function checkMatch() {
  const first = state.firstPick;
  const second = state.secondPick;
  if (!first || !second) return;
  if (first.card.value === second.card.value) {
    first.card.matched = true;
    second.card.matched = true;
    first.element.classList.add("is-matched");
    second.element.classList.add("is-matched");
    state.pairsFound++;
    updateStatus();
    resetPicks();
    if (state.pairsFound === state.totalPairs) {
      endGame();
    }
    return;
  }
  state.lockBoard = true;
  setTimeout(() => {
    first.element.textContent = "Card";
    second.element.textContent = "Card";
    first.element.classList.remove("is-flipped");
    second.element.classList.remove("is-flipped");
    resetPicks();
    state.lockBoard = false;
  }, 600);
}

function resetPicks() {
  state.firstPick = null;
  state.secondPick = null;
}

/* --------------------------------------------------
   FUNCTION DECLARATION + INTERNAL ACTIONS — endGame()
   • endGame() is a function declaration.
   • Purpose -> Stop the game, stop the timer, and display final results.
   • Pattern -> Update state → stop timer → update UI with final message.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function endGame() { ... }
      function -> JavaScript keyword; declares a reusable function.
      endGame -> Developer‑chosen name; handles game completion.
      { } -> Function body containing all instructions.
   state.isRunning = false;
      state.isRunning -> Boolean controlling whether gameplay is active.
      = false -> Marks the game as no longer running.
      ; -> Ends the statement.
   stopTimer();
      stopTimer -> Function call; stops the running timer.
      () -> Executes the function immediately.
      ; -> Ends the statement.
   setFeedback(`Well done, ${state.playerName}! You finished in ${state.moves} moves and ${formatTime(state.seconds)}.`);
      setFeedback -> Function call; updates the UI with a message.
      `...` -> Template literal; allows embedding variables.
      ${state.playerName} -> Inserts player's name.
      ${state.moves} -> Inserts total number of moves.
      ${formatTime(state.seconds)} -> Inserts formatted time.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) endGame() is triggered when all pairs are matched.
   2) state.isRunning is set to false so no further clicks are processed.
   3) stopTimer() freezes the timer at the final time.
   4) setFeedback() displays a personalised completion message:
        -> player name
        -> total moves
        -> formatted time
   5) The UI clearly communicates that the game is finished.
--------------------------------------------------
   FINAL SUMMARY
   endGame() -> Cleanly finishes the game and updates the UI.
   Inputs -> state.playerName, state.moves, state.seconds.
   Internal steps -> stop gameplay → stop timer → show final message.
   Outputs -> Final feedback message displayed to the player.
   Used by -> checkMatch() when all pairs are found.
-------------------------------------------------- */
function endGame() {
  state.isRunning = false;
  stopTimer();
  setFeedback(
    `Well done, ${state.playerName}! You finished in ${state.moves} moves and ${formatTime(state.seconds)}.`
  );
}

/* --------------------------------------------------
   FUNCTION DECLARATION + INTERNAL ACTIONS — resetGame()
   • resetGame() is a function declaration.
   • Purpose -> Return the entire game to its initial state.
   • Pattern -> Stop timer → reset state → clear UI → update status.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   function resetGame() { ... }
      function -> JavaScript keyword; declares a reusable function.
      resetGame -> Developer‑chosen name; resets the entire game.
      { } -> Function body containing all instructions.
   stopTimer();
      stopTimer -> Halts the active timer interval.
      Ensures no time continues counting during reset.
      ; -> Ends the statement.
   state.isRunning = false;
      state.isRunning -> Controls whether gameplay is active.
      = false -> Game is not currently running.
      ; -> Ends the statement.
   state.lockBoard = false;
      state.lockBoard -> Prevents clicks during animations.
      = false -> Re‑enables clicking for the next game.
      ; -> Ends the statement.
   state.cards = [];
      state.cards -> Array storing all card objects.
      = [] -> Clears the deck completely.
      ; -> Ends the statement.
   state.firstPick = null;
      state.firstPick -> First selected card.
      = null -> No card selected.
      ; -> Ends the statement.
   state.secondPick = null;
      state.secondPick -> Second selected card.
      = null -> Clears second selection.
      ; -> Ends the statement.
   state.moves = 0;
      state.moves -> Move counter.
      = 0 -> Reset to zero.
      ; -> Ends the statement.
   state.pairsFound = 0;
      state.pairsFound -> Number of matched pairs.
      = 0 -> Reset to zero.
      ; -> Ends the statement.
   state.totalPairs = 0;
      state.totalPairs -> Set later based on difficulty.
      = 0 -> Placeholder until new game starts.
      ; -> Ends the statement.
   state.seconds = 0;
      state.seconds -> Timer value.
      = 0 -> Timer resets to zero.
      ; -> Ends the statement.
   boardEl.innerHTML = "";
      boardEl -> DOM element for the game board.
      .innerHTML = "" -> Removes all card buttons from the UI.
      ; -> Ends the statement.
   updateStatus();
      updateStatus -> Refreshes UI elements (moves, pairs, time).
      Ensures the screen shows a clean reset state.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) resetGame() is called before starting a new game.
   2) stopTimer() ensures no leftover timer continues running.
   3) All state values are reset to their initial defaults.
   4) The board UI is cleared so no old cards remain.
   5) updateStatus() refreshes the counters and timer display.
   6) The game is now ready for a fresh start.
--------------------------------------------------
   FINAL SUMMARY
   resetGame() -> Fully resets the game state and UI.
   Inputs -> None; uses global state and DOM elements.
   Internal steps -> stop timer → reset state → clear board → update UI.
   Outputs -> Clean, ready‑to‑start game environment.
   Used by -> form submit, difficulty changes, new game start.
-------------------------------------------------- */
function resetGame() {
  stopTimer();
  state.isRunning = false;
  state.lockBoard = false;
  state.cards = [];
  state.firstPick = null;
  state.secondPick = null;
  state.moves = 0;
  state.pairsFound = 0;
  state.totalPairs = 0;
  state.seconds = 0;
  boardEl.innerHTML = "";
  updateStatus();
}


/* --------------------------------------------------
   EVENT LISTENER + GAME INITIALISATION LOGIC — form submit
   • This event listener starts a new game based on user input.
   • Purpose -> Validate input, reset game, load difficulty, create deck, update UI, start timer.
   • Pattern -> preventDefault → validate → load config → reset → build deck → update state → render → start timer.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   gameForm.addEventListener("submit", e => { ... })
      gameForm -> DOM <form> element containing name + difficulty.
      .addEventListener -> Listens for a specific event.
      "submit" -> Event type triggered when form is submitted.
      e -> Event object representing the submission.
      => -> Arrow function handling the event.
      { } -> Function body containing all instructions.
   e.preventDefault();
      preventDefault -> Stops the form from reloading the page.
      Allows full control using JavaScript.
      ; -> Ends the statement.
   const name = playerNameEl.value.trim();
      const -> Declares a constant variable.
      name -> Stores the player's name.
      playerNameEl -> Input field for the player's name.
      .value -> Gets the text typed by the user.
      .trim() -> Removes extra spaces.
      ; -> Ends the statement.
   const difficulty = difficultyEl.value;
      difficultyEl -> <select> element for difficulty.
      .value -> The chosen difficulty option.
      ; -> Ends the statement.
   if (!name || !difficulty) {
      !name || !difficulty -> Guard clause; ensures both fields are filled.
      { } -> Error‑handling block.
      setFeedback("Please enter your name and select a difficulty.");
         setFeedback -> Displays error message to the player.
         ; -> Ends the statement.
      return;
         return -> Stops execution; prevents game start.
         ; -> Ends the statement.
   }
   state.playerName = name;
      state.playerName -> Stores player's name in game state.
      = name -> Saves validated input.
      ; -> Ends the statement.
   const config = DIFFICULTY[difficulty];
      DIFFICULTY -> Object storing rows/cols for each difficulty.
      [difficulty] -> Accesses chosen difficulty settings.
      config -> Contains { cols, rows }.
      ; -> Ends the statement.
   const totalCards = config.cols * config.rows;
      config.cols * config.rows -> Calculates total number of cards.
      totalCards -> Used to build the deck.
      ; -> Ends the statement.
   resetGame();
      resetGame -> Clears previous game state for a clean start.
      ; -> Ends the statement.
   state.cards = createDeck(totalCards);
      createDeck -> Generates + shuffles card objects.
      state.cards -> Stores the full deck.
      ; -> Ends the statement.
   state.totalPairs = totalCards / 2;
      totalCards / 2 -> Number of matching pairs.
      state.totalPairs -> Stored in game state.
      ; -> Ends the statement.
   state.isRunning = true;
      state.isRunning -> Enables gameplay.
      = true -> Allows card clicks to be processed.
      ; -> Ends the statement.
   boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
      boardEl -> DOM element for the game board.
      .style.gridTemplateColumns -> Sets number of columns.
      `repeat(${config.cols}, 1fr)` -> Makes board layout match difficulty.
      ; -> Ends the statement.
   renderBoard();
      renderBoard -> Dynamically creates card buttons on the screen.
      ; -> Ends the statement.
   updateStatus();
      updateStatus -> Refreshes UI counters (moves, pairs, time).
      ; -> Ends the statement.
   startTimer();
      startTimer -> Begins the game clock.
      ; -> Ends the statement.
   restartBtn.disabled = false;
      restartBtn -> Restart button element.
      .disabled = false -> Enables restart button once game begins.
      ; -> Ends the statement.
   setFeedback(`Game started! Good luck, ${name}.`);
      setFeedback -> Displays a friendly start message.
      `...` -> Template literal including player's name.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) User submits the form.
   2) preventDefault() stops page reload.
   3) Name + difficulty are validated.
   4) Difficulty config is loaded from DIFFICULTY.
   5) totalCards is calculated.
   6) resetGame() clears all previous state.
   7) createDeck(totalCards) builds a new shuffled deck.
   8) State is updated with:
        -> playerName
        -> cards
        -> totalPairs
        -> isRunning = true
   9) Board layout is set based on difficulty.
   10) renderBoard() draws the cards.
   11) updateStatus() refreshes UI counters.
   12) startTimer() begins the clock.
   13) Restart button is enabled.
   14) Feedback message confirms game start.
--------------------------------------------------
   FINAL SUMMARY
   Form submit event -> Entry point for starting a new game.
   Inputs -> player name, difficulty selection.
   Internal steps -> validate → reset → configure → build deck → update state → render → start timer.
   Outputs -> Fully initialised game ready for play.
   Used by -> User interaction (form submission), new game flow.
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
  const config = DIFFICULTY[difficulty];
  const totalCards = config.cols * config.rows;
  resetGame();
  state.cards = createDeck(totalCards);
  state.totalPairs = totalCards / 2;
  state.isRunning = true;
  boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
  renderBoard();
  updateStatus();
  startTimer();
  restartBtn.disabled = false;
  setFeedback(`Game started! Good luck, ${name}.`);
});


/* --------------------------------------------------
   EVENT LISTENER + GAME RESTART LOGIC — restart button
   • This event listener restarts the game using the current name + difficulty.
   • Purpose -> Validate input, reset game, rebuild deck, update UI, restart timer.
   • Pattern -> validate → load config → reset → build deck → update state → render → start timer.
--------------------------------------------------
   TECHNICAL BREAKDOWN OF THE STATEMENT:
   restartBtn.addEventListener("click", () => { ... })
      restartBtn -> DOM button element for restarting the game.
      .addEventListener -> Listens for a specific event.
      "click" -> Event type triggered when the button is pressed.
      () => { } -> Anonymous arrow function handling the event.
   const name = playerNameEl.value.trim();
      const -> Declares a constant variable.
      name -> Stores the player's name.
      playerNameEl -> Input field for the player's name.
      .value -> Gets the text typed by the user.
      .trim() -> Removes extra spaces.
      ; -> Ends the statement.
   const difficulty = difficultyEl.value;
      difficultyEl -> <select> element for difficulty.
      .value -> The chosen difficulty option.
      ; -> Ends the statement.
   if (!name || !difficulty) {
      !name || !difficulty -> Guard clause; ensures both fields are filled.
      { } -> Error‑handling block.
      setFeedback("Please enter your name and select a difficulty.");
         setFeedback -> Displays error message to the player.
         ; -> Ends the statement.
      return;
         return -> Stops execution; prevents restart.
         ; -> Ends the statement.
   }
   state.playerName = name;
      state.playerName -> Stores player's name in game state.
      = name -> Saves validated input.
      ; -> Ends the statement.
   const config = DIFFICULTY[difficulty];
      DIFFICULTY -> Object storing rows/cols for each difficulty.
      [difficulty] -> Accesses chosen difficulty settings.
      config -> Contains { cols, rows }.
      ; -> Ends the statement.
   const totalCards = config.cols * config.rows;
      config.cols * config.rows -> Calculates total number of cards.
      totalCards -> Used to build the deck.
      ; -> Ends the statement.
   resetGame();
      resetGame -> Clears previous game state for a clean restart.
      ; -> Ends the statement.
   state.cards = createDeck(totalCards);
      createDeck -> Generates + shuffles card objects.
      state.cards -> Stores the full deck.
      ; -> Ends the statement.
   state.totalPairs = totalCards / 2;
      totalCards / 2 -> Number of matching pairs.
      state.totalPairs -> Stored in game state.
      ; -> Ends the statement.
   state.isRunning = true;
      state.isRunning -> Enables gameplay.
      = true -> Allows card clicks to be processed.
      ; -> Ends the statement.
   boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
      boardEl -> DOM element for the game board.
      .style.gridTemplateColumns -> Sets number of columns.
      `repeat(${config.cols}, 1fr)` -> Makes board layout match difficulty.
      ; -> Ends the statement.
   renderBoard();
      renderBoard -> Dynamically creates card buttons on the screen.
      ; -> Ends the statement.
   updateStatus();
      updateStatus -> Refreshes UI counters (moves, pairs, time).
      ; -> Ends the statement.
   startTimer();
      startTimer -> Begins the game clock.
      ; -> Ends the statement.
   setFeedback(`Restarted! Good luck, ${name}.`);
      setFeedback -> Displays a friendly restart message.
      `...` -> Template literal including player's name.
      ; -> Ends the statement.
--------------------------------------------------
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
   1) Player clicks the restart button.
   2) Name + difficulty are validated.
   3) Difficulty config is loaded from DIFFICULTY.
   4) totalCards is calculated.
   5) resetGame() clears all previous state.
   6) createDeck(totalCards) builds a new shuffled deck.
   7) State is updated with:
        -> playerName
        -> cards
        -> totalPairs
        -> isRunning = true
   8) Board layout is set based on difficulty.
   9) renderBoard() draws the cards.
   10) updateStatus() refreshes UI counters.
   11) startTimer() begins the clock.
   12) Feedback message confirms restart.
--------------------------------------------------
   FINAL SUMMARY
   Restart button event -> Reinitialises the game using current settings.
   Inputs -> player name, difficulty selection.
   Internal steps -> validate → reset → configure → build deck → update state → render → start timer.
   Outputs -> Fully restarted game ready for play.
   Used by -> Player interaction (restart button).
-------------------------------------------------- */
restartBtn.addEventListener("click", () => {
  const name = playerNameEl.value.trim();
  const difficulty = difficultyEl.value;
  if (!name || !difficulty) {
    setFeedback("Please enter your name and select a difficulty.");
    return;
  }
  state.playerName = name;
  const config = DIFFICULTY[difficulty];
  const totalCards = config.cols * config.rows;
  resetGame();
  state.cards = createDeck(totalCards);
  state.totalPairs = totalCards / 2;
  state.isRunning = true;
  boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
  renderBoard();
  updateStatus();
  startTimer();
  setFeedback(`Restarted! Good luck, ${name}.`);
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
