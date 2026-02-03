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

/* --------------------------------------------------
Array:   
• const → variable name cannot change; content can be used/read.
          • SYMBOLS → variable name YOU created; stores card symbols.
          • = → assignment operator (“store right side into left side”).
          • "ABCDEFGHJKLMNPQRSTUVWXYZ" → string of all card letters.
          • .split("") → splits string into individual characters.
              "" = split between every character.
              Example: "ABC".split("") → ["A","B","C"]
          • RESULT → SYMBOLS becomes ["A","B","C","D","E","F", ...]
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
       slice() → choose symbols
       duplicate → create pairs
       shuffle → randomize
       createDeck() → build card objects
       state.cards → store in game state
       renderBoard() → draw cards
       player sees the cards
   Creates an array of symbols by splitting a string. Not part of the DOM.
   Used to select symbols, duplicate them into pairs, shuffle them, and
   build the card objects stored in state.cards, which renderBoard() displays.
-------------------------------------------------- */
const SYMBOLS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

/* --------------------------------------------------
  GAME STATE OBJECT
   let state = { ... };
      • let → declares a variable whose value CAN change later.
      • state → variable name YOU created; stores all live game data.
      • = → assignment operator (“store right side into left side”).
      • { } → curly braces create an OBJECT (key–value pairs).
      • ; → ends the statement.
  PROPERTIES INSIDE THE OBJECT
      • isRunning: false → controls whether gameplay is allowed.
          - Boolean (true/false). Tracks whether the game is currently active.
      • cards: []    - Empty ARRAY (square brackets = array).  Will later store all card objects created by createDeck().
      • firstPick: null  - Stores the first selected card during a turn.
      • secondPick: null  - Stores the second selected card.
      • moves: 0     - Counts how many turns the player has taken.
      • pairsFound: 0   - Increases when a matching pair is found.
      • totalPairs: 0   - Set at game start based on difficulty (totalCards / 2).
      • seconds: 0    - Tracks elapsed time.
      • timer  - Will store the setInterval() ID so the timer can be stopped.

  HOW state FEEDS INTO THE GAME (DATA FLOW)
   1) Game start:
        state.cards = createDeck(totalCards);
        state.totalPairs = totalCards / 2;
        state.seconds = 0;
        state.moves = 0;
   2) renderBoard():
        reads state.cards to draw each card.
   3) onCardClick():
        updates firstPick, secondPick, moves.
   4) checkMatch():
        updates matched cards and pairsFound.
   5) startTimer():
        updates state.seconds every second.
   6) updateStatus():
        reads moves, pairsFound, seconds and updates the UI.
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
/* 
   Shuffle array randomly
   function  - Declares a reusable function.
   shuffle   - name I created. Describes what the function does: shuffles an array.
   (array) - Parameter name I chose.  “array” represents whatever array is passed into the function.
           - It is NOT a keyword — just a variable name.
   {  -  Starts the function body (the code that runs when called).
   return  - Keyword that sends a value OUT of the function.
           - Whatever follows return becomes the function’s output.
   array.sort(...)  - array is The parameter passed into the shuffle function. It represents the list of items you want to shuffle.
                    - Calls the built‑in Array method .sort().
                    - .sort() rearranges items in the array. 
                    - Normally .sort() sorts alphabetically, BUT: when given a comparison function, it sorts based on that function.
   ()  - Parentheses for passing a function into .sort().
   () => ...  - An arrow function. A short way to write a function with no name. it returns whatever expression is on the right side.
    Math.random()    -Returns a random number between 0 and 1.
   () => Math.random() - 0.5
            - Math.random() - 0.5 → produces a positive or negative number.
            - Positive → swap items.
            - Negative → keep order.
            - This randomness creates a shuffled array.
  
   The function receives ONE input:
     - array → the deck of card values created in createDeck() Example:   shuffle(["A","A","B","B","C","C"])

   WHERE shuffle() FEEDS INTO (OUTPUT FLOW)
   1) createDeck(totalCards)
        → calls shuffle(deck)
        → receives the shuffled deck back
   2) state.cards = createDeck(totalCards)
        → the shuffled deck is stored in the game state
   3) renderBoard()
        → reads state.cards
        → draws the cards in their shuffled order
   FULL PIPELINE
       SYMBOLS
       slice() → choose symbols 
       duplicate → create pairs
       shuffle() → randomize order
       createDeck() → build card objects
       state.cards → store shuffled deck
       renderBoard() → draw cards on screen */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
/*    FORMAT TIME FUNCTION — CONVERTS SECONDS TO "mm:ss"
  function formatTime(seconds) {
      function →  declares reusable code.
      formatTime → name I created; formats time.
      (seconds) → parameter receiving total elapsed seconds.
      { } → function body.
  
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
       const creates a constant variable (name cannot change).
       m    -Variable name I created. Stores the formatted minutes string.
       =    -Assignment operator.   “Store the value on the right into the variable on the left.”
       String(...)  -Converts whatever is inside the parentheses into a STRING. Ensures the result can use string methods like padStart().
       Math.floor(...)   -Built‑in JS function. Rounds a number DOWN to the nearest whole integer.
       seconds / 60  -Division operator. Converts total seconds into minutes. Example: 125 / 60 → 2.0833 minutes.
       Math.floor(seconds / 60)  -Takes the whole minutes only. Example: 2.0833 → 2.
       String(Math.floor(seconds / 60))  -Converts the number 2 into the string "2".
       .padStart(2, "0")  -String method. Pads the start of the string with extra characters until it reaches the desired length.
                      - Ensures the string has at least 2 characters.
                      - If too short, adds "0" at the START.
                      - Example: First argument: 2  → desired total length of the string. Second argument: "0"   → character used to pad the string.
                      - Final result:  - m becomes a 2‑digit minute string.  Example: seconds = 125 → m = "02".

   SECONDS: const s = String(seconds % 60).padStart(2, "0");
     const    - Declares a constant variable (name cannot be reassigned).
    s     - Variable name YOU created.  Stores the formatted seconds string.
    =     - Assignment operator (“store right side into left side”).
    String(...)    - Converts the value inside into a STRING.
    seconds % 60   - % = modulo operator.   Gives the remainder after dividing by 60.
                   - Extracts the leftover seconds after full minutes.   Example: 125 % 60 → 5.
    String(seconds % 60)   - Converts the remainder (e.g., 5) into "5".
    .padStart(2,"0")    - Ensures the string has 2 characters.   Adds a leading "0" if needed.  "5" → "05".
    Final result:        s becomes a 2‑digit seconds string (e.g., "05").

   RETURN: return `${m}:${s}`;
        return       -Sends a value OUT of the function.
        `${m}:${s}`   -Template literal (backticks). Embeds variables directly into a string.
                      - ${m} → minutes string (e.g., "02").
                      - ${s} → seconds string (e.g., "05").
                      - ":" → separator between minutes and seconds.
          Final output:     "02:05"     Always in "mm:ss" format.

  INPUT → WHAT FEEDS INTO formatTime()  
          state.seconds → updated every second by startTimer()
          updateStatus() calls formatTime(state.seconds)
  OUTPUT → WHERE formatTime() FEEDS INTO
           timeValueEl.textContent = formatTime(state.seconds)
           updates the on‑screen timer ("mm:ss")

   FULL PIPELINE
       startTimer()
       state.seconds++
       updateStatus()
       formatTime(state.seconds)
       "mm:ss"
       timeValueEl.textContent
       timer updates on screen

   formatTime() converts raw seconds into "mm:ss" using division,
   modulo, rounding, string conversion, and padding. It is fed by
   state.seconds and feeds into the UI timer display.
-------------------------------------------------- */
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
   RENDER GAME BOARD: DRAWS ALL CARDS ON THE SCREEN
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
           ↓
       state.cards = shuffled deck
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
   CARD INTERACTION LOGIC: 
    function onCardClick(element, card) { ... }
          function    -declares a reusable block of code.
              onCardClick   -Function name I created.  Runs whenever a card button is clicked.
          (element, card)   -Two parameters passed in by renderBoard():
                      element → the <button> that was clicked
                      card    → the card object from state.cards
          { }    -Function body; contains all instructions executed on click.
    if (card.matched || element.classList.contains("is-flipped")) return;
          if         -Conditional statement; checks a condition.
          ( ... )    -Condition to evaluate.
          card.matched     -Property of the card object.  true if this card has already been matched.
          ||       -Logical OR operator.  Condition is true if EITHER side is true.
          element.classList.contains("is-flipped") 
                - classList → list of CSS classes on the button.
                - contains("is-flipped") → checks if the card is already flipped.
          return    -Immediately exits the function. Prevents flipping matched cards or clicking the same card twice.

   element.textContent = card.value;
          element    - The <button> that was clicked.
          .          - Access operator.
          textContent   - Sets the visible text inside the button.
          =         -Assignment operator.
          card.value     -The symbol/letter stored in the card object.
   element.classList.add("is-flipped");
         classList.add(...) -Adds a CSS class to the button.
                            -"is-flipped" visually marks the card as flipped.

   if (!state.firstPick) { ... } else { ... }
          if   -Checks whether this is the first card of the pair.
          !      - Logical NOT operator. !state.firstPick → true if firstPick is null/empty.
          state.firstPick       Stores the first selected card of the turn.
   state.firstPick = { element, card };
          =       -Assigns a new object to firstPick.
          { element, card }  
            - Object shorthand.
            - Equivalent to { element: element, card: card }.
            - Stores both the DOM element and the card data.
   else { ... }   -Runs when firstPick already exists (this is the second card).
   state.secondPick = { element, card };
            secondPick    -Stores the second selected card.
   state.moves++;  
            moves     -Counter of how many turns the player has taken.
            ++        -Increment operator; adds 1.
   updateStatus();    -Updates UI elements (moves, pairs found, timer).
   checkMatch();     -Compares firstPick and secondPick.
                     -Handles match or mismatch logic.
   WHAT FEEDS INTO onCardClick()    
           renderBoard()   -Calls onCardClick(btn, card) when a button is clicked.
           element       -The <button> DOM element.
           card         -The card object from state.cards.
   WHERE onCardClick() FEEDS INTO
           state.firstPick / state.secondPick       -Stores the selected cards.
           state.moves             -Increments move counter.
           updateStatus()         -Updates UI.
           checkMatch()     -Determines match/mismatch and updates game state.
   FULL PIPELINE
       User clicks a card
       onCardClick(element, card)
       Prevent double-click or matched card
       Flip card (text + CSS class)
       If firstPick empty → store firstPick
       Else → store secondPick
       moves++
       updateStatus()
       checkMatch()
       (match or mismatch logic continues)
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
