"use strict";
/* --------------------------------------------------
   SELECT HTML ELEMENTS — DOM ELEMENT REFERENCES
   These are called:
   “DOM (Document Object Model) element references”
   because each variable stores a reference to an element
   from the HTML page.
--------------------------------------------------
   SELECT HTML ELEMENTS — DOM ELEMENT REFERENCES
   const boardEl = document.getElementById("board");
         const -> JavaScript keyword.
                - Creates a constant variable.
                - The *name* of the variable cannot change later.
                - The *contents* (the HTML element) CAN still be modified.

         boardEl -> Variable name YOU created.
                - “El” means “Element”.
                - Stores the HTML element once it is found.
                - This name does NOT come from HTML — you invented it.

         = -> Assignment operator.
                - Means: “store the value on the right into the variable on the left”.

         document -> Built‑in JavaScript object.
                - Represents the entire HTML page.
                - Created automatically by the browser.
                - Gives access to the DOM (the browser’s internal structure of your HTML).

         . -> Dot operator.
                - Used to access a method or property of an object.
                - Here: “use the getElementById method that belongs to document”.

         getElementById -> DOM method (a function inside document).
                - Searches the HTML for an element with a matching id.
                - Returns that element if found.

         ( -> Opens the method’s argument list.

         "board" -> STRING in JavaScript.
                - Also an argument passed into getElementById().
                - Must match exactly the HTML id:
                      <div id="board">
                - Tells JavaScript which element to search for.

         ) -> Closes the argument list.
         ; -> Ends the JavaScript statement.
   DEEP LOGIC — WHAT ACTUALLY HAPPENS
          Step 1 -> The browser loads your HTML and builds the DOM tree.
          Step 2 -> JavaScript runs document.getElementById("board").
          Step 3 -> The browser searches the DOM for:
                        <div id="board">...</div>
          Step 4 -> When found, the method RETURNS that HTML element.
          Step 5 -> The = operator stores the returned element inside:
                        boardEl (your variable)
          Step 6 -> Now boardEl is a REFERENCE to the real HTML element.
                        - You can use boardEl later to update or modify the board.
   FINAL SUMMARY
        "board" -> STRING in JavaScript.
        id="board" -> ELEMENT ID in HTML.
        boardEl -> VARIABLE NAME YOU CREATED to store the element.
        document.getElementById("board") -> Searches HTML and returns the element.
        boardEl -> Receives and stores that element for later use.
        renderBoard() -> Function that draws the entire game board.
              - Uses boardEl as the gateway between the game’s internal logic
                and what the player sees on the screen.
        1) boardEl.innerHTML = ""
              - Completely clears the board before drawing new cards.
        2) For each card in the game state:
              - JavaScript creates a button element in memory.
              - The card is invisible until it is added to the board.
        3) boardEl.appendChild(btn)
              - Inserts each card button into the <div id="board"> element.
              - This is the moment the card becomes visible to the player.
        Without boardEl:
              - The board could not be cleared.
              - The layout could not be updated.
              - Cards could not be added to the screen.
              - The game would run internally but remain completely invisible.
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
   DIFFICULTY SETTINGS OBJECT
   const DIFFICULTY = { ... };
         const -> Declares a constant variable (cannot be reassigned).
         DIFFICULTY -> Variable name I created; stores all difficulty presets.
         = -> Assignment operator (“store right side into left side”).
         { } -> Object literal containing key–value pairs.
         ; -> Ends the statement.
   easy: { cols: 2, rows: 3 }
         easy -> Key name representing the “easy” difficulty level.
         : -> Separates the key from its value.
         { cols: 2, rows: 3 } -> Object storing board layout for this difficulty.
                - cols -> Number of columns on the board.
                - 2 -> Easy mode uses 2 columns.
                - rows -> Number of rows on the board.
                - 3 -> Easy mode uses 3 rows.
   medium: { cols: 3, rows: 4 }
         medium -> Key name representing the “medium” difficulty level.
         : -> Separates key from value.
         { cols: 3, rows: 4 } -> Object storing board layout.
                - cols -> 3 columns.
                - rows -> 4 rows.
   hard: { cols: 4, rows: 4 }
         hard -> Key name representing the “hard” difficulty level.
         : -> Separates key from value.
         { cols: 4, rows: 4 } -> Object storing board layout.
                - cols -> 4 columns.
                - rows -> 4 rows.
   WHAT FEEDS INTO DIFFICULTY
         User selection from the difficulty dropdown.
         totalCards -> Calculated from cols * rows.
         createDeck(totalCards) -> Uses this number to build the deck.
   WHERE DIFFICULTY FEEDS INTO
         Board size -> renderBoard() uses cols and rows to draw the grid.
         Game state -> state.totalPairs = totalCards / 2.
         Layout -> CSS grid uses cols and rows to size the board.
-------------------------------------------------- */
const DIFFICULTY = {
  easy:   { cols: 2, rows: 3 },
  medium: { cols: 3, rows: 4 },
  hard:   { cols: 4, rows: 4 }
};

/* --------------------------------------------------
   SYMBOLS ARRAY
   const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
         const -> Variable name cannot change; content can still be used/read.
         SYMBOLS -> Variable name YOU created; stores card symbols.
         = -> Assignment operator (“store right side into left side”).
         "ABCDEFGHJKLMNPQRSTUVWXYZ" -> String of all card letters.
         . -> Dot operator.
         split("") -> Splits string into individual characters.
                - "" = split between every character.
                - Example: "ABC".split("") → ["A","B","C"]
         RESULT -> SYMBOLS becomes ["A","B","C","D","E","F", ...]
                - An array of single‑character strings.

   HOW SYMBOLS FEEDS INTO THE GAME (DATA FLOW)
         1) Select needed symbols:
                const values = SYMBOLS.slice(0, totalCards / 2);

         2) Duplicate symbols to create pairs:
                deck.push({ value, matched:false });
                deck.push({ value, matched:false });

         3) Shuffle deck:
                return shuffle(deck);

         4) Build game state:
                state.cards = createDeck(totalCards);

         5) Render cards:
                renderBoard(); // loops through state.cards

   FULL PIPELINE
         SYMBOLS
         slice() -> choose symbols
         duplicate -> create pairs
         shuffle -> randomize
         createDeck() -> build card objects
         state.cards -> store in game state
         renderBoard() -> draw cards
         player sees the cards

   Creates an array of symbols by splitting a string. Not part of the DOM.
   Used to select symbols, duplicate them into pairs, shuffle them, and
   build the card objects stored in state.cards, which renderBoard() displays.
-------------------------------------------------- */
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

/* --------------------------------------------------
   GAME STATE OBJECT
   let state = { ... };
         let -> Declares a variable whose value CAN change later.
         state -> Variable name YOU created; stores all live game data.
         = -> Assignment operator (“store right side into left side”).
         { } -> Object literal containing key–value pairs.
         ; -> Ends the statement.
   isRunning: false  -> isRunning -> Controls whether gameplay is allowed.
         : -> Separates property name from its value.
         false -> Boolean value. Means the game is NOT currently active.
   cards: []  ->    cards -> Will store all card objects created by createDeck().
         : -> Separator.
         [] -> Empty array. Will be filled later.
   firstPick: null  ->    firstPick -> Stores the first selected card during a turn.
         null -> Means “no card selected yet”.
   secondPick: null   ->          secondPick -> Stores the second selected card.
         null -> No second card selected yet.
   moves: 0  ->    moves -> Counts how many turns the player has taken.
         0 -> Initial value at game start.
   pairsFound: 0  ->  pairsFound -> Increases when a matching pair is found.
         0 -> No pairs found at the beginning.
   totalPairs: 0  ->  totalPairs -> Set at game start based on difficulty (totalCards / 2).
         0 -> Placeholder until difficulty is chosen.
   seconds: 0  -> seconds -> Tracks elapsed time.
         0 -> Timer starts at zero.
   timer: null  ->     timer -> Will store the setInterval() ID so the timer can be stopped.
         null -> No timer running yet.
   WHAT FEEDS INTO state
         createDeck(totalCards) -> fills state.cards
         difficulty selection -> sets state.totalPairs
         startTimer() -> updates state.seconds
         onCardClick() -> updates firstPick, secondPick, moves
         checkMatch() -> updates pairsFound
   WHERE state FEEDS INTO
         renderBoard() -> reads state.cards to draw the board
         updateStatus() -> reads moves, pairsFound, seconds
         checkMatch() -> reads firstPick and secondPick
         timer display -> uses state.seconds
   FULL PIPELINE
         User selects difficulty
         totalCards = cols * rows
         state.cards = createDeck(totalCards)
         state.totalPairs = totalCards / 2
         state.seconds = 0
         state.moves = 0
         renderBoard()
         Game begins using values stored in state
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
   HELPER FUNCTIONS — SHUFFLE ARRAY RANDOMLY
   function shuffle(array) { ... }
         function -> Declares a reusable function.
         shuffle -> Name I created. Describes what the function does: shuffles an array.
         (array) -> Parameter name I chose. “array” represents whatever array is passed into the function.
                - It is NOT a keyword — just a variable name.
         { } -> Starts the function body (the code that runs when called).

   return array.sort(() => Math.random() - 0.5);
         return -> Keyword that sends a value OUT of the function.
                - Whatever follows return becomes the function’s output.
         array -> The parameter passed into shuffle(). Represents the list of items you want to shuffle.
         . -> Dot operator.
         sort(...) -> Built‑in Array method. Rearranges items in the array.
                - Normally sorts alphabetically.
                - When given a comparison function, it sorts based on that function.
         ( ) -> Parentheses for passing a function into .sort().
         () => ... -> Arrow function. A short way to write a function with no name.
                - It returns whatever expression is on the right side.
         Math.random() -> Returns a random number between 0 and 1.
         Math.random() - 0.5 -> Produces a positive or negative number.
                - Positive → swap items.
                - Negative → keep order.
                - This randomness creates a shuffled array.

   INPUT — WHAT FEEDS INTO shuffle()
         array -> The deck of card values created in createDeck().
                - Example: shuffle(["A","A","B","B","C","C"])

   WHERE shuffle() FEEDS INTO (OUTPUT FLOW)
         1) createDeck(totalCards)
                - calls shuffle(deck)
                - receives the shuffled deck back
         2) state.cards = createDeck(totalCards)
                - the shuffled deck is stored in the game state
         3) renderBoard()
                - reads state.cards
                - draws the cards in their shuffled order

   FULL PIPELINE
         SYMBOLS
         slice() -> choose symbols
         duplicate -> create pairs
         shuffle() -> randomize order
         createDeck() -> build card objects
         state.cards -> store shuffled deck
         renderBoard() -> draw cards on screen
-------------------------------------------------- */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
/* --------------------------------------------------
      HELPER FUNCTION — FORMAT TIME (mm:ss) — CONVERTS SECONDS TO "mm:ss"
   function formatTime(seconds) { ... }
         function -> declares reusable code.
         formatTime -> name I created; formats time.
         (seconds) -> parameter receiving total elapsed seconds.
         { } -> function body.
   const m = String(Math.floor(seconds / 60)).padStart(2, "0");
         const -> creates a constant variable (name cannot change).
         m -> Variable name I created. Stores the formatted minutes string.
         = -> Assignment operator. “Store the value on the right into the variable on the left.”
         String(...) -> Converts whatever is inside the parentheses into a STRING.
                - Ensures the result can use string methods like padStart().
         Math.floor(...) -> Built‑in JS function. Rounds a number DOWN to the nearest whole integer.
         seconds / 60 -> Division operator. Converts total seconds into minutes.
                - Example: 125 / 60 → 2.0833 minutes.
         Math.floor(seconds / 60) -> Takes the whole minutes only.
                - Example: 2.0833 → 2.
         String(Math.floor(seconds / 60)) -> Converts the number 2 into the string "2".
         .padStart(2, "0") -> String method. Pads the start of the string with extra characters.
                - Ensures the string has at least 2 characters.
                - If too short, adds "0" at the START.
                - Example: pad to length 2 using "0".
                - Final result: m becomes a 2‑digit minute string.
                - Example: seconds = 125 → m = "02".
   const s = String(seconds % 60).padStart(2, "0");
         const -> Declares a constant variable (name cannot be reassigned).
         s -> Variable name YOU created. Stores the formatted seconds string.
         = -> Assignment operator (“store right side into left side”).
         String(...) -> Converts the value inside into a STRING.
         seconds % 60 -> % = modulo operator.
                - Gives the remainder after dividing by 60.
                - Extracts leftover seconds after full minutes.
                - Example: 125 % 60 → 5.
         String(seconds % 60) -> Converts the remainder (e.g., 5) into "5".
         .padStart(2, "0") -> Ensures the string has 2 characters.
                - Adds a leading "0" if needed. "5" → "05".
         Final result: s becomes a 2‑digit seconds string (e.g., "05").
   return `${m}:${s}`;
         return -> Sends a value OUT of the function.
         `${m}:${s}` -> Template literal (backticks). Embeds variables directly into a string.
                - ${m} -> minutes string (e.g., "02").
                - ${s} -> seconds string (e.g., "05").
                - ":" -> separator between minutes and seconds.
         Final output -> "02:05" (always in "mm:ss" format).
   WHAT FEEDS INTO formatTime()
         state.seconds -> updated every second by startTimer()
         updateStatus() -> calls formatTime(state.seconds)
   WHERE formatTime() FEEDS INTO
         timeValueEl.textContent = formatTime(state.seconds)
         - updates the on‑screen timer ("mm:ss")
   FULL PIPELINE
         startTimer()
         state.seconds++
         updateStatus()
         formatTime(state.seconds)
         "mm:ss"
         timeValueEl.textContent
         timer updates on screen
   formatTime() converts raw seconds into "mm:ss" using division, modulo, rounding, string conversion, and padding. It is fed by
   state.seconds and feeds into the UI timer display.
-------------------------------------------------- */
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* --------------------------------------------------
   UI HELPER — FEEDBACK MESSAGE
   function setFeedback(message) { ... }
         function -> Declares a reusable block of code.
         setFeedback -> Function name YOU created. Updates the feedback text shown to the user.
         (message) -> Parameter name YOU chose; contains the text to display.
         { } -> Function body; contains all instructions executed when called.

   feedbackEl.textContent = message;
         feedbackEl -> DOM element that displays feedback messages to the user.
                - Typically used to show errors, confirmations, or instructions.
         . -> Dot operator.
         textContent -> DOM property that sets the visible text inside the element.
         = -> Assignment operator.
         message -> The string passed into setFeedback(); becomes the displayed text.
         ; -> Ends the statement.

   WHAT FEEDS INTO setFeedback()
         message -> Any string passed by the caller.
                - Example: "Game started!"
                - Example: "Please select a difficulty."
                - Example: "Invalid move."

   WHERE setFeedback() FEEDS INTO
         feedbackEl -> Updates the on‑screen feedback area.
         UI messaging -> Provides real‑time communication to the player.

   FULL PIPELINE
         Some event occurs (form submit, error, success)
         setFeedback("Your message")
         feedbackEl.textContent updates
         Player sees the new message immediately
-------------------------------------------------- */
function setFeedback(message) {
  feedbackEl.textContent = message;
}

/* --------------------------------------------------
   CREATE GAME DECK
   function createDeck(totalCards) { ... }
         function -> Declares a reusable block of code.
         createDeck -> Function name YOU created. Builds the full deck of cards for the game.
         (totalCards) -> Parameter representing how many cards the board should contain.
         { } -> Function body; contains all instructions executed when the function is called.

   const values = SYMBOLS.slice(0, totalCards / 2);
         const -> Declares a constant variable (cannot be reassigned).
         values -> Variable name YOU created; stores the selected card symbols.
         = -> Assignment operator.
         SYMBOLS -> Array of all possible card symbols (A, B, C, ...).
         . -> Dot operator used to access a method on the SYMBOLS array.
         slice(0, totalCards / 2) -> Array method that extracts part of the array.
                - 0 -> Starting index.
                - totalCards / 2 -> Number of unique symbols needed (because each symbol appears twice).
                - Returns an array of the first N symbols.

   const deck = [];
         const -> Declares a constant variable.
         deck -> Variable name YOU created; will store the full deck of card objects.
         = -> Assignment operator.
         [] -> Empty array literal; deck starts empty.

   values.forEach(value => { ... });
         values -> Array of selected symbols.
         . -> Dot operator.
         forEach(...) -> Array method; loops through each symbol in values.
         value -> Parameter name YOU chose; represents the current symbol in the loop.
         => -> Arrow function syntax.
         { } -> Code block executed for each symbol.

      deck.push({ value, matched: false });
         deck -> The array storing all card objects.
         . -> Dot operator.
         push(...) -> Array method; adds a new item to the end of the array.
         { value, matched: false } -> Object literal representing a single card.
                - value -> The card’s symbol (A, B, C, etc.).
                - matched: false -> Indicates the card is not yet matched.

      deck.push({ value, matched: false });
         deck -> Same array.
         . -> Dot operator.
         push(...) -> Adds the second copy of the card.
         { value, matched: false } -> Creates the matching pair for the symbol.

   return shuffle(deck);
         return -> Sends a value OUT of the function.
         shuffle(deck) -> Calls the shuffle() function to randomize card order.
                - deck -> The full list of card objects (pairs included).
         ; -> Ends the statement.

   WHAT FEEDS INTO createDeck()
         SYMBOLS -> Source of all possible card symbols.
         totalCards -> Determines how many symbols to slice and how many pairs to create.

   WHERE createDeck() FEEDS INTO
         state.cards -> Receives the shuffled deck.
         renderBoard() -> Uses state.cards to draw the cards on screen.

   FULL PIPELINE
       SYMBOLS
       slice() -> select needed symbols
       forEach() -> duplicate symbols into pairs
       push() -> build card objects
       shuffle() -> randomize deck
       return deck -> stored in state.cards
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
   RENDER GAME BOARD: DRAWS ALL CARDS ON THE SCREEN.  Creates card buttons dynamically.
   function renderBoard() { ... }
         function     -declares a reusable block of code.
         renderBoard    -Function name YOU created.  Describes its purpose: render (draw) the game board.
         ()    -Empty parameter list; this function receives no inputs directly.
         { }   -Function body; contains all instructions that run when called.
   boardEl.innerHTML = "";
       boardEl   -Variable storing the <div id="board"> element.
       .     -Dot operator; accesses a property of the element.
       innerHTML   -Property that controls the HTML *inside* the element.
       =     -Assignment operator.
       ""    -Empty string; clears all existing content.
       ;     -Ends the statement.

   state.cards.forEach(card => { ... });
        state.cards    -Array of card objects created by createDeck().
        .     Access operator.
        forEach(...)    Array method; loops through each item in the array.
        card      Parameter name YOU chose. Represents the current card object in the loop.
        =>     Arrow function syntax.
        { }    Code to run for each card.
    const btn = document.createElement("button");
          const    -Declares a constant variable.
          btn     -Variable name YOU created; stores the new button.
          =      -Assignment operator.
          document     -Built‑in JS object representing the entire HTML page.
          .       -Access operator    
          createElement("button")    -DOM method; creates a <button> element in memory.
          "button"     -String specifying the type of element to create.
    btn.className = "card";
          btn   -The button element you just created.
          .     -Access operator.
          className     -Property that sets the element’s CSS class.
        =       Assignment operator.
        "card"      String; CSS class name applied to the button.
    btn.textContent = "Card";
        btn   -The button element you just created.
        textContent     -Sets the visible text inside the button.
        "Card"     - Placeholder text until the card is flipped.

     btn.dataset.index = String(index);
            btn.dataset     -Access to all data-* attributes on the element.
            .index          -Creates data-index="..." on the button.
            =               -Assigns a value.
            String(index)   -Converts index to a string.
                              This stores the card’s position in the deck
                              so you can identify which card was clicked
                              without relying on DOM order.

    btn.addEventListener("click", () => onCardClick(btn, card));
       addEventListener      -DOM method; attaches an event listener.
       "click"          -Event type; triggers when the button is clicked.
       () => onCardClick(btn, card)    -Arrow function.   Calls onCardClick() with:
                                          btn  → the button element
                                          card → the card object from state.cards
    boardEl.appendChild(btn);
          appendChild     -DOM method; inserts the button into the board.
          btn         -The button element becomes visible on the page.
   WHAT FEEDS INTO renderBoard()
          state.cards   -The shuffled deck created by createDeck().
          boardEl     -The HTML container where cards are drawn.
   WHERE renderBoard() FEEDS INTO
       The visible game board on the screen.
       Called after:
           - Game start
           - Restart
           - Difficulty change
       It updates the DOM so the player sees the cards.
   FULL PIPELINE
       createDeck()
       state.cards = shuffled deck
-------------------------------------------------- */
function renderBoard() {
  boardEl.innerHTML = "";

  state.cards.forEach(card => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.textContent = "Card";
    btn.dataset.index = String(index);

    btn.addEventListener("click", () => onCardClick(btn, card));
    boardEl.appendChild(btn);
  });
}


/* --------------------------------------------------
   UPDATE STATUS — REFRESHES UI VALUES
   function updateStatus() { ... }
         function -> Declares a reusable block of code.
         updateStatus -> Function name YOU created; updates all visible status values.
         { } -> Function body; contains all instructions executed when called.

   movesValueEl.textContent = String(state.moves);
         movesValueEl -> DOM element that displays the number of moves.
         . -> Dot operator.
         textContent -> Sets the visible text inside the element.
         = -> Assignment operator.
         String(...) -> Converts the value into a STRING.
                - Ensures consistent text output.
         state -> Main game state object.
         . -> Dot operator.
         moves -> Number of turns taken by the player.
         ; -> Ends the statement.

   pairsValueEl.textContent = String(state.pairsFound);
         pairsValueEl -> DOM element showing how many pairs have been matched.
         . -> Dot operator.
         textContent -> Updates the visible text.
         = -> Assignment operator.
         String(...) -> Converts the number into a STRING.
         state.pairsFound -> Total matched pairs so far.
         ; -> Ends the statement.

   timeValueEl.textContent = formatTime(state.seconds);
         timeValueEl -> DOM element showing the formatted timer.
         . -> Dot operator.
         textContent -> Updates the visible text.
         = -> Assignment operator.
         formatTime(...) -> Converts raw seconds into "mm:ss".
         state.seconds -> Total elapsed seconds.
         ; -> Ends the statement.

   WHAT FEEDS INTO updateStatus()
         state.moves -> Updated by onCardClick().
         state.pairsFound -> Updated by checkMatch().
         state.seconds -> Updated by startTimer().
         formatTime() -> Converts seconds to readable time.

   WHERE updateStatus() FEEDS INTO
         movesValueEl -> Move counter display.
         pairsValueEl -> Matched pairs display.
         timeValueEl -> Timer display.

   FULL PIPELINE
         Game state changes (moves, pairsFound, seconds)
         updateStatus()
         UI instantly refreshes to show new values
-------------------------------------------------- */
function updateStatus() {
  movesValueEl.textContent = String(state.moves);
  pairsValueEl.textContent = String(state.pairsFound);
  timeValueEl.textContent = formatTime(state.seconds);
}

/* --------------------------------------------------
   START TIMER — BEGINS THE GAME CLOCK
   NEW IN V8:
         - Always clears the old timer first to avoid double timers.
         - Prevents multiple intervals from running at the same time.
--------------------------------------------------
   function startTimer() { ... }
         function -> Declares a reusable block of code.
         startTimer -> Function name YOU created; starts the game timer.
         { } -> Function body; contains all instructions executed when called.
   clearInterval(state.timer);
         clearInterval -> Built‑in JS function that stops a running interval.
                - Prevents duplicate timers from stacking.
         (state.timer) -> The interval ID stored in state.timer.
         ; -> Ends the statement.

   state.timer = setInterval(() => { ... }, 1000);
         state -> Game state object.
         . -> Dot operator.
         timer -> Property that stores the interval ID.
         = -> Assignment operator.
         setInterval(...) -> Built‑in JS function that repeats code every X ms.
                - Returns an interval ID (stored in state.timer).
         () => { ... } -> Arrow function executed every second.
         1000 -> Delay time in milliseconds (1 second).
         ; -> Ends the statement.
      state.seconds++;
             state -> Game state object.
             . -> Dot operator.
             seconds -> Tracks elapsed time.
             ++ -> Increment operator; adds 1 each second.
      updateStatus();
             updateStatus -> Function that refreshes the UI.
             () -> Calls the function.
   WHAT FEEDS INTO startTimer()
         Game start -> Called when a new game begins.
         state.timer -> Cleared before starting a new interval.
         state.seconds -> Starts at 0.
   WHERE startTimer() FEEDS INTO
         state.seconds -> Increases every second.
         updateStatus() -> Refreshes UI each second.
         Timer display -> Shows updated "mm:ss".
   FULL PIPELINE
         startTimer()
         clearInterval(oldTimer)
         new setInterval begins
         Every 1 second:
             state.seconds++
             updateStatus()
             timeValueEl.textContent updates
-------------------------------------------------- */
function startTimer() {
  clearInterval(state.timer);

  state.timer = setInterval(() => {
    state.seconds++;
    updateStatus();
  }, 1000);
}

/* --------------------------------------------------
   STOP TIMER — USED WHEN GAME ENDS
   function stopTimer() { ... }
         function -> Declares a reusable block of code.
         stopTimer -> Function name YOU created; stops the running game timer.
         { } -> Function body; contains all instructions executed when called.
   clearInterval(state.timer);
         clearInterval -> Built‑in JS function that stops a running interval.
                - Prevents the timer from continuing after the game ends.
                - Ensures no further seconds are added.
         (state.timer) -> The interval ID stored in state.timer.
                - If null, clearInterval safely does nothing.
         ; -> Ends the statement.
   state.timer = null;
         state -> Game state object.
         . -> Dot operator.
         timer -> Property storing the interval ID.
         = -> Assignment operator.
         null -> Resets the timer reference.
                - Indicates “no timer is currently running”.
         ; -> Ends the statement.
   WHAT FEEDS INTO stopTimer()
         Game completion -> Called when all pairs are found.
         Game reset -> Called before starting a new game.
         startTimer() -> Ensures old timers are cleared before new ones begin.
   WHERE stopTimer() FEEDS INTO
         state.timer -> Cleared so no interval continues running.
         Timer logic -> Prevents double timers or ghost timers.
         UI updates -> Timer display stops increasing.
   FULL PIPELINE
         Game ends
         stopTimer()
         clearInterval(state.timer)
         state.timer = null
         Timer stops completely
-------------------------------------------------- */
function stopTimer() {
  clearInterval(state.timer);
  state.timer = null;
}

/* --------------------------------------------------
   CARD INTERACTION LOGIC
   NEW IN V8:
         - lockBoard prevents rapid clicking and flipping > 2 cards.
         - Prevents clicking matched cards.
         - Prevents clicking the same card twice in the same turn.
--------------------------------------------------
   function onCardClick(element, index) { ... }
         function -> Declares a reusable block of code.
         onCardClick -> Function name I created; handles all card click behavior.
         (element, index) -> Parameters:
                - element -> The <button> DOM element representing the card.
                - index -> The card’s position inside state.cards.
         { } -> Function body; contains all instructions executed when a card is clicked.
   if (!state.isRunning) return;
         if -> Conditional statement.
         ( !state.isRunning ) -> Checks if the game is not active.
         ! -> Logical NOT operator.
         state.isRunning -> Boolean controlling whether clicks are allowed.
         return -> Exits the function immediately.
         ; -> Ends the statement.
   if (state.lockBoard) return;
         state -> Game state object.
         . -> Dot operator.
         lockBoard -> Boolean that temporarily disables clicking.
                - Used during animations or match checking.
         return -> Prevents further card interaction.
         ; -> Ends the statement.
   const card = state.cards[index];
         const -> Declares a constant variable.
         card -> Stores the card object at the clicked index.
         = -> Assignment operator.
         state.cards -> Array of all card objects.
         [index] -> Retrieves the card at the clicked position.
         ; -> Ends the statement.
   if (card.matched) return;
         card -> The selected card object.
         . -> Dot operator.
         matched -> Boolean indicating if the card is already matched.
         return -> Prevents interacting with already matched cards.
         ; -> Ends the statement.
   if (state.firstPick && state.firstPick.index === index) return;
         state.firstPick -> The first selected card of the turn.
         && -> Logical AND operator.
         state.firstPick.index -> Index of the first selected card.
         === -> Strict equality operator.
         index -> Index of the card just clicked.
         return -> Prevents clicking the same card twice.
         ; -> Ends the statement.
   element.textContent = card.value;
         element -> The <button> DOM element.
         . -> Dot operator.
         textContent -> Sets the visible text inside the button.
         = -> Assignment operator.
         card.value -> The symbol/letter of the card.
         ; -> Ends the statement.
   element.classList.add("is-flipped");
         element.classList -> List of CSS classes on the card element.
         . -> Dot operator.
         add -> Adds a CSS class.
         ("is-flipped") -> Applies flipped styling.
         ; -> Ends the statement.
   if (!state.firstPick) { ... }
         if -> Conditional statement.
         ( !state.firstPick ) -> Checks if this is the first card of the turn.
         { } -> Code block executed when true.
      state.firstPick = { element, index, card };
              state -> Game state object.
              . -> Dot operator.
              firstPick -> Stores the first selected card.
              = -> Assignment operator.
              { element, index, card } -> Object containing:
                      - element -> DOM element
                      - index -> Card index
                      - card -> Card data object
              ; -> Ends the statement.
       return;
             return -> Ends function; waits for second card.
             ; -> Ends the statement.
   state.secondPick = { element, index, card };
         state -> Game state object.
         . -> Dot operator.
         secondPick -> Stores the second selected card.
         = -> Assignment operator.
         { element, index, card } -> Object containing second card info.
         ; -> Ends the statement.
   state.moves++;
         state -> Game state object.
         . -> Dot operator.
         moves -> Move counter.
         ++ -> Increment operator; adds 1.
         ; -> Ends the statement.
   updateStatus();
         updateStatus -> Function that refreshes UI values.
         () -> Calls the function.
         ; -> Ends the statement.
   checkMatch();
         checkMatch -> Function that determines match/mismatch.
         () -> Calls the function.
         ; -> Ends the statement.

   WHAT FEEDS INTO onCardClick()
         element -> The clicked DOM element.
         index -> Position of the card in state.cards.
         state.isRunning -> Controls whether clicks are allowed.
         state.lockBoard -> Prevents rapid clicking.
         state.firstPick / state.secondPick -> Track selections.
         card.matched -> Prevents interacting with matched cards.
   WHERE onCardClick() FEEDS INTO
         state.firstPick -> Set on first click.
         state.secondPick -> Set on second click.
         state.moves -> Incremented after second pick.
         updateStatus() -> UI refresh.
         checkMatch() -> Match logic triggered.
   FULL PIPELINE
         User clicks card
         onCardClick()
         Validate: game running, board unlocked, card not matched, not same card
         Flip card visually
         If firstPick empty -> store firstPick and exit
         Else -> store secondPick
         moves++
         updateStatus()
         checkMatch()
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
   MATCH CHECKING LOGIC
   function checkMatch() { ... }
         function -> Declares a reusable block of code.
         checkMatch -> Function name I created; determines match/mismatch.
         { } -> Function body; contains all instructions executed when called.
   const first = state.firstPick;
         const -> Declares a constant variable.
         first -> Stores the first selected card.
         = -> Assignment operator.
         state -> Main game state object.
         . -> Dot operator.
         firstPick -> Object containing { element, index, card }.
         ; -> Ends the statement.
   const second = state.secondPick;
         const -> Declares a constant variable.
         second -> Stores the second selected card.
         = -> Assignment operator.
         state.secondPick -> Object containing second card info.
         ; -> Ends the statement.
   if (!first || !second) return;
         if -> Conditional statement.
         ( !first || !second ) -> Ensures both picks exist.
                - !first -> No first card selected.
                - || -> Logical OR.
                - !second -> No second card selected.
         return -> Exits early if either is missing.
         ; -> Ends the statement.
   if (first.card.value === second.card.value) {
          if -> Conditional statement.
            ( first.card.value === second.card.value ) -> Checks if symbols match.
                    - first.card.value -> Symbol of first card.
                    - === -> Strict equality operator.
                    - second.card.value -> Symbol of second card.
            { } -> Code block executed when cards MATCH.
          first.card.matched = true;
                first.card -> Card data object.
                .matched -> Boolean marking card as permanently matched.
                = true -> Marks as matched.
          second.card.matched = true;
                second.card -> Card data object.
                .matched -> Marks second card as matched.
                = true -> Sets matched state.
          first.element.classList.add("is-matched");
                first.element -> DOM element for first card.
                .classList -> List of CSS classes.
                .add("is-matched") -> Adds matched styling.
          second.element.classList.add("is-matched");
                second.element -> DOM element for second card.
                .classList.add -> Adds matched styling.
          state.pairsFound++;
                state.pairsFound -> Counter of matched pairs.
                ++ -> Increment operator.
      
          updateStatus();  -> Calls the function that refreshes all on‑screen game stats.  
                   - Updates the UI elements for:  
                       • movesValueEl → shows current move count  
                       • pairsValueEl → shows number of matched pairs  
                       • timeValueEl  → shows formatted timer ("mm:ss")  
                   -> Reads values from state (state.moves, state.pairsFound, state.seconds). Ensures the player sees the latest game information immediately after a card click or timer tick.

          resetPicks();
                resetPicks -> Clears firstPick and secondPick.
                () -> Calls the function.

    if (state.pairsFound === state.totalPairs) {
          if -> Conditional statement.
            ( state.pairsFound === state.totalPairs ) -> All pairs found.
          endGame(); }  -> endGame -> Function that stops timer + shows win message.
                    () -> Calls the function.
      return;
             return -> Ends function after successful match.
   
   state.lockBoard = true;
         state -> Game state object.
         .lockBoard -> Boolean preventing further clicks.
         = true -> Locks board until mismatch animation completes.

   setTimeout(() => { ... }, 600);
          setTimeout -> Built‑in JS function delaying execution.
          () => { ... } -> Arrow function executed after delay.
          600 -> Delay in milliseconds (0.6 seconds).
          first.element.textContent = "Card";
                first.element -> DOM element for first card.
                .textContent -> Visible text inside the card.
                = "Card" -> Resets card face.
          second.element.textContent = "Card";
                second.element -> DOM element for second card.
                .textContent -> Resets card face.
          first.element.classList.remove("is-flipped");
                first.element -> DOM element for first card.
                .classList.remove -> Removes flipped styling.
          second.element.classList.remove("is-flipped");
                second.element -> DOM element for second card.
                .classList.remove -> Removes flipped styling.
    resetPicks();  -> resetPicks -> Clears both picks for next turn.
               () -> Calls the function.
          state.lockBoard = false; -> state.lockBoard -> Unlocks board.
                           = false -> Allows clicking again.
   WHAT FEEDS INTO checkMatch()
         state.firstPick -> First selected card.
         state.secondPick -> Second selected card.
         onCardClick() -> Calls checkMatch() after second pick.
   WHERE checkMatch() FEEDS INTO
         state.pairsFound -> Updated when match occurs.
         card.matched -> Marks cards as permanently matched.
         .is-matched -> CSS class applied to matched cards.
         state.lockBoard -> Controls clickability during mismatch.
         endGame() -> Triggered when all pairs are found.
   FULL PIPELINE
         User selects two cards
         onCardClick() sets firstPick + secondPick
         checkMatch()
             If match:
                 mark matched
                 add .is-matched
                 pairsFound++
                 resetPicks()
                 if all pairs found -> endGame()
             If mismatch:
                 lockBoard = true
                 wait 600ms
                 flip cards back
                 resetPicks()
                 lockBoard = false
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

/* --------------------------------------------------
   RESET CARD PICKS
   function resetPicks() { ... }
         function -> Declares a reusable block of code.
         resetPicks -> Function name I created. Clears the selected cards.
         { } -> Function body; contains all instructions executed when called.
   state.firstPick = null;
         state -> The main game state object storing all live game data.
         . -> Dot operator used to access a property inside the state object.
         firstPick -> Stores the first selected card of the current turn.
         = -> Assignment operator.
         null -> Resets the value. Means “no card selected”.
   state.secondPick = null;
         state -> Game state object.
         . -> Dot operator.
         secondPick -> Stores the second selected card of the current turn.
         = -> Assignment operator.
         null -> Clears the second selection.
   WHAT FEEDS INTO resetPicks()
         checkMatch() -> Calls resetPicks() after match or mismatch.
         onCardClick() -> Relies on resetPicks() to prepare for next turn.
   WHERE resetPicks() FEEDS INTO
         state.firstPick -> Cleared for next turn.
         state.secondPick -> Cleared for next turn.
         Game flow -> Allows new card selections without interference.
   FULL PIPELINE
         User selects two cards
         checkMatch() runs
         resetPicks()
         firstPick = null
         secondPick = null
         Next turn begins cleanly
-------------------------------------------------- */
function resetPicks() {
  state.firstPick = null;
  state.secondPick = null;
}

/* --------------------------------------------------
   END GAME LOGIC
   function endGame() { ... }
         function -> Declares a reusable block of code.
         endGame -> Function name I created; finalises the game state.
         { } -> Function body; contains all instructions executed when called.

   state.isRunning = false;
         state -> Main game state object.
         . -> Dot operator.
         isRunning -> Boolean controlling whether gameplay is active.
         = -> Assignment operator.
         false -> Marks the game as no longer running.
         ; -> Ends the statement.

   stopTimer();
         stopTimer -> Function that halts the active timer interval.
         () -> Calls the function.
         ; -> Ends the statement.

   setFeedback(` Well done, ${state.playerName}! I finished in ${state.moves} moves and ${formatTime(state.seconds)}.`);
         setFeedback -> Function that updates the UI feedback/message area.
         ( ` ... ` ) -> Template literal for dynamic text.
         Well done -> Static congratulatory message.
         ${state.playerName} -> Inserts the player's name.
                - state -> Game state object.
                - .playerName -> Name entered by the player.
         ${state.moves} -> Inserts total number of moves.
                - state.moves -> Move counter.
         ${formatTime(state.seconds)} -> Inserts formatted time.
                - formatTime -> Converts seconds to mm:ss.
                - state.seconds -> Total elapsed seconds.
         ; -> Ends the statement.

   WHAT FEEDS INTO endGame()
         state.isRunning -> Determines if game should stop.
         stopTimer() -> Ensures timer halts.
         state.playerName -> Used in personalised message.
         state.moves -> Used in final score message.
         state.seconds -> Used to calculate final time.

   WHERE endGame() FEEDS INTO
         state.isRunning -> Game becomes inactive.
         Timer display -> Stops updating.
         Feedback UI -> Shows personalised completion message.

   FULL PIPELINE
         All pairs matched
         checkMatch() triggers endGame()
         endGame():
             isRunning = false
             stopTimer()
             setFeedback() shows personalised message
-------------------------------------------------- */
function endGame() {
  state.isRunning = false;
  stopTimer();
  setFeedback(` Well done, ${state.playerName}! You finished in ${state.moves} moves and ${formatTime(state.seconds)}.`);
}


/* --------------------------------------------------
   RESET GAME LOGIC
   function resetGame() { ... }
         function -> Declares a reusable block of code.
         resetGame -> Function name I created; restores game to initial state.
         { } -> Function body; contains all instructions executed when called.

   stopTimer();
         stopTimer -> Function that halts the active timer interval.
         () -> Calls the function.
         ; -> Ends the statement.

   state.isRunning = false;
         state -> Main game state object.
         .isRunning -> Boolean controlling whether gameplay is active.
         = false -> Marks the game as not running.
         ; -> Ends the statement.

   state.lockBoard = false;
         .lockBoard -> Prevents or allows card clicking.
         = false -> Ensures board is unlocked at reset.
         ; -> Ends the statement.

   state.cards = [];
         .cards -> Array holding all card objects.
         = [] -> Clears the deck completely.
         ; -> Ends the statement.

   state.firstPick = null;
         .firstPick -> Stores first selected card.
         = null -> Clears selection.
         ; -> Ends the statement.

   state.secondPick = null;
         .secondPick -> Stores second selected card.
         = null -> Clears selection.
         ; -> Ends the statement.

   state.moves = 0;
         .moves -> Counter of total moves.
         = 0 -> Resets to zero.
         ; -> Ends the statement.

   state.pairsFound = 0;
         .pairsFound -> Counter of matched pairs.
         = 0 -> Resets to zero.
         ; -> Ends the statement.

   state.totalPairs = 0;
         .totalPairs -> Total number of pairs in the deck.
         = 0 -> Reset until new deck is created.
         ; -> Ends the statement.

   state.seconds = 0;
         .seconds -> Timer counter in seconds.
         = 0 -> Resets timer.
         ; -> Ends the statement.

   boardEl.innerHTML = "";
         boardEl -> DOM element containing the card grid.
         .innerHTML -> Controls the element’s HTML content.
         = "" -> Clears all card elements from the board.
         ; -> Ends the statement.

   updateStatus();
         updateStatus -> Function that refreshes UI values.
         () -> Calls the function.
         ; -> Ends the statement.

   WHAT FEEDS INTO resetGame()
         stopTimer() -> Ensures timer is cleared.
         state.* -> All game state properties reset to defaults.
         boardEl -> Board container cleared.
         updateStatus() -> UI refreshed after reset.

   WHERE resetGame() FEEDS INTO
         Game start flow -> Prepares state for a new game.
         UI -> Clears board + resets counters.
         Timer -> Fully reset to zero.
         state.isRunning -> Game remains inactive until startGame() is called.

   FULL PIPELINE
         Player triggers reset
         resetGame():
             stopTimer()
             clear all state values
             clear board HTML
             updateStatus()
         Game returns to initial blank state
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
   START GAME (FORM SUBMISSION)
   function gameForm.addEventListener("submit", e => { ... })
         gameForm -> The <form> element that starts the game.
         .addEventListener -> Attaches an event listener to the form.
         ("submit", ...) -> Listens for the submit event.
         e => { ... } -> Arrow function executed when the form is submitted.
         e -> Event object representing the form submission.
         { } -> Function body; contains all instructions executed on submit.
   e.preventDefault();
         e -> Event object.
         .preventDefault -> Stops the browser’s default form submission.
         () -> Calls the method.
         ; -> Ends the statement.
   const name = playerNameEl.value.trim();
         const -> Declares a constant variable.
         name -> Stores the cleaned player name.
         = -> Assignment operator.
         playerNameEl -> Input field for player name.
         .value -> Raw text entered by the user.
         .trim() -> Removes leading/trailing whitespace.
         ; -> Ends the statement.
   const difficulty = difficultyEl.value;
         const -> Declares a constant variable.
         difficulty -> Stores selected difficulty level.
         = -> Assignment operator.
         difficultyEl -> <select> element for difficulty.
         .value -> The chosen difficulty option.
         ; -> Ends the statement.
   if (!name || !difficulty) {
          if -> Conditional statement.
          ( !name || !difficulty ) -> Validates required fields.
                  - !name -> Name field is empty.
                  - || -> Logical OR.
                  - !difficulty -> Difficulty not selected.
          { } -> Code block executed when validation fails.

        setFeedback("Please enter your name and select a difficulty.");
              setFeedback -> Function that updates the UI feedback area.
              ( "Please enter..." ) -> Error message shown to user.
              ; -> Ends the statement.

        return;
              return -> Stops execution; game does not start.
              ; -> Ends the statement.
   }
   state.playerName = name;
         state -> Main game state object.
         .playerName -> Stores the player's name.
         = name -> Saves validated name.
         ; -> Ends the statement.
   const config = DIFFICULTY[difficulty];
         const -> Declares a constant variable.
         config -> Stores difficulty configuration.
         = -> Assignment operator.
         DIFFICULTY -> Object containing difficulty presets.
         [difficulty] -> Selects config for chosen difficulty.
         ; -> Ends the statement.
   const totalCards = config.cols * config.rows;
         const -> Declares a constant variable.
         totalCards -> Total number of cards for the board.
         = -> Assignment operator.
         config.cols -> Number of columns.
         * -> Multiplication operator.
         config.rows -> Number of rows.
         ; -> Ends the statement.
   resetGame();
         resetGame -> Function that clears all game state.
         () -> Calls the function.
         ; -> Ends the statement.
   state.cards = createDeck(totalCards);
         state.cards -> Array that will hold all card objects.
         = -> Assignment operator.
         createDeck(totalCards) -> Generates a shuffled deck.
         ; -> Ends the statement.
   state.totalPairs = totalCards / 2;
         .totalPairs -> Total number of matching pairs.
         = -> Assignment operator.
         totalCards / 2 -> Calculates number of pairs.
         ; -> Ends the statement.
   state.isRunning = true;
         .isRunning -> Boolean controlling whether gameplay is active.
         = true -> Marks game as running.
         ; -> Ends the statement.
   boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
         boardEl -> DOM element containing the card grid.
         .style -> Inline style object.
         .gridTemplateColumns -> CSS grid column definition.
         = -> Assignment operator.
         `repeat(${config.cols}, 1fr)` -> Sets number of columns dynamically.
         ; -> Ends the statement.
   renderBoard();
         renderBoard -> Function that draws the cards on the board.
         () -> Calls the function.
         ; -> Ends the statement.
   updateStatus();
         updateStatus -> Function that refreshes UI values.
         () -> Calls the function.
         ; -> Ends the statement.
   startTimer();
         startTimer -> Function that begins the game timer.
         () -> Calls the function.
         ; -> Ends the statement.
   restartBtn.disabled = false;
         restartBtn -> Restart button element.
         .disabled -> Boolean controlling button usability.
         = false -> Enables restart button now that game is running.
         ; -> Ends the statement.
   setFeedback(`Game started! Good luck, ${name}.`);
         setFeedback -> Function that updates the UI feedback area.
         ( `Game started!...` ) -> Personalized start message.
         ${name} -> Inserts player's name.
         ; -> Ends the statement.
   WHAT FEEDS INTO THIS HANDLER
         gameForm -> Triggers submit event.
         playerNameEl.value -> User-entered name.
         difficultyEl.value -> Selected difficulty.
         DIFFICULTY -> Provides grid configuration.
         resetGame() -> Clears previous game state.
         createDeck() -> Generates new deck.
   WHERE THIS HANDLER FEEDS INTO
         state.playerName -> Stores player identity.
         state.cards -> Holds new deck.
         state.totalPairs -> Sets win condition.
         state.isRunning -> Enables gameplay.
         boardEl -> Updates grid layout.
         renderBoard() -> Draws cards.
         updateStatus() -> Refreshes UI.
         startTimer() -> Begins timer.
         restartBtn -> Becomes enabled.
         setFeedback() -> Shows start message.
   FULL PIPELINE
         User submits form
         preventDefault() stops page reload
         Validate name + difficulty
         If invalid:
             show feedback
             stop execution
         If valid:
             save player name
             load difficulty config
             calculate total cards
             resetGame()
             create deck
             set totalPairs
             mark game as running
             configure grid layout
             render board
             update UI
             start timer
             enable restart button
             show start message
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
   RESTART BUTTON LOGIC
   restartBtn.addEventListener("click", () => { ... })
         restartBtn -> The Restart button element.
         .addEventListener -> Attaches an event listener.
         ("click", ...) -> Listens for click events.
         () => { ... } -> Arrow function executed when clicked.
         { } -> Function body; contains all instructions executed on restart.
   const difficulty = difficultyEl.value;
         const -> Declares a constant variable.
         difficulty -> Stores selected difficulty level.
         = -> Assignment operator.
         difficultyEl -> <select> element for difficulty.
         .value -> The chosen difficulty option.
   const name = playerNameEl.value.trim();
         const -> Declares a constant variable.
         name -> Stores the cleaned player name.
         = -> Assignment operator.
         playerNameEl -> Input field for player name.
         .value -> Raw text entered by the user.
         .trim() -> Removes leading/trailing whitespace.
   if (!name || !difficulty) {
            if -> Conditional statement.
            ( !name || !difficulty ) -> Validates required fields.
                    - !name -> Name field is empty.
                    - || -> Logical OR.
                    - !difficulty -> Difficulty not selected.
            { } -> Code block executed when validation fails.
      setFeedback("Please enter your name and select a difficulty.");
             setFeedback -> Function that updates the UI feedback area.
             ( "Please enter..." ) -> Error message shown to user.
      return;  -> return -> Stops execution; restart does not proceed.
    }
   state.playerName = name;
         state -> Main game state object.
         .playerName -> Stores the player's name.
         = name -> Saves validated name.
   const config = DIFFICULTY[difficulty];
         const -> Declares a constant variable.
         config -> Stores difficulty configuration.
         = -> Assignment operator.
         DIFFICULTY -> Object containing difficulty presets.
         [difficulty] -> Selects config for chosen difficulty.
   const totalCards = config.cols * config.rows;
         const -> Declares a constant variable.
         totalCards -> Total number of cards for the board.
         = -> Assignment operator.
         config.cols -> Number of columns.
         * -> Multiplication operator.
         config.rows -> Number of rows..
   resetGame();
         resetGame -> Function that clears all game state.
         () -> Calls the function.
   state.cards = createDeck(totalCards);
         state.cards -> Array that will hold all card objects.
         = -> Assignment operator.
         createDeck(totalCards) -> Generates a shuffled deck.
   state.totalPairs = totalCards / 2;
         .totalPairs -> Total number of matching pairs.
         = -> Assignment operator.
         totalCards / 2 -> Calculates number of pairs.
   state.isRunning = true;
         .isRunning -> Boolean controlling whether gameplay is active.
         = true -> Marks game as running.
   boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
         boardEl -> DOM element containing the card grid.
         .style -> Inline style object.
         .gridTemplateColumns -> CSS grid column definition.
         = -> Assignment operator.
         `repeat(${config.cols}, 1fr)` -> Sets number of columns dynamically.
   renderBoard();
         renderBoard -> Function that draws the cards on the board.
         () -> Calls the function.
   updateStatus();
         updateStatus -> Function that refreshes UI values.
         () -> Calls the function.
   startTimer();
         startTimer -> Function that begins the game timer.
         () -> Calls the function.
   setFeedback(`Restarted! Good luck, ${name}.`);
         setFeedback -> Function that updates the UI feedback area.
         ( `Restarted!...` ) -> Personalized restart message.
         ${name} -> Inserts player's name.

   WHAT FEEDS INTO THIS HANDLER
         restartBtn -> Triggers click event.
         playerNameEl.value -> User-entered name.
         difficultyEl.value -> Selected difficulty.
         DIFFICULTY -> Provides grid configuration.
         resetGame() -> Clears previous game state.
         createDeck() -> Generates new deck.
   WHERE THIS HANDLER FEEDS INTO
         state.playerName -> Stores player identity.
         state.cards -> Holds new deck.
         state.totalPairs -> Sets win condition.
         state.isRunning -> Enables gameplay.
         boardEl -> Updates grid layout.
         renderBoard() -> Draws cards.
         updateStatus() -> Refreshes UI.
         startTimer() -> Begins timer.
         setFeedback() -> Shows restart message.
   FULL PIPELINE
         User clicks Restart
         Validate name + difficulty
         If invalid:
             show feedback
             stop execution
         If valid:
             save player name
             load difficulty config
             calculate total cards
             resetGame()
             create deck
             set totalPairs
             mark game as running
             configure grid layout
             render board
             update UI
             start timer
             show restart message
-------------------------------------------------- */
restartBtn.addEventListener("click", () => {
  const difficulty = difficultyEl.value;
  const name = playerNameEl.value.trim();
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
   INITIAL UI STATE
   updateStatus();
         updateStatus -> Function that refreshes all UI indicators.
         () -> Calls the function immediately on page load.
         ; -> Ends the statement.

   setFeedback("Enter your name and select a difficulty to start.");
         setFeedback -> Function that updates the feedback/message area.
         ( "Enter your name..." ) -> Initial instruction shown to the user.
         ; -> Ends the statement.

   WHAT FEEDS INTO THIS BLOCK
         updateStatus() -> Reads current state values (all zeroed at load).
         setFeedback() -> Displays initial guidance message.

   WHERE THIS BLOCK FEEDS INTO
         UI -> Shows default counters and instructions.
         Game flow -> Prepares user for form submission.

   FULL PIPELINE
         Page loads
         updateStatus() sets UI counters to default
         setFeedback() shows initial instructions
         User is prompted to enter name + difficulty
-------------------------------------------------- */
updateStatus();
setFeedback("Enter your name and select a difficulty to start.");
