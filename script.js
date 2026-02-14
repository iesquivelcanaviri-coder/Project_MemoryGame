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
  easy: { cols: 2, rows: 3 },
  medium: { cols: 3, rows: 4 },
  hard: { cols: 4, rows: 4 }
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
   HELPER FUNCTIONS
--------------------------------------------------
   function shuffle(array) { ... }
         function -> Declares a reusable block of code.
         shuffle -> Function name YOU created; randomizes an array.
         (array) -> Parameter; the array of items to shuffle.
         { } -> Function body.
   return array.sort(() => Math.random() - 0.5);
         return -> Sends the shuffled array back to the caller.
         array.sort(...) -> Built‑in JS method that reorders items.
         () => Math.random() - 0.5
                - Arrow function used as a random comparator.
                - Math.random() returns a number between 0 and 1.
                - Subtracting 0.5 gives positive/negative values.
                - This randomness shuffles the array.
         ; -> Ends the statement.
--------------------------------------------------
   function formatTime(seconds) { ... }
         function -> Declares a reusable block of code.
         formatTime -> Converts raw seconds into "mm:ss" format.
         (seconds) -> Total elapsed time in seconds.
         { } -> Function body.
   const m = String(Math.floor(seconds / 60)).padStart(2, "0");
         Math.floor(seconds / 60) -> Converts seconds to whole minutes.
         String(...) -> Converts number to string.
         .padStart(2, "0") -> Ensures 2‑digit formatting (e.g., "03").
   const s = String(seconds % 60).padStart(2, "0");
         seconds % 60 -> Remaining seconds after removing full minutes.
         padStart -> Ensures seconds also have 2 digits.
   return `${m}:${s}`;
         Template literal combining minutes + seconds.
         Produces final time string like "04:27".
         ; -> Ends the statement.
--------------------------------------------------
   function setFeedback(message) { ... }
         function -> Declares a reusable block of code.
         setFeedback -> Updates the feedback area on the screen.
         (message) -> The text to display to the player.
         { } -> Function body.
   feedbackEl.textContent = message;
         feedbackEl -> DOM element where messages appear.
         .textContent -> Sets the visible text inside that element.
         message -> The string passed into the function.
         ; -> Ends the statement.
--------------------------------------------------
   WHAT FEEDS INTO THESE FUNCTIONS
         shuffle() -> Called by createDeck() to randomize cards.
         formatTime() -> Called by updateStatus() to display timer.
         setFeedback() -> Called by form submit, endGame(), errors.
   WHERE THESE FUNCTIONS FEED INTO
         shuffle() -> Feeds randomized deck into state.cards.
         formatTime() -> Feeds formatted time into the UI.
         setFeedback() -> Feeds messages into the feedback display.
   FULL PIPELINE
         createDeck() builds card pairs
         shuffle() randomizes them
         startTimer() increments seconds
         updateStatus() calls formatTime()
         setFeedback() displays instructions + results
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
   CREATE DECK — BUILDS ALL CARD OBJECTS FOR THE GAME
         - Dynamically generates card pairs based on difficulty.
         - Ensures each symbol appears exactly twice.
         - Returns a fully shuffled deck ready for rendering.
--------------------------------------------------
   function createDeck(totalCards) { ... }
         function -> Declares a reusable block of code.
         createDeck -> Function name YOU created; builds the card deck.
         (totalCards) -> Number of cards required for the chosen difficulty.
         { } -> Function body containing all instructions.

   const values = SYMBOLS.slice(0, totalCards / 2);
         const -> Declares a constant (cannot be reassigned).
         values -> Array of unique symbols used for this game.
         SYMBOLS -> Master list of all possible card symbols.
         .slice(0, totalCards / 2)
                - Extracts only the number of symbols needed.
                - Example: 12 cards → 6 unique symbols.
         ; -> Ends the statement.

   const deck = [];
         deck -> Empty array that will store all card objects.
         [] -> Empty array literal.
         ; -> Ends the statement.

   values.forEach(value => { ... });
         values -> Array of unique symbols.
         .forEach(...) -> Loops through each symbol.
         value -> Current symbol in the loop.
         => -> Arrow function.

      deck.push({ value, matched: false });
             deck.push -> Adds a new card object to the deck.
             { value, matched: false }
                    - value -> The symbol shown when flipped.
                    - matched: false -> Card starts unmatched.

      deck.push({ value, matched: false });
             Adds the second copy of the same symbol.
             Ensures each symbol appears exactly twice.

   return shuffle(deck);
         return -> Sends the final deck back to the caller.
         shuffle(deck) -> Randomizes card order.
         ; -> Ends the statement.

   WHAT FEEDS INTO createDeck()
         • Difficulty selection -> Determines totalCards.
         • SYMBOLS -> Provides the available card values.

   WHERE createDeck() FEEDS INTO
         • state.cards -> Stores the full deck.
         • renderBoard() -> Uses the deck to draw the grid.
         • checkMatch() -> Reads card.value for comparisons.

   FULL PIPELINE
         User selects difficulty
         totalCards = cols * rows
         createDeck(totalCards)
         → Generate unique values
         → Duplicate each value
         → Build card objects
         → Shuffle deck
         state.cards = shuffled deck
         renderBoard() draws the cards
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
   RENDER BOARD — DRAWS ALL CARD BUTTONS ON SCREEN
         - Fully dynamic board creation based on difficulty.
         - Clears old board before rendering a new one.
         - Attaches click handlers to every card button.
--------------------------------------------------
   function renderBoard() { ... }
         function -> Declares a reusable block of code.
         renderBoard -> Function name YOU created; builds the visual board.
         { } -> Function body containing all instructions.

   boardEl.innerHTML = "";
         boardEl -> DOM element representing the game board grid.
         .innerHTML -> Property that controls the element’s HTML content.
         = "" -> Clears all previous cards from the board.
         ; -> Ends the statement.

   state.cards.forEach((card, index) => { ... });
         state -> Game state object.
         .cards -> Array of card objects created by createDeck().
         .forEach(...) -> Loops through each card in the deck.
         (card, index) -> card = card object, index = card position.
         => -> Arrow function.

      const btn = document.createElement("button");
             const -> Declares a constant variable.
             btn -> New button element representing a single card.
             document.createElement("button")
                    - Creates a <button> element in the DOM.

      btn.className = "card";
             .className -> Sets the CSS class for styling.
             "card" -> Base class used for all card buttons.

      btn.textContent = "Card";
             .textContent -> Sets visible text inside the button.
             "Card" -> Placeholder text until flipped.

      btn.dataset.index = index;
             .dataset -> Stores custom data attributes.
             .index -> Custom attribute used to track card position.
             index -> The card’s index in state.cards.

      btn.addEventListener("click", () => onCardClick(btn, index));
             addEventListener -> Attaches an event listener.
             "click" -> Event type.
             () => onCardClick(btn, index)
                    - Arrow function calling your click handler.
                    - Passes the button + index to onCardClick().

      boardEl.appendChild(btn);
             appendChild -> Adds the button to the game board.
             btn -> The card button created above.

--------------------------------------------------
   WHAT FEEDS INTO renderBoard()
         • state.cards -> Contains all card objects.
         • createDeck() -> Generates the deck.
         • Difficulty selection -> Determines board size.

   WHERE renderBoard() FEEDS INTO
         • onCardClick() -> Handles card flipping.
         • CSS Grid -> Uses gridTemplateColumns for layout.
         • Game UI -> Displays all cards to the player.

   FULL PIPELINE
         resetGame()
         createDeck(totalCards)
         state.cards = shuffled deck
         renderBoard()
         → Clear old board
         → Create button for each card
         → Attach click listeners
         → Display grid on screen
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
   CARD CLICK HANDLER — PROCESSES EACH CARD FLIP
         - Prevents invalid clicks (same card, matched card, rapid clicks).
         - Stores first and second picks for match checking.
         - Updates move counter automatically.
--------------------------------------------------
   function onCardClick(element, index) { ... }
         function -> Declares a reusable block of code.
         onCardClick -> Function name YOU created; handles card flipping.
         (element, index) -> element = clicked button, index = card position.
         { } -> Function body containing all instructions.

   if (!state.isRunning) return;
         state -> Game state object.
         .isRunning -> Boolean controlling whether gameplay is active.
         !state.isRunning -> If game has not started, ignore clicks.
         return -> Exits the function immediately.

   if (state.lockBoard) return;
         state.lockBoard -> Prevents clicks during mismatch animation.
         return -> Stops further processing.

   const card = state.cards[index];
         const -> Declares a constant variable.
         card -> The card object at the clicked index.
         state.cards -> Array of all card objects.
         [index] -> Retrieves the specific card.

   if (card.matched) return;
         Prevents flipping a card that is already matched.

   if (state.firstPick && state.firstPick.index === index) return;
         Prevents clicking the SAME card twice in one turn.
         state.firstPick -> First selected card.
         .index -> Position of that card.

   element.textContent = card.value;
         element -> The button representing the card.
         .textContent -> Shows the card’s symbol.
         card.value -> The symbol stored in the card object.

   element.classList.add("is-flipped");
         .classList -> List of CSS classes on the element.
         .add("is-flipped") -> Applies flipped styling.

   if (!state.firstPick) {
         Checks if this is the FIRST card of the turn.

      state.firstPick = { element, index, card };
             Stores the first selected card’s:
                - element (button)
                - index (position)
                - card (data object)
      return;
             Ends function; waits for second card.
   }

   state.secondPick = { element, index, card };
         Stores the second selected card.

   state.moves++;
         state.moves -> Move counter.
         ++ -> Increment operator; adds 1 move.

   updateStatus();
         updateStatus -> Refreshes UI (moves, pairs, time).

   checkMatch();
         checkMatch -> Compares firstPick and secondPick.
         Determines match or mismatch.
--------------------------------------------------
   WHAT FEEDS INTO onCardClick()
         • renderBoard() -> Creates the clickable buttons.
         • state.cards -> Provides card data.
         • state.isRunning -> Ensures game has started.
         • state.lockBoard -> Prevents rapid clicking.

   WHERE onCardClick() FEEDS INTO
         • state.firstPick / state.secondPick -> Stores selections.
         • updateStatus() -> Updates move counter.
         • checkMatch() -> Determines match logic.
         • UI -> Flips cards visually.

   FULL PIPELINE
         Player clicks a card
         onCardClick() runs
         → Validate click
         → Flip card visually
         → Store firstPick or secondPick
         If secondPick:
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
   MATCH CHECKING — COMPARES THE TWO SELECTED CARDS
         - Handles both match and mismatch logic.
         - Locks the board during animations to prevent rapid clicking.
         - Updates pairsFound and triggers endGame() when complete.
--------------------------------------------------
   function checkMatch() { ... }
         function -> Declares a reusable block of code.
         checkMatch -> Function name YOU created; evaluates card matches.
         { } -> Function body containing all instructions.

   const first = state.firstPick;
   const second = state.secondPick;
         const -> Declares read‑only variables.
         first / second -> Objects storing:
                - element (button)
                - index (position)
                - card (data object)
         state.firstPick / state.secondPick -> Values set in onCardClick().

   if (!first || !second) return;
         Guard clause:
                - If either pick is missing, exit early.
                - Prevents errors if function is called too soon.
         return -> Stops execution.

   if (first.card.value === second.card.value) {
         Compares the symbols of both selected cards.
         If equal → MATCH FOUND.

      first.card.matched = true;
      second.card.matched = true;
             Marks both card objects as permanently matched.

      first.element.classList.add("is-matched");
      second.element.classList.add("is-matched");
             Adds matched styling to both card buttons.

      state.pairsFound++;
             Increments number of matched pairs.

      updateStatus();
             Refreshes UI (pairs, moves, time).

      resetPicks();
             Clears firstPick and secondPick for next turn.

      if (state.pairsFound === state.totalPairs) {
             Checks if all pairs are matched.
             If yes → Game is finished.
         endGame();
      }

      return;
             Ends function after handling match.
   }

   state.lockBoard = true;
         No match → Temporarily disable clicking.
         Prevents flipping more cards during animation.

   setTimeout(() => {
         setTimeout -> Delays execution for mismatch animation.
         600 -> Delay in milliseconds (0.6 seconds).

      first.element.textContent = "Card";
      second.element.textContent = "Card";
             Resets card text back to placeholder.

      first.element.classList.remove("is-flipped");
      second.element.classList.remove("is-flipped");
             Removes flipped styling.

      resetPicks();
             Clears stored selections.

      state.lockBoard = false;
             Re‑enables clicking after animation.
   }, 600);

--------------------------------------------------
   WHAT FEEDS INTO checkMatch()
         • onCardClick() -> Sets firstPick and secondPick.
         • state.cards -> Provides card values.
         • state.lockBoard -> Prevents premature clicks.

   WHERE checkMatch() FEEDS INTO
         • state.pairsFound -> Increases on match.
         • updateStatus() -> Updates UI.
         • endGame() -> Called when all pairs are matched.
         • resetPicks() -> Clears selections for next turn.

   FULL PIPELINE
         Player selects two cards
         onCardClick() stores firstPick + secondPick
         checkMatch()
         → If match:
               mark matched
               updateStatus()
               resetPicks()
               if all pairs found → endGame()
         → If mismatch:
               lockBoard = true
               flip cards back after delay
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
    resetPicks() — FUNCTION DECLARATION + INTERNAL ACTIONS
       • resetPicks() is a function declaration.
       • Inside it are two assignments that clear temporary selection data.
--------------------------------------------------
   function resetPicks() { ... }
         function -> Declares a reusable block of code.
         resetPicks -> Function name YOU created; clears stored selections.
         { } -> Function body containing all instructions.

   state.firstPick = null;
         state -> Game state object.
         .firstPick -> Stores the first selected card of the turn.
         = -> Assignment operator.
         null -> Removes the stored card reference.
                 Means “no first card selected”.
         ; -> Ends the statement.

   state.secondPick = null;
         .secondPick -> Stores the second selected card of the turn.
         null -> Clears the second selection.
         ; -> Ends the statement.

   WHY resetPicks() IS NEEDED
         • Prevents leftover card data from previous turns.
         • Ensures checkMatch() always works with fresh values.
         • Allows the next pair of flips to be processed correctly.

   WHAT FEEDS INTO resetPicks()
         • checkMatch() -> Calls resetPicks() after match or mismatch.
         • onCardClick() -> Relies on cleared picks for next turn.

   WHERE resetPicks() FEEDS INTO
         • onCardClick() -> Allows new firstPick to be set.
         • checkMatch() -> Ensures no stale data remains.
         • Game flow -> Resets turn cycle.

   FULL PIPELINE
         Player flips two cards
         checkMatch() runs
         → If match: mark matched, update UI, resetPicks()
         → If mismatch: flip back, resetPicks()
         Next turn begins with clean state
-------------------------------------------------- */
function resetPicks() {
  state.firstPick = null;
  state.secondPick = null;
}

/* --------------------------------------------------
   STATUS + TIMER — UPDATES UI + CONTROLS GAME CLOCK
     • All three are function declarations.
     • Inside them are assignments, DOM updates, and function invocations.
     • No objects are created here — only state updates and timer control.
--------------------------------------------------
   function updateStatus() { ... }
         function -> Declares a reusable block of code.
         updateStatus -> Function name YOU created; refreshes UI values.
         { } -> Function body containing all instructions.
   movesValueEl.textContent = state.moves;
         movesValueEl -> DOM element showing number of moves.
         .textContent -> Updates visible text.
         state.moves -> Current move count.
   pairsValueEl.textContent = state.pairsFound;
         pairsValueEl -> DOM element showing matched pairs.
         state.pairsFound -> Number of pairs found so far.
   timeValueEl.textContent = formatTime(state.seconds);
         timeValueEl -> DOM element showing formatted time.
         formatTime(...) -> Converts seconds to "mm:ss".
         state.seconds -> Total elapsed time.
--------------------------------------------------
   function startTimer() { ... }
         function -> Declares a reusable block of code.
         startTimer -> Function name YOU created; starts the game timer.
         { } -> Function body.
   clearInterval(state.timer);
         clearInterval -> Stops any existing interval.
         state.timer -> Interval ID stored in game state.
         Prevents multiple timers from stacking.
   state.timer = setInterval(() => { ... }, 1000);
         state -> Game state object.
         .timer -> Stores the new interval ID.
         = -> Assignment operator.
         setInterval(...) -> Runs code repeatedly every X ms.
         () => { ... } -> Arrow function executed every second.
         1000 -> Delay in milliseconds (1 second).
      state.seconds++;
             state.seconds -> Tracks elapsed time.
             ++ -> Adds 1 second each tick.
      updateStatus();
             Refreshes UI so timer display updates live.
--------------------------------------------------
   function stopTimer() { ... }
         function -> Declares a reusable block of code.
         stopTimer -> Function name YOU created; stops the timer.
         { } -> Function body.
   clearInterval(state.timer);
         Stops the active interval immediately.
   state.timer = null;
         Clears the stored interval ID.
         null -> Indicates “no active timer”.
         Ensures startTimer() can safely create a new one.
--------------------------------------------------
   WHAT FEEDS INTO THESE FUNCTIONS
         • startTimer() -> Called when game begins.
         • stopTimer() -> Called when game ends or resets.
         • updateStatus() -> Called after moves, pairs, or seconds change.
   WHERE THESE FUNCTIONS FEED INTO
         • UI updates -> Moves, pairs, and time display.
         • Game flow -> Timer increments drive the clock.
         • endGame() -> Uses final time from state.seconds.
   FULL PIPELINE
         startTimer()
         → clearInterval(oldTimer)
         → create new setInterval
         Every 1 second:
             state.seconds++
             updateStatus()
             timeValueEl updates
         stopTimer()
         → clearInterval(state.timer)
         → state.timer = null
-------------------------------------------------- */
function updateStatus() {
  movesValueEl.textContent = state.moves;
  pairsValueEl.textContent = state.pairsFound;
  timeValueEl.textContent = formatTime(state.seconds);
}

function startTimer() {
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.seconds++;
    updateStatus();
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timer);
  state.timer = null;
}

/* --------------------------------------------------
   endGame() — FUNCTION DECLARATION + INTERNAL ACTIONS

   • function endGame() { ... }
       - Type: Function declaration — defines a reusable function named endGame.
       - Role: Stops the game and shows the final results to the player.

   • Inside the { ... } block:
       - state.isRunning = false — assignment; marks the game as no longer active.
       - stopTimer() — function call; stops the timer immediately.
       - setFeedback(...) — function call; displays a final message including:
            • player name (state.playerName)
            • total moves (state.moves)
            • formatted time (formatTime(state.seconds))
       - All inner lines are assignments or function invocations, not objects.

   SUMMARY:
       • endGame() is a function declaration.
       • Inside it: one assignment + two function calls.
       • Purpose: cleanly stop the game and show the final score.
-------------------------------------------------- */
function endGame() {
  state.isRunning = false;
  stopTimer();
  setFeedback(`Well done, ${state.playerName}! You finished in ${state.moves} moves and ${formatTime(state.seconds)}.`);
}

/* --------------------------------------------------
     resetGame() — FUNCTION DECLARATION + INTERNAL ACTIONS
         • resetGame() is a function declaration.
       • Inside it are assignments (changing state values) and function calls.
       • Nothing inside is an object — they are state updates + invocations.
--------------------------------------------------
   function resetGame() { ... }
         function -> Declares a reusable block of code.
         resetGame -> Function name YOU created; resets the entire game.
         { } -> Function body containing all instructions.

   stopTimer();
         stopTimer -> Halts the active timer interval.
         Ensures no time continues counting during reset.

   state.isRunning = false;
         state -> Game state object.
         .isRunning -> Controls whether gameplay is active.
         false -> Game is not currently running.

   state.lockBoard = false;
         .lockBoard -> Prevents clicks during animations.
         false -> Re‑enables clicking for the next game.

   state.cards = [];
         .cards -> Array storing all card objects.
         [] -> Clears the deck completely.

   state.firstPick = null;
         .firstPick -> First selected card.
         null -> No card selected.

   state.secondPick = null;
         .secondPick -> Second selected card.
         null -> Clears second selection.

   state.moves = 0;
         .moves -> Move counter.
         0 -> Reset to zero.

   state.pairsFound = 0;
         .pairsFound -> Number of matched pairs.
         0 -> Reset to zero.

   state.totalPairs = 0;
         .totalPairs -> Set later based on difficulty.
         0 -> Placeholder until new game starts.

   state.seconds = 0;
         .seconds -> Timer value.
         0 -> Timer resets to zero.

   boardEl.innerHTML = "";
         boardEl -> DOM element for the game board.
         .innerHTML = "" -> Removes all card buttons from the UI.

   updateStatus();
         updateStatus -> Refreshes UI elements:
                - moves
                - pairs
                - time
         Ensures the screen shows a clean reset state.

--------------------------------------------------
   WHAT FEEDS INTO resetGame()
         • stopTimer() -> Ensures timer is not running.
         • Difficulty selection -> New values applied after reset.
         • Form submit -> Calls resetGame() before starting new game.

   WHERE resetGame() FEEDS INTO
         • startTimer() -> Starts fresh after reset.
         • renderBoard() -> Draws a new board.
         • state -> All values reset for a clean game.

   FULL PIPELINE
         Player starts a new game
         resetGame()
         → stopTimer()
         → clear all state values
         → clear board UI
         → updateStatus()
         New game begins with fresh state
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
An event listener with an anonymous callback function
  START GAME (FORM SUBMIT) — INITIALIZES A NEW GAME
   1. gameForm.addEventListener("submit", ...)
      • Type: Event listener — watches for the "submit" event on the form.
      • Meaning: “When the form is submitted, run the callback function.”

   2. e => { ... }
      • Type: Anonymous arrow function — a function with no name.
      • Role: Callback function — executed automatically when the event fires.
      • Not an object, not a method, not a function declaration.

   3. Inside the { ... } block (the callback body)
      • e.preventDefault() — function call; stops page reload.
      • resetGame() — function call; clears previous game state.
      • renderBoard() — function call; draws the cards.
      • startTimer() — function call; starts the timer.
      • setFeedback(...) — function call; updates the message.
      • All of these are function invocations (executing functions), not objects.

   SUMMARY OF THE STRUCTURE:
      Event Listener
         → contains an Arrow Function (callback)
             → contains Function Calls + Logic
--------------------------------------------------
   gameForm.addEventListener("submit", e => { ... })
         gameForm -> The <form> element containing name + difficulty.
         .addEventListener -> Listens for a specific event.
         "submit" -> Triggered when the form is submitted.
         e -> Event object representing the form submission.
         => -> Arrow function handling the event.
         { } -> Function body containing all instructions.
   e.preventDefault();
         preventDefault -> Stops the form from reloading the page.
         Allows full control using JavaScript instead.
   const name = playerNameEl.value.trim();
         const -> Declares a constant variable.
         name -> Stores the player's name.
         playerNameEl -> Input field for the player's name.
         .value -> Gets the text typed by the user.
         .trim() -> Removes extra spaces.
   const difficulty = difficultyEl.value;
         difficultyEl -> <select> element for difficulty.
         .value -> The chosen difficulty option.
   if (!name || !difficulty) {
         Guard clause:
              - If name is empty OR difficulty not selected,
                show error and stop.
      setFeedback("Please enter your name and select a difficulty.");
      return;
   }
   const config = DIFFICULTY[difficulty];
         DIFFICULTY -> Object storing rows/cols for each difficulty.
         [difficulty] -> Accesses the chosen difficulty settings.
         config -> Contains { rows, cols }.
   const totalCards = config.cols * config.rows;
         Calculates total number of cards for the board.
   resetGame();
         Fully clears previous game state.
         Ensures a clean start.
   state.playerName = name;
         Stores player name in game state.
   state.cards = createDeck(totalCards);
         createDeck -> Generates + shuffles card objects.
         state.cards -> Stores the full deck.
   state.totalPairs = totalCards / 2;
         Calculates how many pairs must be matched.
   state.isRunning = true;
         Enables gameplay.
         Allows card clicks to be processed.
   boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
         boardEl -> DOM element for the game board.
         .style.gridTemplateColumns -> Sets number of columns.
         Makes board layout match difficulty.
   renderBoard();
         Dynamically creates card buttons on the screen.
   startTimer();
         Begins the game clock.
   restartBtn.disabled = false;
         Enables restart button once game begins.
   setFeedback(`Game started! Good luck, ${name}.`);
         Displays a friendly start message to the player.
--------------------------------------------------
   WHAT FEEDS INTO THIS EVENT
         • Form inputs (name + difficulty)
         • DIFFICULTY config object
         • resetGame() -> Clears old state
         • createDeck() -> Builds new deck
   WHERE THIS EVENT FEEDS INTO
         • state -> Updates playerName, cards, totalPairs, isRunning
         • renderBoard() -> Draws the board
         • startTimer() -> Starts the clock
         • UI -> Updates layout + feedback message
   FULL PIPELINE
         User submits form
         preventDefault()
         Validate name + difficulty
         Load difficulty config
         totalCards = rows * cols
         resetGame()
         state.playerName = name
         state.cards = createDeck(totalCards)
         state.totalPairs = totalCards / 2
         state.isRunning = true
         Set board layout
         renderBoard()
         startTimer()
         Enable restart button
         Show “Game started!” message
-------------------------------------------------- */
gameForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = playerNameEl.value.trim();
  const difficulty = difficultyEl.value;

  if (!name || !difficulty) {
    setFeedback("Please enter your name and select a difficulty.");
    return;
  }

  const config = DIFFICULTY[difficulty];
  const totalCards = config.cols * config.rows;

  resetGame();

  state.playerName = name;
  state.cards = createDeck(totalCards);
  state.totalPairs = totalCards / 2;
  state.isRunning = true;

  boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

  renderBoard();
  startTimer();
  restartBtn.disabled = false;

  setFeedback(`Game started! Good luck, ${name}.`);
});

/* --------------------------------------------------
   RESTART BUTTON —  RESTART BUTTON — FUNCTION INVOCATION VIA EVENT LISTENER
         - Uses form submission logic to rebuild the game cleanly.
         - Ensures restart behaves EXACTLY like starting a new game.
         - Avoids duplicated logic by reusing the existing submit handler.
--------------------------------------------------
   restartBtn.addEventListener("click", () => { ... })
         restartBtn -> The Restart button element in the UI.
         .addEventListener -> listens for a click on the restart button.
         "click" -> Triggered when the user presses the Restart button.
         () => { ... } -> Arrow function executed when the button is clicked.
         { } -> Function body containing all instructions.
   gameForm.dispatchEvent(new Event("submit"));  manually triggers the form's submit event.
         gameForm -> The form that normally starts the game.
         .dispatchEvent(...) -> Manually triggers an event.
         new Event("submit") -> creates a synthetic submit event identical to a real form submission.
                - Creates a synthetic "submit" event.
                - Behaves exactly like the user submitted the form.
         This reuses:
                • Validation
                • Deck creation
                • Board rendering
                • Timer start
                • State reset
         Ensures restart is consistent with starting a new game.
--------------------------------------------------
   WHAT FEEDS INTO THE RESTART BUTTON
         • gameForm submit handler -> Contains all start logic.
         • Difficulty + name already entered.
         • resetGame() -> Called automatically via submit.
   WHERE THE RESTART BUTTON FEEDS INTO
         • Full game initialization pipeline.
         • startTimer() -> Starts fresh timer.
         • renderBoard() -> Draws new board.
         • state -> Fully refreshed values.
   FULL PIPELINE
         User clicks Restart
         restartBtn listener fires
         → dispatchEvent("submit")
         → Form submit handler runs
         → resetGame()
         → createDeck()
         → renderBoard()
         → startTimer()
         → Show “Game started!” message
-------------------------------------------------- */
restartBtn.addEventListener("click", () => {
  gameForm.dispatchEvent(new Event("submit"));
});

/* --------------------------------------------------
   INITIAL UI STATE — SETS UP THE SCREEN BEFORE GAME STARTS
   FUNCTION INVOCATIONS
   A function invocation is a command that EXECUTES a function defined earlier.
     • Function declaration — standard function defined with "function name()".
     • Function expression — function stored in a variable.
     • Arrow function — shorter syntax using () => {}.
     • Method — function stored inside an object.
     • Constructor function — used with "new" to create objects.
     • Callback function — passed into another function to be run later.
     • Async function — handles asynchronous operations with await.
     • Generator function — produces values one at a time using yield.
   Why these are "invocation statements":
     • Ends with a semicolon — makes it a complete statement.
     • Executes a function — runs the code inside it.
     • Technically a "call expression statement" — a function call used as a standalone instruction.
   Types of statements in JavaScript:
     • Variable declarations — let/const/var create variables.
     • Assignment statements — x = 5 assigns a value.
     • Return statements — return sends a value back.
     • Conditional statements — if/else control logic.
     • Loop statements — for/while repeat actions.
     • Expression statements — any expression used as a statement.
     • Call expression statements — specifically a function call as a statement.
--------------------------------------------------

   updateStatus();
         updateStatus -> Refreshes all UI counters:
                • moves (starts at 0)
                • pairs found (starts at 0)
                • time (00:00)
         Ensures the interface shows a clean, neutral state.

   setFeedback("Enter your name and select a difficulty to start.");
         setFeedback -> Updates the feedback message area.
         "Enter your name and select a difficulty to start."
                - Instruction shown when the page first loads.
                - Guides the player on what to do next.
         Helps create a clear starting point for the user.

--------------------------------------------------
   WHAT FEEDS INTO INITIAL UI STATE
         • Page load -> This runs immediately when script loads.
         • updateStatus() -> Uses default state values.
         • setFeedback() -> Displays initial instructions.

   WHERE INITIAL UI STATE FEEDS INTO
         • Form submission -> Player enters name + difficulty.
         • Game start -> Once form is submitted, UI updates again.
         • User experience -> Provides clarity before gameplay.

   FULL PIPELINE
         Page loads
         updateStatus() sets moves/pairs/time to 0
         setFeedback() shows starting instructions
         User enters name + difficulty
         Game begins
-------------------------------------------------- */
updateStatus();
setFeedback("Enter your name and select a difficulty to start.");