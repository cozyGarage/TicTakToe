import Store from "./store.js"; // The Store class implements the Model component and is responsible for managing the game state and statistics.
import View from "./view.js"; // The View class implements the View component and is responsible for rendering the game board and UI.

// The players array defines the configuration of the game's players including their icons, colors, and names.
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

// MVC pattern
// The init function is the entry point of the application that sets up the Model, View, and Controller components.
function init() {
  // "Model"
  // The Store class implements the Model component and is responsible for managing the game state and statistics.
  const store = new Store("game-state-key", players);

  // "View"
  // The View class implements the View component and is responsible for rendering the game board and UI.
  const view = new View();

  // The Controller logic includes event listeners and handlers that interact with the Model and View components.

  /**
   * Listen for changes to the game state, re-render view when change occurs.
   *
   * The `statechange` event is a custom Event defined in the Store class
   */
  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });

  /**
   * When 2 players are playing from different browser tabs, listen for changes
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
   */
  window.addEventListener("storage", () => {
    console.log("State changed from another tab");
    view.render(store.game, store.stats);
  });

  // When the HTML document first loads, render the view based on the current state.
  view.render(store.game, store.stats);
  /* The view.bindGameResetEvent, view.bindNewRoundEvent, and view.bindPlayerMoveEvent methods bind 
   *  event handlers to UI elements that interact with the Model component.
   */
  view.bindGameResetEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    // Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);
  });
}

window.addEventListener("load", init);

