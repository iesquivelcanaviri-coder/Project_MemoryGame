(function () { "use strict";
/* --------------------------------------------------
   DOM (Document Object Model) ELEMENT REFERENCES — CONSTANT ASSIGNMENTS FOR SELECTING HTML ELEMENTS
   • These constants store references to specific HTML elements. 
   • Type -> Constant variable declarations using `const`. 
   • Purpose -> Provide direct access to UI (User Interface) components so the game logic can update text, layout, and interactivity.
   • Pattern -> Standard JavaScript practice: gather all DOM references at the top for clarity, organisation, and reuse.
-------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS
1) The browser loads your HTML and builds the DOM tree → this is where id="board" becomes an identifiable HTML element the JavaScript can later retrieve.
2) JavaScript executes document.getElementById("board") → "board" is the STRING used to look up the element with id="board".
3) The browser searches the DOM for <div id="board">...</div> → this matches the HTML identifier id="board" used to locate the correct element.
4) If found, the method RETURNS that HTML element → this returned element is the actual DOM node that will be stored in boardEl.
5) The assignment operator (=) stores the returned element in boardEl → boardEl becomes your JavaScript variable holding the DOM element.
6) boardEl now becomes a REFERENCE to the real HTML element → this reference lets you modify the board visually (innerHTML, styles, children), acting as the bridge between game logic and UI.
     → Example in renderBoard():
         - boardEl.innerHTML = "" clears the board before drawing new cards.
         - JavaScript creates button elements for each card.
         - boardEl.appendChild(btn) inserts each card into the board so it becomes visible to the player.
-------------------------------------------------- */
const boardEl = document.getElementById("board");
/*const -> JavaScript keyword. Declares a constant variable.  -> The variable name cannot be reassigned. The referenced element’s properties CAN still change.
boardEl -> Developer‑chosen variable name. “El” means “Element”. Stores the returned HTML element. -> Not taken from HTML — this is your own identifier.
= -> Assignment operator. Meaning: “Store the value on the right into the variable on the left.”
document -> Built‑in JavaScript object. Represents the entire loaded HTML page. Gives access to the DOM tree.
. ->Property/method access operator. Used here to access the DOM method getElementById.
getElementById-> DOM method belonging to `document`. Searches the DOM for an element with a matching id.  -> Returns the element if found, otherwise null.
(  -> Opens the method’s argument list.
"board"  -> JavaScript STRING.  Passed as an argument to getElementById().  -> Must match exactly the HTML id:  <div id="board">     -> Tells the browser which element to search for.
)  -> Closes the argument list. */
const gameForm = document.getElementById("gameForm");
const playerNameEl = document.getElementById("playerName");
const difficultyEl = document.getElementById("difficulty"); 
const restartBtn = document.getElementById("restartBtn"); 
const feedbackEl = document.getElementById("formFeedback"); 


const movesValueEl = document.getElementById("movesValue");
const timeValueEl = document.getElementById("timeValue");
const pairsValueEl = document.getElementById("pairsValue");
const gameStatusEl = document.getElementById("gameStatus");

const historyBodyEl = document.getElementById("historyBody");

/* --------------------------------------------------
   CONSTANT OBJECT WITH NESTED SETTINGS — DIFFICULTY
--------------------------------------------------
  LOGIC — WHAT ACTUALLY HAPPENS
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
--------------------------------------------------
  LOGIC — WHAT ACTUALLY HAPPENS
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
  RESULT  -> SYMBOLS becomes: ["A","B","C",...] -> An array of single‑character strings. */ 

/* --------------------------------------------------
MUTABLE GAME STATE OBJECT — state
   • state is a mutable object that stores all live game data.
   • Type -> Variable declaration using `let` (value CAN change).
   • Purpose -> Track gameplay progress, selections, timer, moves, and deck.
   • Pattern -> Centralised data container used by all game functions.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS
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
LOGIC — WHAT ACTUALLY HAPPENS
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
  • These are function declarations (reusable named blocks of code) → each one performs a specific utility task used throughout the game.
  • shuffle() → randomizes an array of items → used by createDeck() to shuffle card pairs before rendering.
  • formatTime() → converts raw seconds into a user‑friendly "mm:ss" string → used by updateStatus() to update the timer display.
  • setFeedback() → updates the feedback area in the DOM → displays messages to the player during validation, game start, and endGame().
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS (WITH FINAL SUMMARY MERGED INTO EACH LINE)
shuffle()
1) Receives an array of card objects → this is the deck produced by createDeck().
2) Iterates backward through the array → standard Fisher‑Yates shuffle pattern.
3) Swaps each element with a random index → ensures every card has an equal chance of any position.
4) Returns the randomized array → this shuffled deck is what the player sees on the board.
5) Used by createDeck() to shuffle card pairs → ensures each new game has a unique card order.
formatTime()
1) Receives total elapsed seconds → the value comes from state.secondsElapsed.
2) Calculates minutes and seconds → converts raw time into readable units.
3) Formats both as two‑digit strings → ensures consistent "mm:ss" formatting.
4) Returns a UI‑friendly "mm:ss" value → this is the exact string shown in the timer.
5) Used by updateStatus() to update the timer display → keeps the visible timer synced with the internal state.
setFeedback()
1) Receives a message string → text describing instructions, errors, or game results.
2) Writes it into the feedback DOM element → feedbackEl.textContent = msg updates the UI.
3) Used for validation errors, instructions, and end‑game messages → communicates game state and guidance to the player.
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
• buildBoardGrid() and renderBoard() are function declarations → reusable named blocks of code used to construct the game board.
• buildBoardGrid() → sets the CSS grid layout based on difficulty.
• renderBoard() → creates the visible card elements and inserts them into the DOM.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS (WITH FINAL SUMMARY MERGED INTO EACH LINE)
buildBoardGrid()
1) Receives number of columns and rows → inputs: cols and rows come from the selected difficulty, which determines board size.
2) Updates CSS grid layout using gridTemplateColumns → internal step: writes layout directly into boardEl.style to shape the grid.
3) Ensures board visually matches difficulty level → output: correct grid structure on screen; used by startGame(), resetGame(), and difficulty changes.
renderBoard()
1) Clears old board content using innerHTML = "" → internal step: resets the DOM before drawing new cards so no old cards remain.
2) Loops through state.cards → input: card objects stored in state, created earlier by createDeck().
3) Creates a button element for each card → internal step: builds an interactive card container that can be clicked.
4) Builds front + back faces as <div> elements → internal step: constructs the visible card structure (front shows symbol, back shows default text).
5) Attaches click listener for flipping via onCardClick → internal step: enables interaction so the player can flip cards.
6) Appends each card to boardEl → output: the fully built card appears on screen inside the board grid.
7) Player sees a fresh, interactive grid → final summary: renderBoard() builds the full playable board; used by startGame(), resetGame(), and difficulty changes to visually update the UI.
-------------------------------------------------- */
function buildBoardGrid(cols, rows) { /* function -> declares reusable code; buildBoardGrid -> function name; (cols, rows) -> parameters receiving number of columns and rows; { } -> function body */
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; /* boardEl -> DOM element for the game board; .style -> access CSS properties; .gridTemplateColumns -> sets number of grid columns; = -> assign new CSS value; `repeat(${cols}, 1fr)` -> template literal creating N equal-width columns; ${cols} -> inserts column count; 1fr -> each column takes equal space */
}

function renderBoard() { /* function -> declares reusable code; renderBoard -> builds the visible card grid; { } -> function body */
  boardEl.innerHTML = ""; /* boardEl -> board container; .innerHTML -> sets HTML content; = "" -> clears previous cards before drawing new ones */

  state.cards.forEach(card => { /* state.cards -> array of card objects; .forEach -> loop through each card; card => { } -> arrow function receiving each card object */
    const btn = document.createElement("button"); /* const -> constant variable; btn -> new button element; document.createElement("button") -> creates a <button> in memory */
    btn.className = "card"; /* .className -> assigns CSS class; "card" -> styling for all card buttons */
    btn.dataset.id = card.id; /* .dataset.id -> custom data attribute; stores card's unique ID; card.id -> ID from deck */

    const front = document.createElement("div"); /* front -> div for card front face; createElement("div") -> creates <div> */
    front.className = "card-inner front"; /* .className -> assigns CSS classes; "card-inner front" -> styles for front face */
    front.textContent = card.value; /* .textContent -> sets visible text; card.value -> symbol/letter for this card */

    const back = document.createElement("div"); /* back -> div for card back face */
    back.className = "card-inner back"; /* "card-inner back" -> styling for back face */
    back.textContent = "Card"; /* placeholder text shown before flipping */

    btn.append(front, back); /* btn.append -> inserts both faces into the button; front, back -> children added in order */
    btn.addEventListener("click", onCardClick); /* addEventListener -> attaches event; "click" -> event type; onCardClick -> function handling card flips */

    boardEl.appendChild(btn); /* boardEl.appendChild -> adds the fully built card button to the board container */
  });
}

/* --------------------------------------------------
FUNCTION DECLARATION + STATUS UPDATE LOGIC — updateStatus()
• updateStatus() is a function declaration → a reusable named block of code that updates the UI.
• Purpose → refresh the UI values for moves, pairs, and time so the interface always reflects the current game state.
• Pattern → read state → format values → write to DOM → ensures the UI stays synchronised with gameplay.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS (WITH FINAL SUMMARY MERGED INTO EACH LINE)
1) updateStatus() is called after moves, pairsFound, or secondsElapsed change → purpose: synchronises the UI with the current game state so the player always sees accurate information.
2) It reads state.moves and writes it to movesValueEl → input: state.moves → output: updated move counter on screen, keeping the UI aligned with gameplay.
3) It reads state.pairsFound and writes it to pairsValueEl → input: state.pairsFound → output: updated pairs counter on screen, showing the player their progress.
4) It formats state.secondsElapsed using formatTime() → internal step: read raw seconds → convert into mm:ss for a readable timer.
5) It writes the formatted time into timeValueEl → input: state.secondsElapsed → output: updated timer on screen, ensuring the displayed time matches the internal timer.
6) The UI instantly reflects the current game progress → used by onCardClick(), checkMatch(), startTimer(), and resetGame() to keep the interface in sync with state.
-------------------------------------------------- */
function updateStatus() { /* function -> declares reusable code block; updateStatus -> function name describing its purpose; () -> no parameters; { } -> start of function body where the instructions live */
  movesValueEl.textContent = state.moves; /* movesValueEl -> DOM element showing moves; .textContent -> sets its visible text; = -> assign; state.moves -> current number of moves stored in game state; why -> keeps the moves display in sync with gameplay */
  pairsValueEl.textContent = state.pairsFound; /* pairsValueEl -> DOM element showing pairs found; .textContent -> updates its text; state.pairsFound -> how many pairs the player has matched; why -> shows progress to the player */
  timeValueEl.textContent = formatTime(state.secondsElapsed); /* timeValueEl -> DOM element showing time; .textContent -> sets displayed text; formatTime(...) -> helper function converting raw seconds into mm:ss; state.secondsElapsed -> total time passed; why -> shows readable timer to the player */
} 

/* --------------------------------------------------
FUNCTION DECLARATION + DECK CREATION LOGIC — createDeck(totalCards)
• createDeck() → builds a complete deck of card objects for the game → used by startGame() to prepare the board.
• Purpose → select symbols → duplicate → assign IDs → shuffle → return → ensures the game always has a valid, randomized deck.
• Pattern → slice symbols → duplicate → create objects → shuffle → return → standard memory‑game deck generation workflow.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS (WITH FINAL SUMMARY MERGED INTO EACH LINE
1) totalCards is calculated from difficulty (cols × rows) → input: totalCards passed into createDeck() from difficulty settings, determining how many cards the deck must contain.
2) SYMBOLS.slice(...) selects the correct number of unique symbols → internal step: choose only the symbols needed for this board size so each pair has a matching partner.
3) Each symbol is duplicated to form a matching pair → internal step: create two copies of each symbol so the game has pairs for matching.
4) Each card receives a unique ID → internal step: assign identifiers so each card can be tracked individually even if two cards share the same value.
5) flatMap() builds the full deck of objects → internal step: convert each symbol into two structured card objects with id, value, and matched properties.
6) shuffle(deck) randomizes the order → internal step: randomize card positions before rendering so the board is unpredictable.
7) The shuffled deck is returned → output: fully randomized deck ready for gameplay and passed back to startGame().
8) state.cards receives the final deck → output: deck stored in game state for rendering and interaction.
9) renderBoard() uses state.cards to draw the grid → used by startGame(), resetGame(), and difficulty changes to visually build the board.
-------------------------------------------------- */
function createDeck(totalCards) { /* function -> declares reusable code; createDeck -> name meaning “build the card deck”; (totalCards) -> parameter holding how many cards the board needs; { } -> start of function body */
  const values = SYMBOLS.slice(0, totalCards / 2); /* const -> constant variable; values -> selected symbols for this game; SYMBOLS -> master list of all possible symbols; .slice(0, totalCards / 2) -> takes the first totalCards/2 symbols; totalCards / 2 -> number of unique pairs needed; why -> each symbol will appear twice to form pairs */
  let id = 1; /* let -> mutable variable; id -> numeric counter used to give each card a unique identifier; = 1 -> start counting from 1; why -> needed to distinguish cards even if they share the same value */

  const deck = values.flatMap(v => ([ /* const deck -> final array of card objects; values.flatMap(...) -> loop over each symbol and return multiple items per symbol; v => ([ ... ]) -> arrow function taking one symbol v and returning an array of two card objects; [ ] -> array literal holding the two cards for that symbol */
    { id: id++, value: v, matched: false }, /* { } -> object literal representing one card; id: id++ -> assign current id then increment for next card; value: v -> store the symbol for this card; matched: false -> card starts as not yet matched; why -> tracks game progress */
    { id: id++, value: v, matched: false } /* second card object for the same symbol v; id++ -> next unique ID; value: v -> same symbol to form a pair; matched: false -> also starts unmatched */
  ])); /* ]) -> closes the array of two cards; flatMap -> flattens all these small arrays into one big deck array; why -> builds full deck with two cards per symbol */
  return shuffle(deck); /* return -> give result back to caller; shuffle(deck) -> call helper function to randomize card order; deck -> array of all card objects; why -> ensures cards appear in random positions each game */
}

/* --------------------------------------------------
TIMER LOGIC — startTimer()
• startTimer() → begins the game timer loop → used by startGame() and any resume logic.
• Purpose → increment elapsed seconds and update the UI every second so the timer display stays accurate.
• Pattern → setInterval → increment → updateStatus() → continuous UI synchronisation.
 --------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS (WITH FINAL SUMMARY MERGED INTO EACH LINE)
1) startTimer() is called to begin the timer loop → inputs: none; purpose: initialise the repeating time‑update cycle.
2) setInterval(...) creates a repeating callback every 1000ms → internal step: JavaScript schedules a function to run once per second.
3) Inside the interval, state.secondsElapsed++ increments the timer → internal step: raw seconds increase by 1 each tick.
4) updateStatus() is called to refresh the UI → output: the visible timer updates every second using the new state value.
5) The interval ID is stored in state.timerId → internal step: allows stopTimer() or resetGame() to cancel the timer later.
6) The result is a continuously updating timer display → used by startGame() and any resume logic to keep the UI in sync with elapsed time.
-------------------------------------------------- */
function startTimer() { /* function -> declares reusable code; startTimer -> name meaning “begin counting time”; () -> no parameters; { } -> start of function body */
  state.timerId = setInterval(() => { /* state.timerId -> stores interval ID so it can be stopped later; = -> assign; setInterval -> built‑in JS function that repeats code on a schedule; () => { } -> arrow function executed every interval */
    state.secondsElapsed++; /* state.secondsElapsed -> number of seconds passed; ++ -> increment by 1; why -> tracks game time increasing each second */
    updateStatus(); /* updateStatus() -> refreshes UI so timer display updates; why -> keeps visible time in sync with state */
  }, 1000); /* 1000 -> interval delay in milliseconds (1 second); why -> run the timer update once per second */
} 

/* --------------------------------------------------
GAME INITIALIZATION LOGIC — startGame(difficultyKey)
• startGame() → prepares all game state and UI for a new game → used by form submission and restart logic.
• Purpose → configure difficulty → build deck → render board → start timer → fully initialise a new game session.
• Pattern → read config → update state → build grid → render → start timer → produce a fresh playable board.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS (WITH FINAL SUMMARY MERGED INTO EACH LINE)
1) Difficulty is read from the DIFFICULTY table → input: difficultyKey ("easy", "medium", "hard") selects the correct config for board size.
2) Total cards are calculated → internal step: cols × rows determines how many cards the deck must contain.
3) Deck is created and shuffled → internal step: createDeck(totalCards) builds and randomizes the full deck for gameplay.
4) State is updated (difficulty, cards, totalPairs, running flag) → output: state now holds all data needed for a fresh game.
5) Board grid is configured → internal step: buildBoardGrid(cols, rows) sets the CSS grid layout for the chosen difficulty.
6) Cards are rendered → internal step: renderBoard() draws the full deck onto the screen.
7) Timer starts → internal step: startTimer() begins counting elapsed seconds and updating the UI.
8) Restart button becomes active → output: restartBtn.disabled = false enables restart functionality for the player.
startGame(difficultyKey) → fully initializes a new game by configuring difficulty, creating the deck, rendering the board, and starting the timer → outputs a fresh board, running timer, and updated UI → used by form submission and restart logic.
-------------------------------------------------- */
function startGame(difficultyKey) { /* function -> declares reusable code; startGame -> name meaning “begin a new game”; (difficultyKey) -> input telling which difficulty was chosen; { } -> start of function body */
  const config = DIFFICULTY[difficultyKey]; /* const -> constant variable; config -> settings for this difficulty; DIFFICULTY[...] -> lookup table; [difficultyKey] -> access the chosen difficulty; why -> get rows/cols for board */
  const totalCards = config.cols * config.rows; /* const -> fixed value; totalCards -> number of cards needed; config.cols * config.rows -> multiply columns by rows; why -> board size determines deck size */

  state.difficulty = difficultyKey; /* state.difficulty -> store chosen difficulty; = -> assign; difficultyKey -> selected difficulty; why -> keep track of current mode */
  state.cards = createDeck(totalCards); /* state.cards -> where deck is stored; = -> assign; createDeck(totalCards) -> build full deck; why -> prepare cards for rendering */
  state.totalPairs = totalCards / 2; /* state.totalPairs -> number of matching pairs; totalCards / 2 -> each pair has 2 cards; why -> used for win detection */
  state.isRunning = true; /* state.isRunning -> game active flag; = true -> mark game as running; why -> prevent actions before game starts */

  buildBoardGrid(config.cols, config.rows); /* buildBoardGrid -> sets CSS grid layout; (cols, rows) -> board dimensions; why -> prepare visual grid */
  renderBoard(); /* renderBoard() -> draws all cards on screen; why -> show the deck to the player */
  boardEl.className = "board " + difficultyKey; updateStatus(); startTimer(); restartBtn.disabled = false; 
}

/* --------------------------------------------------
FUNCTION DECLARATION + CLICK LOGIC — onCardClick(e)
• onCardClick() → handles all card‑click interactions → core interaction handler for flipping cards.
• Purpose → validate click → flip card → store pick → update state → trigger match logic → produces updated UI and updated state.
• Pattern → guard clauses → flip → store pick → increment → update → compare → used by renderBoard() (event listeners), updateStatus(), endGame().
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS 
1) Player clicks a card → input: click event, card ID, and state.cards → onCardClick(e) begins the core interaction flow.
2) Guard clauses ensure the click is valid → game is running, board not locked, card not matched, and not the same as firstPick → validates before processing, as described in the final summary.
3) Card is visually flipped → internal step: add "is-flipped" class to show the card face → part of onCardClick(e)’s flip + update behaviour.
4) If no firstPick → store firstPickId and exit → internal step: wait for second card before comparing → matches the “store selections” step in the final summary.
5) If secondPick → store secondPickId → increment moves → updateStatus() → checkForMatch() → internal steps: store → update → compare → exactly the sequence described in the final summary.
6) checkForMatch():
   → If match → mark both cards matched → increment pairs → clear picks → maybe endGame() → output: updated state + possible win → matches the final summary’s “resolves match and updates state”.
   → If mismatch → lock board → flip both back after delay → unlock → clear picks → output: mismatch resolution and restored board state → matches the final summary’s “correct mismatch behaviour”.
-------------------------------------------------- */
function getCardById(id) { /* function -> reusable block of code; getCardById -> name meaning “find a card using its ID”; (id) -> input parameter; { } -> start of function body */
  return state.cards.find(c => c.id === id); /* return -> give result back; state.cards -> array of all card objects; .find(...) -> search for one item; c => c.id === id -> arrow function checking each card c; c.id === id -> compare card’s id to the given id; why -> retrieve the exact card object */
} 

function getCardElementById(id) { /* function -> reusable code; getCardElementById -> name meaning “find the DOM element for a card”; (id) -> input; { } -> start of body */
  return document.querySelector(`.card[data-id="${id}"]`); /* document -> webpage; .querySelector -> find first matching element; `.card[data-id="${id}"]` -> CSS selector string; .card -> class; [data-id="..."] -> match card with this id; why -> get the actual button element on screen */
}

function onCardClick(e) { /* function -> handles card clicks; onCardClick -> name; (e) -> event object from browser; { } -> start of body */
  if (!state.isRunning || state.lockBoard) return; /* if -> condition; !state.isRunning -> game not active; || -> OR; state.lockBoard -> board temporarily locked; return -> stop function; why -> prevent clicks when game shouldn't accept input */

  const id = Number(e.currentTarget.dataset.id); /* const -> constant variable; id -> store clicked card ID; Number(...) -> convert text to number; e.currentTarget -> element clicked; .dataset.id -> read data-id attribute; why -> know which card was clicked */
  const card = getCardById(id); /* const card -> store card object; getCardById(id) -> fetch card data; why -> access card properties */

  if (card.matched || state.firstPickId === id) return; /* if -> check; card.matched -> already matched; || -> OR; state.firstPickId === id -> same card clicked twice; return -> stop; why -> ignore invalid clicks */

  e.currentTarget.classList.add("is-flipped"); /* e.currentTarget -> clicked element; .classList.add -> add CSS class; "is-flipped" -> triggers flip animation; why -> visually flip card */

  if (!state.firstPickId) { /* if -> check; !state.firstPickId -> no first card chosen yet */
    state.firstPickId = id; /* store this card as first pick */
    return; /* stop here until second card is clicked */
  }

  state.secondPickId = id; /* store second selected card */
  state.moves++; /* increase move counter by 1 */
  updateStatus(); /* refresh UI to show new move count */
  checkForMatch(); /* check if the two selected cards match */
}

function checkForMatch() { /* function -> checks if two cards match; { } -> start */
  const first = getCardById(state.firstPickId); /* first -> card object for first pick; getCardById(...) -> fetch card */
  const second = getCardById(state.secondPickId); /* second -> card object for second pick */

  if (first.value === second.value) { /* if -> check; first.value === second.value -> same symbol; why -> match found */
    first.matched = true; /* mark first card as matched */
    second.matched = true; /* mark second card as matched */

    state.pairsFound++; /* increase matched pair count */
    clearPicks(); /* reset selected cards */

    if (state.pairsFound === state.totalPairs) { /* if -> check win; pairsFound === totalPairs -> all matched */
      endGame(); /* call endGame() to finish game */
    }
  } else { /* else -> cards do NOT match */
    state.lockBoard = true; /* lock board to prevent clicking during flip-back */

    setTimeout(() => { /* setTimeout -> delay code; () => { } -> arrow function; 600 -> run after 600ms */
      const firstEl = getCardElementById(state.firstPickId); /* firstEl -> DOM element for first card */
      const secondEl = getCardElementById(state.secondPickId); /* secondEl -> DOM element for second card */

      if (firstEl) firstEl.classList.remove("is-flipped"); /* if -> check exists; remove flip class */
      if (secondEl) secondEl.classList.remove("is-flipped"); /* remove flip class from second */

      clearPicks(); /* reset selected card IDs */
      state.lockBoard = false; /* unlock board so player can click again */
    }, 600); /* 600ms delay to show mismatch before flipping back */
  }
} 

function clearPicks() { /* function -> resets selected cards; { } -> start */
  state.firstPickId = null; /* clear first pick */
  state.secondPickId = null; /* clear second pick */
} 


/* --------------------------------------------------
FUNCTION DECLARATION + INTERNAL ACTIONS — endGame()
   • endGame() → Cleanly finishes the game and updates the UI.
   • Purpose → Stop gameplay, stop the timer, save history, update UI with final message.
   • Pattern → Stop timer → update state → save history → update UI.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS
1) endGame() is triggered when all pairs are matched → endGame() finalises the game once checkForMatch() confirms all pairs are found.
2) Timer is stopped using clearInterval() → internal step: stop timer → matches final summary “stop timer”.
3) state.isRunning is set to false to disable further clicks → internal step: update state → matches final summary “update state”.
4) A new game result object is created and added to gameHistory → internal step: save history → matches final summary “save results”.
5) History is trimmed to the last 5 games → internal step: maintain recent history → matches final summary “save history”.
6) renderHistory() updates the UI table → output: updated history table → matches final summary “updated history table”.
7) setFeedback() displays a personalised completion message → output: final feedback message → matches final summary “final feedback message”.
-------------------------------------------------- */
function endGame() { /* function -> reusable block of code; endGame -> name meaning “finish the game”; () -> no inputs; { } -> start of function body */
  clearInterval(state.timerId); /* clearInterval -> stops a running timer; (state.timerId) -> ID of the timer created earlier; why -> stop counting time when game ends */
  state.isRunning = false; /* state.isRunning -> game active flag; = false -> mark game as no longer running; why -> prevent further clicks */

  gameHistory.unshift({ /* gameHistory -> array storing past games; .unshift -> add item to the START of the array; { } -> object representing one completed game */
    name: state.playerName, /* name -> player's name; state.playerName -> stored name; why -> save who played */
    difficulty: state.difficulty, /* difficulty -> difficulty used; state.difficulty -> current difficulty; why -> record settings */
    moves: state.moves, /* moves -> number of moves taken; state.moves -> final move count */
    time: formatTime(state.secondsElapsed), /* time -> formatted time string; formatTime(...) -> convert seconds to mm:ss; state.secondsElapsed -> total time played */
    pairs: state.pairsFound /* pairs -> number of pairs matched; state.pairsFound -> final pair count */
  }); /* } -> end of game record object; ) -> end of unshift call */

  if (gameHistory.length > 5) { /* if -> condition; gameHistory.length -> number of saved games; > 5 -> more than 5 entries; why -> keep only last 5 games */
    gameHistory.pop(); /* .pop() -> remove last item in array; why -> maintain max history size */
  }

  renderHistory(); /* renderHistory() -> update the on‑screen history list; why -> show latest results */
  setFeedback(`Game complete. Well done, ${state.playerName}.`); /* setFeedback -> show message to player; template string -> insert player name; why -> give end‑of‑game feedback */
} /* } -> end of function body; endGame can now be called when all pairs are matched */


/* --------------------------------------------------
FUNCTION DECLARATION + HISTORY TABLE RENDERING — renderHistory()
   • renderHistory() → Updates the “Last 5 Games” table in the UI.
   • Purpose → Clear existing rows → loop through gameHistory → insert new rows.
   • Pattern → Clear table → iterate history → build <tr> → append to <tbody>.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS
1) renderHistory() is called after endGame() → renderHistory() rebuilds the “Last 5 Games” table after a new result is saved.
2) The table body is cleared to avoid duplicate rows → internal step: clear table → matches final summary “clear table”.
3) gameHistory is looped through (max 5 entries) → internal step: loop through gameHistory array → matches final summary “loop”.
4) For each game:
     → A <tr> is created → internal step: create rows → matches final summary “create rows”.
     → Game data is inserted into <td> cells → internal step: insert data → matches final summary “create rows”.
     → The row is appended to the table → internal step: append → matches final summary “append”.
5) The UI updates instantly with the latest results → output: updated history table visible to the player → matches final summary “updated history table”.
-------------------------------------------------- */
function renderHistory() { /* function -> reusable code block; renderHistory -> name meaning “draw the game history table”; () -> no inputs; { } -> start of function body */
  historyBodyEl.innerHTML = ""; /* historyBodyEl -> table body element in the DOM; .innerHTML -> sets its HTML content; = "" -> clear previous rows; why -> start with an empty history table before adding new rows */

  gameHistory.forEach(game => { /* gameHistory -> array of past game records; .forEach -> loop through each record; game => { } -> arrow function receiving one game object at a time */
    const row = document.createElement("tr"); /* const -> constant variable; row -> new table row; document.createElement("tr") -> create a <tr> element; why -> each game becomes one row */
    /* row.innerHTML -> set the inside HTML of the row; = -> assign; backticks `` -> template literal allowing multi-line HTML */
    /* <td> -> table cell; data-label -> attribute for responsive tables; ${game.name} -> insert player's name; why -> show who played */
    row.innerHTML = ` 
      <td data-label="Player">${game.name}</td>
      <td data-label="Difficulty">${game.difficulty}</td>
      <td data-label="Moves">${game.moves}</td>
      <td data-label="Time">${game.time}</td>
      <td data-label="Pairs">${game.pairs}</td>
   `;
    historyBodyEl.appendChild(row); /* historyBodyEl -> table body; .appendChild(row) -> add the row to the table; why -> display this game in the history list */
  }); 
} 

/* --------------------------------------------------
EVENT LISTENER + GAME INITIALISATION LOGIC — form submit
   • This listener runs when the user submits the form.
   • Purpose → Validate input → reset previous game → configure difficulty → build deck → render board → start timer.
   • Execution pattern → preventDefault → validate → update state → reset → startGame → UI feedback.
--------------------------------------------------
DETAILED FLOW — WHAT ACTUALLY HAPPENS
1) User submits the form → this "submit" event is the entry point for starting a new game.
2) e.preventDefault() stops the browser from reloading the page → allows full JS control.
3) Name + difficulty are read and validated → if either is missing → show feedback → stop.
4) If valid:
     • Save player name into state → used for messages + history.
     • resetGame() clears previous board, timer, moves, pairs.
     • startGame(difficulty) performs:
          - difficulty setup (grid size + card size)
          - deck creation (shuffled pairs)
          - board rendering (cards added to DOM)
          - timer start (counting seconds)
          - UI state updates (moves=0, pairs=0)
5) Smooth scroll moves the user to the Game Status panel.
6) setFeedback() displays a friendly “Good luck” message
-------------------------------------------------- */
gameForm.addEventListener("submit", e => { /* Attach submit handler to form; runs when user clicks Start Game */
  e.preventDefault(); /* Prevent page reload so game can be handled entirely with JavaScript */

  const name = playerNameEl.value.trim(); /* Read player name from input; trim() removes extra spaces */
  const difficulty = difficultyEl.value;  /* Read selected difficulty from dropdown */

  if (!name || !difficulty) { /* If name is empty OR difficulty not chosen → invalid form */
    setFeedback("Please enter your name and select a difficulty."); /* Show error message */
    return; /* Stop here → do not start game */
  }

  state.playerName = name; /* Save player name into global game state */
  resetGame(); /* Clear previous game data (board, timer, moves, pairs) */
  startGame(difficulty); /* Start a new game using the selected difficulty */

  gameStatusEl.scrollIntoView({       /* Scroll smoothly to the Game Status panel */
    behavior: "smooth",               /* Smooth scrolling animation */
    block: "start"                    /* Align panel to top of viewport */
  });

  setFeedback(`Good luck, ${name}.`); /* Show friendly start message with player's name */
});

/* --------------------------------------------------
   FUNCTION DECLARATION + GAME RESET LOGIC — resetGame()
   • resetGame() → Fully clears all game state and UI elements.
   • Purpose → Stop timer, reset state variables, clear board, refresh UI.
   • Pattern → stop timer → reset state → clear board → update UI.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS
resetGame()
1) Stops timer → internal step: stop timer → matches final summary “stop timer”.
2) Clears all state variables → internal step: clear state → matches final summary “clear state”.
3) Clears board UI → internal step: clear board → matches final summary “clear board”.
4) Resets counters → internal step: update UI → matches final summary “update UI”.
5) Prepares system for a fresh game → output: clean, ready‑to‑start environment → matches final summary “clean environment”.
restart button
1) Ensures difficulty is selected → input: difficultyEl.value → matches final summary “difficulty input”.
2) Calls resetGame() to wipe old state → internal step: clear state → matches final summary “clear state”.
3) Calls startGame() to begin a new game immediately → output: fully initialised game → matches final summary “ready for play”.
-------------------------------------------------- */
function resetGame() { /* function -> reusable code block; resetGame -> name meaning “reset all game data”; () -> no inputs; { } -> start of function body */
  clearInterval(state.timerId); /* clearInterval -> stop running timer; (state.timerId) -> ID of active timer; why -> timer must stop when game resets */

  state.isRunning = false; /* state.isRunning -> game active flag; = false -> mark game as not running; why -> prevent clicks before new game starts */
  state.cards = []; /* state.cards -> array holding deck; = [] -> empty array; why -> remove old deck */
  state.firstPickId = null; /* firstPickId -> ID of first selected card; = null -> clear selection */
  state.secondPickId = null; /* secondPickId -> ID of second selected card; = null -> clear selection */
  state.moves = 0; /* moves -> number of moves taken; = 0 -> reset counter */
  state.pairsFound = 0; /* pairsFound -> number of matched pairs; = 0 -> reset progress */
  state.secondsElapsed = 0; /* secondsElapsed -> timer value; = 0 -> reset time */

  boardEl.innerHTML = ""; /* boardEl -> game board container; .innerHTML -> sets HTML; = "" -> remove all card elements from screen */
  updateStatus(); /* updateStatus() -> refresh UI to show zeros; why -> keep UI consistent with reset state */
} 

restartBtn.addEventListener("click", () => { /* restartBtn -> restart button element; .addEventListener -> attach event; "click" -> event type; () => { } -> arrow function to run when clicked */
  if (!difficultyEl.value) return; /* if -> condition; !difficultyEl.value -> no difficulty selected; return -> stop; why -> cannot restart without difficulty */
  resetGame(); /* resetGame() -> clear old game state */
  startGame(difficultyEl.value); /* startGame(...) -> begin new game using selected difficulty */
}); 

/* --------------------------------------------------
FUNCTION INVOCATIONS + INITIAL UI STATE — updateStatus() & setFeedback()
   • These are function invocation statements — they EXECUTE previously defined functions.
   • Purpose -> Prepare the UI before the game starts.
   • Pattern -> Call expression statements that update counters + show instructions.
--------------------------------------------------
LOGIC — WHAT ACTUALLY HAPPENS
1) Page loads and script runs → initial UI state begins before any gameplay → matches final summary “prepares the screen before gameplay”.
2) updateStatus() reads default state values (moves = 0, pairsFound = 0, seconds = 0) and writes them to the UI → internal step: update counters → matches final summary “update counters”.
3) setFeedback() displays the initial instruction message → internal step: show instructions → matches final summary “show instructions”.
4) The player sees a clean, ready‑to‑start interface → output: clean UI with clear guidance → matches final summary “clean UI with guidance”.
-------------------------------------------------- */
updateStatus(); /* updateStatus() -> call the function that refreshes the UI; () -> run it now; why -> show correct moves, pairs, and time when page loads */
setFeedback("Enter your name and select a difficulty to start."); /* setFeedback -> show a message to the user; "..." -> text string; why -> guide player before starting */
})(); /* }) -> closes the arrow function; () -> immediately invoke it; ; -> end of statement; why -> this is an IIFE (Immediately Invoked Function Expression) that runs setup code as soon as the script loads */
