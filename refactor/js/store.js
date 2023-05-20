const initialState = {                // Initial state of the app
    currentGameMoves: [],             // All the player moves for the active game
    history: {                        // History of all games played
      currentRoundGames: [],          // All the games played in the current round
      allGames: [],                   // All the games played in all rounds
    },
  };
  
  /**
   * Store is (loosely) the "Model" in the MV* or MVC pattern
   *
   * Think of this as our abstraction on top of an arbitrary data store.
   * In this app, we're using localStorage, but this class should not require
   * much change if we wanted to change our storage location to an in-memory DB,
   * external location, etc. (just change #getState and #saveState methods)
   *
   * This class extends EventTarget so we can emit a `statechange` event when
   * state changes, which the controller can listen for to know when to re-render the view.
   */
  export default class Store extends EventTarget {          // The Store class extends the EventTarget class, which allows it to emit a custom statechange event when the state changes. 
    constructor(key, players) {                             // The constructor method accepts a key and players as arguments.
      super();                                              // The super method calls the constructor of the parent class. Since we're extending EventTarget, need to call super() so we have access to instance methods
      this.storageKey = key;                                // The storageKey property is set to the key argument.
      this.players = players;                               // The players property is set to the players argument.
    }
  
    /** stats() and game() are Convenience "getters"
     *
     * To avoid storing a complex state object that is difficult to mutate, we store a simple one (array of moves)
     * and derive more useful representations of state via these "getters", which can be accessed as properties on
     * the Store instance object.
     *
     * @example
     *
     * ```
     * const store = new Store()
     *
     * // Regular property reference (JS evaluates fn under hood)
     * const game = store.game
     * const stats = store.stats
     * ```
     *
     * @see - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
     */
    get stats() {                                           // The stats getter method returns an object with the playerWithStats and ties properties.
      const state = this.#getState();                       // The state variable is set to the return value of the #getState method.
  
      return {
        playerWithStats: this.players.map((player) => {                     // The playerWithStats property is set to an array of player objects with the wins property added.
          const wins = state.history.currentRoundGames.filter(              // The wins property is set to the number of games won by the player.
            (game) => game.status.winner?.id === player.id                  // The status.winner.id property of the game object is compared to the id of the player.
          ).length;                                                         // The length of the array is the number of games won by the player.
  
          return {
            ...player,                                                    // The player object is spread into the new object.
            wins,                                                         // The wins property is set to the wins variable.
          };
        }),
        ties: state.history.currentRoundGames.filter(                     // The ties property is set to the number of games tied.
          (game) => game.status.winner === null                           // The status.winner property of the game object is compared to null.
        ).length,                     
      };
    }
  
    get game() {                                                          // The game getter method returns an object with the moves, currentPlayer, and status properties.
      const state = this.#getState();
  
      const currentPlayer = this.players[state.currentGameMoves.length % 2];          // The currentPlayer property is set to the player whose turn it is.
  
      const winningPatterns = [                                           // The winningPatterns variable is set to an array of arrays of winning patterns.
        [1, 2, 3],
        [1, 5, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9],
      ];
  
      let winner = null;                                                // The winner variable is set to null.
  
      for (const player of this.players) {                              // The for...of loop iterates over the players array.
        const selectedSquareIds = state.currentGameMoves                // The selectedSquareIds variable is set to an array of the ids of the squares selected by the player.
          .filter((move) => move.player.id === player.id)               // The player.id property of the move object is compared to the id of the player.
          .map((move) => move.squareId);                                // The squareId property of the move object is mapped to the selectedSquareIds array.
  
        for (const pattern of winningPatterns) {                        // The for...of loop iterates over the winningPatterns array.
          if (pattern.every((v) => selectedSquareIds.includes(v))) {      // The every method checks if every element of the pattern array is included in the selectedSquareIds array.
            winner = player;                                            // The winner variable is set to the player.
          }
        }
      }
  
      return {
        moves: state.currentGameMoves,                                  // The moves property is set to the currentGameMoves array.
        currentPlayer,                                                  // The currentPlayer property is set to the currentPlayer variable.
        status: {                                                       // The status property is set to an object with the isComplete and winner properties.
          isComplete: winner != null || state.currentGameMoves.length === 9,    // The isComplete property is set to true if there is a winner or if there are 9 moves.
          winner,                                                       // The winner property is set to the winner variable.
        },
      };
    }
  
    playerMove(squareId) {                                              // The playerMove method pushes a move to the moves array.  The id of the square is passed as an argument.
      /**
       * Never mutate state directly.  Create copy of state, edit the copy,
       * and save copy as new version of state.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
       * @see https://redux.js.org/style-guide/#do-not-mutate-state
       */
      const stateClone = structuredClone(this.#getState());             // The stateClone variable is set to a deep copy of the state object.
  
      stateClone.currentGameMoves.push({                                // A move object is pushed to the currentGameMoves array.
        squareId,                                                       // The squareId property is set to the squareId argument.
        player: this.game.currentPlayer,                                  // The player property is set to the currentPlayer property of the game object.
      });
  
      this.#saveState(stateClone);                                      // The #saveState method is called with the stateClone variable as an argument.
    }
  
    /**
     * Resets the game.
     *
     * If the current game is complete, the game is archived.
     * If the current game is NOT complete, it is deleted.
     */
    reset() {
      const stateClone = structuredClone(this.#getState());
  
      const { status, moves } = this.game;
  
      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }
  
      stateClone.currentGameMoves = [];
  
      this.#saveState(stateClone);
    }
  
    /**
     * Resets the scoreboard (wins, losses, and ties)
     */
    newRound() {                                                                            // The newRound method resets the game state for a new round.
      this.reset();                                                                         // The reset method is called.
      const stateClone = structuredClone(this.#getState());                                 // The stateClone variable is set to a deep copy of the state object.
      stateClone.history.allGames.push(...stateClone.history.currentRoundGames);              // The allGames property of the history object is set to an array of the games played in the current round.
      stateClone.history.currentRoundGames = [];                                            // The currentRoundGames property of the history object is set to an empty array.
      this.#saveState(stateClone);                                                            // The #saveState method is called with the stateClone variable as an argument.
    }
  
    /**
     * Private state reducer that transitions from the old state to the new state
     * and saves it to localStorage.  Every time state changes, a custom 'statechange'
     * event is emitted.
     *
     * @param {*} stateOrFn can be an object or callback fn
     *
     * We are not using Redux here, but it gives a good overview of some essential concepts to managing state:
     * @see https://redux.js.org/understanding/thinking-in-redux/three-principles#changes-are-made-with-pure-functions
     */
    #saveState(stateOrFn) {                                                               // The #saveState method accepts a stateOrFn argument.
      const prevState = this.#getState();                                                 // The prevState variable is set to the return value of the #getState method.
  
      let newState;                                                                       // The newState variable is declared.
  
      switch (typeof stateOrFn) {                                                         // The typeof operator checks the type of the stateOrFn argument.
        case "function":                                                                  // If the type is function, the newState variable is set to the return value of the stateOrFn function.
          newState = stateOrFn(prevState);                                                // The prevState variable is passed as an argument to the stateOrFn function.
          break;
        case "object":
          newState = stateOrFn;                                                           // If the type is object, the newState variable is set to the stateOrFn argument.
          break;
        default:
          throw new Error("Invalid argument passed to saveState");                        // If the type is neither function nor object, an error is thrown.
      }
  
      window.localStorage.setItem(this.storageKey, JSON.stringify(newState));             // The newState variable is stringified and saved to localStorage.
      this.dispatchEvent(new Event("statechange"));                                       // A custom statechange event is dispatched.
    }
  
    #getState() {                                                                         // The #getState method returns the state object.
      const item = window.localStorage.getItem(this.storageKey);                          // The item variable is set to the value of the storageKey property in localStorage.
      return item ? JSON.parse(item) : initialState;                                      // If the item variable is truthy, the value is parsed and returned.  Otherwise, the initialState variable is returned.
    }
  }