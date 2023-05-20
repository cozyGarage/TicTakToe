import Store from "./store.js";           // The Store class implements the Model component and is responsible for managing the game state and statistics.
import View from "./view.js";             // The View class implements the View component and is responsible for rendering the game board and UI.


const players = [                         // The players array defines the configuration of the game's players including their icons, colors, and names.
  {
    id: 1,                                // The id property is used to identify the player.
    name: "Player 1",                     // The name property is used to display the player's name in the UI.
    iconClass: "fa-x",                    // The iconClass property is used to display the player's icon in the UI.
    colorClass: "turquoise",              // The colorClass property is used to display the player's icon color in the UI.
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

                                        // MVC pattern

function init() {                         // The init function is the entry point of the application that sets up the Model, View, and Controller components.
  
  const store = new Store("game-state-key", players); // The Store class implements the Model component and is responsible for managing the game state and statistics.
  const view = new View();                // The View class implements the View component and is responsible for rendering the game board and UI.

  // The Controller logic includes event listeners and handlers that interact with the Model and View components.

  /**
   * Listen for changes to the game state, re-render view when change occurs.
   *
   * The `statechange` event is a custom Event defined in the Store class
   */
  store.addEventListener("statechange", () => {         // The store.addEventListener method listens for the statechange event and re-renders the view when the state changes.
    view.render(store.game, store.stats);              // The view.render method is responsible for rendering the game board and UI. 
  });

  /**
   * When 2 players are playing from different browser tabs, listen for changes
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
   */
  window.addEventListener("storage", () => {          // The window.addEventListener method listens for the storage event and re-renders the view when the state changes.
    console.log("State changed from another tab");
    view.render(store.game, store.stats);
  });

  // When the HTML document first loads, render the view based on the current state.
  view.render(store.game, store.stats);
  /* The view.bindGameResetEvent, view.bindNewRoundEvent, and view.bindPlayerMoveEvent methods bind 
   *  event handlers to UI elements that interact with the Model component.
   */
  view.bindGameResetEvent((event) => { // The view.bindGameResetEvent method binds an event handler to the UI element that resets the game.
    store.reset();                    // The store.reset method resets the game state.
  });

  view.bindNewRoundEvent((event) => {  // The view.bindNewRoundEvent method binds an event handler to the UI element that starts a new round.
    store.newRound();                   // The store.newRound method resets the game state for a new round.
  });

  view.bindPlayerMoveEvent((square) => {        // The view.bindPlayerMoveEvent method binds an event handler to the UI element that allows a player to make a move.
    const existingMove = store.game.moves.find(     // The store.game.moves.find method checks if a move has already been made on the square.
      (move) => move.squareId === +square.id          // The squareId property of the move object is compared to the id of the square.
    );

    if (existingMove) {
      return;
    }

    store.playerMove(+square.id);                 // The store.playerMove method pushes a move to the moves array.  The id of the square is passed as an argument. 
  });
}

window.addEventListener("load", init);            // The window.addEventListener method listens for the load event and calls the init function when the HTML document first loads.

