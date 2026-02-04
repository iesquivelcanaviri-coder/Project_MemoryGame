"use strict";
/* --------------------------------------------------
   SELECT HTML ELEMENTS
   These are called:
   “DOM (Document Object Model) element references”
   because each variable stores a reference to an element
   from the HTML page.
--------------------------------------------------
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

    btn.addEventListener("click", () => onCardClick(btn, card));
    boardEl.appendChild(btn);
  });
}

/* --------------------------------------------------
   CARD INTERACTION LOGIC: 
    function onCardClick(element, card) { ... }
          function -> declares a reusable block of code.
          onCardClick -> Function name I created. Runs whenever a card button is clicked.
          (element, card) -> Two parameters passed in by renderBoard():
          element -> the <button> that was clicked
          card -> the card object from state.cards
          { } -> Function body contains all instructions executed on click.
    if (card.matched || element.classList.contains("is-flipped")) return;
            if -> Conditional statement. checks a condition.
            ( ... ) -> Condition to evaluate.
            card.matched -> Property of the card object. true if this card has already been matched.
            || -> Logical OR operator. Condition is true if EITHER side is true.
            element.classList.contains("is-flipped") 
            element -> is a variable that refers to a specific HTML element in the DOM.
            . -> Used to access a property or method that belongs to the object before it.
            classList -> list of CSS classes on the button.
                - A built‑in DOM property that represents all the CSS classes on the element.
            contains -> A method of classList. It checks whether the element has a specific CSS class. It returns a boolean value: true or false.
            ( ) -> Parentheses used to call the method.
            "is-flipped" -> A string argument. This is the exact CSS class name you want to check for. The method will look for this class in the element’s class list.
            contains("is-flipped") -> checks if the card is already flipped.
                
        return -> Immediately exits the function. Prevents flipping matched cards or clicking the same card twice.

   element.textContent = card.value;
          element -> A variable that refers to a specific HTML element in the DOM. In this game, it represents the <button> the user clicked.
                - The name "element" is chosen by the developer; it is not a keyword.
          . -> Used to access a property or method that belongs to the object before it. Here, it accesses the "textContent" property of the element.
          textContent -> A DOM property that controls the visible text inside an HTML element.
                - Changing textContent updates what the user sees on the button. Example: element.textContent = "A" will display the letter A.
          = -> Assignment operator. Stores the value on the right-hand side into the property on the left-hand side.
          card -> A variable representing the card object from the game state.
                - Contains information such as: card.value → the symbol/letter on the card
                - card.matched → whether the card has been matched
          . -> Used to access a property inside the card object.
          value -> A property of the card object. Stores the symbol/letter assigned to this card (e.g., "A", "B", "C").
                - This is what should appear on the card when it is flipped.
   element.classList.add("is-flipped");
          element -> A variable that refers to a specific HTML element in the DOM. In this game, it represents the <button> the player clicked.
          . -> Used to access a property or method that belongs to the object before it.
          classList -> A built‑in DOM property that stores all CSS classes applied to the element.
                - Behaves like a special object with methods such as:
                - add() → add a class
                - remove() → remove a class
                - toggle() → add/remove depending on current state
                - contains() → check if a class exists
          . -> Used to access a method inside the classList object.
          add -> A method of classList. Adds a CSS class to the element.
                - If the class already exists, it does nothing (no duplicates).
          ( -> Opens the method’s argument list.
          "is-flipped" -> A string argument. The exact CSS class name to add to the element. In this game, "is-flipped" visually marks the card as flipped
                - (e.g., reveals the symbol, changes styling, rotates the card, etc.).
   if (!state.firstPick) {
          if -> A conditional statement. Runs the code inside the { } only if the condition is true.
          ( ... ) -> Parentheses containing the condition to evaluate.
          ! -> Logical NOT operator. !state.firstPick means: “true if state.firstPick is empty, null, or undefined.”
          state -> The main game state object storing all live game data.
          . -> Dot operator used to access a property inside the state object.
          firstPick -> A property of state. Stores the first selected card of the current turn. Initially null at the start of each turn.
          { ... } -> Code block that runs when this is the FIRST card clicked.
    state.firstPick = { element, card };
          state.firstPick -> Assigns a new value to the firstPick property.
          = -> Assignment operator.
          { element, card } -> Object literal.
                - Stores BOTH: element → the <button> DOM element clicked. card → the card object from state.cards
                - Shorthand syntax: { element, card } is the same as:
                - { element: element, card: card }
    } else { -> Runs ONLY when the if condition is false. Meaning: this is the SECOND card clicked in the turn.
    state.secondPick = { element, card }; 
          state -> The main game state object storing all live game data. 
          . -> Dot operator used to access a property inside the state object. 
          secondPick -> Stores the second selected card. Same structure as firstPick. 
          = -> Assignment operator. Stores the value on the right-hand side into the property on the left-hand side. 
          { element, card } -> Object literal. 
            -Stores BOTH: element → the <button> DOM element clicked. card → the card object from state.cards 
            - Shorthand syntax: { element, card } is the same as: - { element: element, card: card } ; -> Ends the JavaScript statement
    state.moves++;  
          state.moves -> The move counter (number of turns taken).
          ++ -> Increment operator. Adds 1 to state.moves.
    updateStatus();
          updateStatus -> A function that updates the UI:
                - movesValueEl
                - pairsValueEl
                - timeValueEl
          () -> Calls the function.
    checkMatch();  
          checkMatch -> A function that compares firstPick and secondPick.
                - Handles match or mismatch logic.
                - Updates pairsFound and flips cards back if needed.
          () -> Calls the function.
   WHAT FEEDS INTO onCardClick()    
           renderBoard() -> Calls onCardClick(btn, card) when a button is clicked.
           element -> The <button> DOM element.
           card -> The card object from state.cards.
   WHERE onCardClick() FEEDS INTO
           state.firstPick / state.secondPick -> Stores the selected cards.
           state.moves -> Increments move counter.
           updateStatus() -> Updates UI.
           checkMatch() -> Determines match/mismatch and updates game state.
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
    MATCH CHECKING LOGIC
   function checkMatch() { ... }
         function -> Declares a reusable block of code.
         checkMatch -> Function name YOU created. Handles match/mismatch logic.
         { } -> Function body containing all instructions executed when called.
   const first = state.firstPick;
         const -> Declares a constant variable.
         first -> Variable name YOU created; stores the first selected card.
         = -> Assignment operator.
         state -> The main game state object storing all live game data.
         . -> Dot operator used to access a property inside the state object.
         firstPick -> Stores the first selected card of the turn.
         ; -> Ends the statement.
   const second = state.secondPick;
         const -> Declares a constant variable.
         second -> Variable name YOU created; stores the second selected card.
         = -> Assignment operator.
         state -> Game state object.
         . -> Dot operator.
         secondPick -> Stores the second selected card of the turn.
         ; -> Ends the statement.
   if (first.card.value === second.card.value) {
         if -> Conditional statement. Runs the code inside { } only if the condition is true.
         ( ... ) -> Condition to evaluate.
         first -> First selected card object.
         . -> Dot operator.
         card -> Card object stored inside firstPick.
         . -> Dot operator.
         value -> The symbol/letter of the first card.
         === -> Strict equality operator. Checks if both value AND type match.
         second -> Second selected card object.
         . -> Dot operator.
         card -> Card object stored inside secondPick.
         . -> Dot operator.
         value -> The symbol/letter of the second card.
         { ... } -> Code block that runs when the two cards MATCH.
      first.card.matched = true;
            first -> First selected card.
            . -> Dot operator.
            card -> Card object.
            . -> Dot operator.
            matched -> Property indicating whether the card has been matched.
            = -> Assignment operator.
            true -> Boolean value marking the card as matched.
      second.card.matched = true;
            second -> Second selected card.
            . -> Dot operator.
            card -> Card object.
            . -> Dot operator.
            matched -> Marks the second card as matched.
            = -> Assignment operator.
            true -> Boolean value.
      state.pairsFound++;
            state -> Game state object.
            . -> Dot operator.
            pairsFound -> Counter of how many pairs have been matched.
            ++ -> Increment operator; adds 1.
      resetPicks(); -> resetPicks -> Function that clears firstPick and secondPick.
            () -> Calls the function.
   } else {    -> Runs ONLY when the if condition is false (cards DO NOT match).
      setTimeout(() => {
         setTimeout -> Built‑in JS function that delays execution.
         ( ... ) -> Arguments list.
         () => { ... } -> Arrow function executed after the delay.
         600 -> Delay time in milliseconds (0.6 seconds).
         first.element.textContent = "Card";
              first -> First selected card.
              . -> Dot operator.
              element -> The <button> DOM element for the first card.
              . -> Dot operator.
              textContent -> Sets the visible text inside the button.
              = -> Assignment operator.
              "Card" -> Resets the card face to hidden.
         second.element.textContent = "Card";
              second -> Second selected card.
              . -> Dot operator.
              element -> The <button> DOM element.
              . -> Dot operator.
              textContent -> Resets visible text.
              = -> Assignment operator.
              "Card" -> Hidden card label.
         first.element.classList.remove("is-flipped");
              first.element -> The <button> DOM element.
              . -> Dot operator.
              classList -> List of CSS classes on the element.
              . -> Dot operator.
              remove -> Removes a CSS class.
              ( "is-flipped" ) -> Removes the flipped class.
         second.element.classList.remove("is-flipped");
              second.element -> The <button> DOM element.
              . -> Dot operator.
              classList -> CSS class list.
              . -> Dot operator.
              remove -> Removes a CSS class.
              ( "is-flipped" ) -> Removes the flipped class.
         resetPicks();  ->resetPicks -> Function that clears firstPick and secondPick.
              () -> Calls the function.
      }, 600);  
         }, -> Ends the arrow function.
         600 -> Delay time.
         ) -> Ends setTimeout call.
         ; -> Ends the statement.

   WHAT FEEDS INTO checkMatch()
         state.firstPick -> The first selected card (element + card object).
         state.secondPick -> The second selected card (element + card object).
         onCardClick() -> Calls checkMatch() after the second card is chosen.
   WHERE checkMatch() FEEDS INTO
         state.pairsFound -> Increments when a match is found.
         first.card.matched / second.card.matched -> Marks cards as matched.
         resetPicks() -> Clears selections for the next turn.
         Visual state -> Flips cards back if they do not match.
   FULL PIPELINE
         User clicks first card -> onCardClick() sets state.firstPick
         User clicks second card -> onCardClick() sets state.secondPick and calls checkMatch()
         checkMatch()
             If values match -> mark both matched, pairsFound++, resetPicks()
             Else -> wait 600ms, hide text, remove "is-flipped", resetPicks()
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
   function resetPicks() { ... }
         function -> Declares a reusable block of code.
         resetPicks -> Function name YOU created. Clears the selected cards.
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
   UPDATE STATUS — REFRESHES UI VALUES
   function updateStatus() { ... }
         function -> Declares a reusable block of code.
         updateStatus -> Function name YOU created. Updates the on‑screen UI.
         { } -> Function body; contains all instructions executed when called.

   movesValueEl.textContent = state.moves;
         movesValueEl -> DOM element that displays the move count.
         . -> Dot operator.
         textContent -> Sets the visible text inside the element.
         = -> Assignment operator.
         state -> Main game state object.
         . -> Dot operator.
         moves -> Number of turns taken by the player.
         ; -> Ends the statement.

   pairsValueEl.textContent = state.pairsFound;
         pairsValueEl -> DOM element showing matched pairs.
         . -> Dot operator.
         textContent -> Updates visible text.
         = -> Assignment operator.
         state.pairsFound -> Number of matched pairs so far.
         ; -> Ends the statement.

   timeValueEl.textContent = formatTime(state.seconds);
         timeValueEl -> DOM element showing the formatted timer.
         . -> Dot operator.
         textContent -> Updates visible text.
         = -> Assignment operator.
         formatTime(...) -> Converts raw seconds into "mm:ss".
         state.seconds -> Total elapsed seconds.
         ; -> Ends the statement.

   WHAT FEEDS INTO updateStatus()
         state.moves -> Move counter.
         state.pairsFound -> Matched pairs.
         state.seconds -> Elapsed time.
         formatTime() -> Converts seconds to "mm:ss".

   WHERE updateStatus() FEEDS INTO
         movesValueEl -> Updates move display.
         pairsValueEl -> Updates pairs display.
         timeValueEl -> Updates timer display.

   FULL PIPELINE
         state changes (moves, pairsFound, seconds)
         updateStatus()
         UI refreshes instantly
-------------------------------------------------- */
function updateStatus() {
  movesValueEl.textContent = state.moves;
  pairsValueEl.textContent = state.pairsFound;
  timeValueEl.textContent = formatTime(state.seconds);
}

/* --------------------------------------------------
   START TIMER — BEGINS THE GAME CLOCK
   function startTimer() { ... }
         function -> Declares a reusable block of code.
         startTimer -> Function name YOU created. Starts the timer.
         { } -> Function body.

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
         state.seconds -> Starts at 0.

   WHERE startTimer() FEEDS INTO
         state.seconds -> Increases every second.
         updateStatus() -> Refreshes UI each second.
         Timer display -> Shows updated "mm:ss".

   FULL PIPELINE
         startTimer()
         Every 1 second:
             state.seconds++
             updateStatus()
             timeValueEl.textContent updates
-------------------------------------------------- */
function startTimer() {
  state.timer = setInterval(() => {
    state.seconds++;
    updateStatus();
  }, 1000);
}

/* --------------------------------------------------
   START GAME (FORM SUBMISSION)
   gameForm.addEventListener("submit", e => { ... });
         gameForm -> Variable storing the <form> element.
         . -> Dot operator.
         addEventListener -> DOM method that listens for events.
         ( "submit", ... ) -> Listens specifically for the form’s submit event.
         e -> Parameter name YOU chose; represents the event object.
         => -> Arrow function syntax.
         { } -> Function body executed when the form is submitted.
   e.preventDefault();
         e -> Event object.
         . -> Dot operator.
         preventDefault -> Method that stops the form’s default behavior.
                - Prevents the page from reloading.
         () -> Calls the method.
         ; -> Ends the statement.

   const difficulty = difficultyEl.value;
         const -> Declares a constant variable.
         difficulty -> Variable name YOU created; stores selected difficulty.
         = -> Assignment operator.
         difficultyEl -> DOM element for the difficulty dropdown.
         . -> Dot operator.
         value -> The selected option’s value (e.g., "easy", "medium", "hard").
         ; -> Ends the statement.
   if (!difficulty) { ... }
         if -> Conditional statement.
         ( !difficulty ) -> Checks if no difficulty was selected.
         ! -> Logical NOT operator.
         { } -> Code block executed when condition is true.
      feedbackEl.textContent = "Please select a difficulty.";
             feedbackEl -> DOM element for user feedback messages.
             . -> Dot operator.
             textContent -> Sets visible text.
             = -> Assignment operator.
             "Please select a difficulty." -> Message shown to user.
             ; -> Ends the statement.
      return;  ->  return -> Exits the function early.
             ; -> Ends the statement.

   const config = DIFFICULTY[difficulty];
         const -> Declares a constant variable.
         config -> Stores the difficulty settings object.
         = -> Assignment operator.
         DIFFICULTY -> Object containing difficulty presets.
         [difficulty] -> Bracket notation; selects the chosen difficulty.
         ; -> Ends the statement.
   const totalCards = config.cols * config.rows;
         const -> Declares a constant variable.
         totalCards -> Total number of cards for this difficulty.
         = -> Assignment operator.
         config.cols -> Number of columns.
         * -> Multiplication operator.
         config.rows -> Number of rows.
         ; -> Ends the statement.

   state.cards = createDeck(totalCards);
         state -> Game state object.
         . -> Dot operator.
         cards -> Stores the deck of cards.
         = -> Assignment operator.
         createDeck(totalCards) -> Builds and shuffles the deck.
         ; -> Ends the statement.
   state.totalPairs = totalCards / 2;
         state.totalPairs -> Number of matching pairs in the game.
         = -> Assignment operator.
         totalCards / 2 -> Each pair contains 2 cards.
         ; -> Ends the statement.
   state.moves = 0;
         state.moves -> Move counter.
         = -> Assignment operator.
         0 -> Reset to zero.
         ; -> Ends the statement.
   state.pairsFound = 0;
         state.pairsFound -> Number of matched pairs.
         = -> Assignment operator.
         0 -> Reset to zero.
         ; -> Ends the statement.
   state.seconds = 0;
         state.seconds -> Timer value in seconds.
         = -> Assignment operator.
         0 -> Reset timer.
         ; -> Ends the statement.

   boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
         boardEl -> DOM element for the game board.
         . -> Dot operator.
         style -> Accesses inline CSS styles.
         . -> Dot operator.
         gridTemplateColumns -> CSS property controlling column layout.
         = -> Assignment operator.
         `repeat(${config.cols}, 1fr)` -> Template literal.
                - Sets number of columns based on difficulty.
         ; -> Ends the statement.

   renderBoard();
         renderBoard -> Function that draws all cards on screen.
         () -> Calls the function.
   startTimer();
         startTimer -> Begins the game timer.
         () -> Calls the function.
   updateStatus();
         updateStatus -> Refreshes UI values (moves, pairs, time).
         () -> Calls the function.

   feedbackEl.textContent = "Game started!";
         feedbackEl -> DOM element for feedback messages.
         . -> Dot operator.
         textContent -> Updates visible text.
         = -> Assignment operator.
         "Game started!" -> Confirmation message.
         ; -> Ends the statement.
   WHAT FEEDS INTO START GAME
         difficultyEl.value -> User-selected difficulty.
         DIFFICULTY -> Provides cols/rows.
         createDeck(totalCards) -> Builds the deck.
         state -> Stores all game data.
   WHERE START GAME FEEDS INTO
         state.cards -> New shuffled deck.
         state.totalPairs -> Updated pair count.
         boardEl -> Updated grid layout.
         renderBoard() -> Draws cards.
         startTimer() -> Begins timer.
         updateStatus() -> Updates UI.
         feedbackEl -> Shows confirmation message.
   FULL PIPELINE
         User selects difficulty
         User submits form
         preventDefault() stops page reload
         Difficulty validated
         totalCards = cols * rows
         state updated (cards, pairs, moves, seconds)
         board layout updated
         renderBoard()
         startTimer()
         updateStatus()
         "Game started!" displayed
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
