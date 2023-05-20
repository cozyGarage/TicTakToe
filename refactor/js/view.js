
export default class View {                           // The View class implements the View component and is responsible for rendering the game board and UI.
  $ = {};                                  // The $ object contains single elements that are selected from the DOM.
  $$ = {};                                // The $$ object contains lists of elements that are selected from the DOM.
  constructor() {                                                 // The constructor method is called when a new instance of the View class is created. which selects HTML elements from the DOM and initializes event listeners.
    /**
     * Pre-select all the elements we'll need (for convenience and clarity)
     */

    // Single elements
    this.$.menu = this.#qs('[data-id="menu"]');                                   // The $.menu property is set to the menu element.
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');
    this.$.grid = this.#qs('[data-id="grid"]');

    // Element lists
    this.$$.squares = this.#qsAll('[data-id="square"]');                        // The $$.squares property is set to a list of square elements.

    /**
     * UI-only event listeners
     *
     * These are listeners that do not mutate state and therefore
     * can be contained within View entirely.
     */
    this.$.menuBtn.addEventListener("click", (event) => {                       // The $.menuBtn.addEventListener method listens for the click event on the menu button and calls the toggleMenu method when the event occurs.
      this.#toggleMenu();                                                       // The toggleMenu method toggles the visibility of the menu items.
    });
  }

  /**
   * This application follows a declarative rendering methodology
   * and will re-render every time the state changes.
   */
  render(game, stats) {                                                         // The render method is responsible for rendering the game board and UI.
    const { playerWithStats, ties } = stats;                                    // The playerWithStats and ties variables are destructured from the stats object.
    const {                                                                     // The playerWithStats array is sorted by the wins property of each player object.
      moves,                                                                    // The moves, currentPlayer, isComplete, and winner variables are destructured from the game object.
      currentPlayer,                                                            // The currentPlayer, isComplete, and winner variables are destructured from the game object.
      status: { isComplete, winner },                                           // The currentPlayer, isComplete, and winner variables are destructured from the game object.
    } = game;                                                                   // The currentPlayer, isComplete, and winner variables are destructured from the game object.

    this.#closeAll();                                                           // The closeAll method closes the modal and menu.
    this.#clearMoves();                                                         // The clearMoves method clears the moves from the game board.
    this.#updateScoreboard(                                                     // The updateScoreboard method updates the scoreboard.
      playerWithStats[0].wins,                                                  // The wins property of the first player object is passed as an argument.
      playerWithStats[1].wins,                                                  // The wins property of the second player object is passed as an argument.
      ties                                                                      // The ties variable is passed as an argument.
    );
    this.#initializeMoves(moves);                                               // The initializeMoves method initializes the moves on the game board.

    if (isComplete) {                                                           // The isComplete variable is used to determine if the game is complete.
      this.#openModal(winner ? `${winner.name} wins!` : "Tie!");                // The openModal method opens the modal and displays the winner or tie message.
      return;
    }

    this.#setTurnIndicator(currentPlayer);                                      // The setTurnIndicator method sets the turn indicator.
  }

  /**
   * Events that are handled by the "Controller" in app.js
   * ----------------------------------------------------------
   */

  bindGameResetEvent(handler) {                                                 // The bindGameResetEvent method binds an event handler to the UI element that resets the game.
    this.$.resetBtn.addEventListener("click", handler);                         // The $.resetBtn.addEventListener method listens for the click event on the reset button and calls the handler function when the event occurs.
    this.$.modalBtn.addEventListener("click", handler);                         // The $.modalBtn.addEventListener method listens for the click event on the modal button and calls the handler function when the event occurs.
  }

  bindNewRoundEvent(handler) {                                                  // The bindNewRoundEvent method binds an event handler to the UI element that starts a new round.
    this.$.newRoundBtn.addEventListener("click", handler);                      // The $.newRoundBtn.addEventListener method listens for the click event on the new round button and calls the handler function when the event occurs.
  }

  bindPlayerMoveEvent(handler) {                                                // The bindPlayerMoveEvent method binds an event handler to the UI element that allows a player to make a move.
    this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);        // The #delegate method is used to listen for the click event on the game board and call the handler function when the event occurs.
  }

  /**
   * All methods below are private utility methods used for updating the UI
   * -----------------------------------------------------------------------------
   */

  #updateScoreboard(p1Wins, p2Wins, ties) {                                     // The #updateScoreboard method updates the scoreboard.
    this.$.p1Wins.innerText = `${p1Wins} wins`;                                 // The $.p1Wins.innerText property sets the text content of the p1Wins element.
    this.$.p2Wins.innerText = `${p2Wins} wins`;                                 // The $.p2Wins.innerText property sets the text content of the p2Wins element.
    this.$.ties.innerText = `${ties} ties`;                                     // The $.ties.innerText property sets the text content of the ties element.
  }

  #openModal(message) {                                                         // The #openModal method opens the modal and displays the winner or tie message.
    this.$.modal.classList.remove("hidden");                                    // The $.modal.classList.remove method removes the hidden class from the modal element.
    this.$.modalText.innerText = message;                                       // The $.modalText.innerText property sets the text content of the modalText element.
  }

  #closeAll() {                                                                 // The closeAll method closes the modal and menu.
    this.#closeModal();                                                         // The closeModal method closes the modal.
    this.#closeMenu();                                                          // The closeMenu method closes the menu.
  }

  #clearMoves() {                                                               // The clearMoves method clears the moves from the game board.
    this.$$.squares.forEach((square) => {                                       // The $$.squares.forEach method iterates over the square elements.
      square.replaceChildren();                                                 // The square.replaceChildren method removes the contents of the square element.
    });
  }

  #initializeMoves(moves) {                                                       // The initializeMoves method initializes the moves on the game board.
    this.$$.squares.forEach((square) => {                                         // The $$.squares.forEach method iterates over the square elements.
      const existingMove = moves.find((move) => move.squareId === +square.id);    // The moves.find method checks if a move has already been made on the square.

      if (existingMove) {                                                         // The existingMove variable is used to determine if a move has already been made on the square.
        this.#handlePlayerMove(square, existingMove.player);                      // The #handlePlayerMove method is responsible for rendering a player's move on the game board.
      }
    });
  }

  #closeModal() {                                                                 // The closeModal method closes the modal.
    this.$.modal.classList.add("hidden");                                         // The $.modal.classList.add method adds the hidden class to the modal element.
  }

  #closeMenu() {                                                                  // The closeMenu method closes the menu.
    this.$.menuItems.classList.add("hidden");                                     // The $.menuItems.classList.add method adds the hidden class to the menu items.
    this.$.menuBtn.classList.remove("border");                                    // The $.menuBtn.classList.remove method removes the border class from the menu button.
    const icon = this.$.menuBtn.querySelector("i");                               // The $.menuBtn.querySelector method selects the chevron icon from the menu button.
    icon.classList.add("fa-chevron-down");                                        // The icon.classList.add method adds the fa-chevron-down class to the chevron icon.
    icon.classList.remove("fa-chevron-up");                                       // The icon.classList.remove method removes the fa-chevron-up class from the chevron icon.
  }

  #toggleMenu() {                                                                 // The toggleMenu method toggles the visibility of the menu items.
    this.$.menuItems.classList.toggle("hidden");                                  // The $.menuItems.classList.toggle method toggles the hidden class on the menu items.
    this.$.menuBtn.classList.toggle("border");                                    // The $.menuBtn.classList.toggle method toggles the border class on the menu button.

    const icon = this.$.menuBtn.querySelector("i");                               // The $.menuBtn.querySelector method selects the chevron icon from the menu button.

    icon.classList.toggle("fa-chevron-down");                                     // The icon.classList.toggle method toggles the fa-chevron-down class on the chevron icon.
    icon.classList.toggle("fa-chevron-up");                                       // The icon.classList.toggle method toggles the fa-chevron-up class on the chevron icon.
  }

  #handlePlayerMove(squareEl, player) {                                           // The #handlePlayerMove method is responsible for rendering a player's move on the game board.
    const icon = document.createElement("i");                                     // The document.createElement method creates a new i element.
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);          // The icon.classList.add method adds the fa-solid, iconClass, and colorClass classes to the icon element.
    squareEl.replaceChildren(icon);                                               // The squareEl.replaceChildren method replaces the contents of the square element with the icon element.
  }

  #setTurnIndicator(player) {                                                     // The #setTurnIndicator method is responsible for rendering the player's turn indicator.
    const icon = document.createElement("i");                                     // The document.createElement method creates a new i element.
    const label = document.createElement("p");                                    // The document.createElement method creates a new p element.

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);          // The icon.classList.add method adds the fa-solid, colorClass, and iconClass classes to the icon element.

    label.classList.add(player.colorClass);                                       // The label.classList.add method adds the colorClass class to the label element.
    label.innerText = `${player.name}, you're up!`;                               // The label.innerText property sets the text content of the label element.
    this.$.turn.replaceChildren(icon, label);                                     // The $.turn.replaceChildren method replaces the contents of the turn element with the icon and label elements.
  }

  /**
   * The #qs and #qsAll methods are "safe selectors", meaning they
   * _guarantee_ the elements we select exist in the DOM (otherwise throw an error)
   */
  #qs(selector, parent) {                                                           // The #qs method is a "safe selector" that selects a single element from the DOM.
    const el = parent                                                               
      ? parent.querySelector(selector) : document.querySelector(selector);          // The parent argument is used to select an element from a parent element.

    if (!el) throw new Error("Could not find element");                             // The #qs method throws an error if the element does not exist.

    return el;
  }

  #qsAll(selector) {                                                                // The #qsAll method is a "safe selector" that selects a list of elements from the DOM.
    const elList = document.querySelectorAll(selector);                             // The document.querySelectorAll method selects a list of elements from the DOM.
    if (!elList) throw new Error("Could not find elements");                        // The #qsAll method throws an error if the elements do not exist
    return elList;                                                                  // The elList variable is returned.
  }

  /**
   * Rather than registering event listeners on every child element in our Tic Tac Toe grid, we can
   * listen to the grid container and derive which square was clicked using the matches() function.
   *
   * @param {*} el the "container" element you want to listen for events on
   * @param {*} selector the "child" elements within the "container" you want to handle events for
   * @param {*} eventKey the event type you are listening for (e.g. "click" event)
   * @param {*} handler the callback function that is executed when the specified event is triggered on the specified children
   */
  #delegate(el, selector, eventKey, handler) {                                      // The #delegate method is used to listen for the click event on the game board and call the handler function when the event occurs.
    el.addEventListener(eventKey, (event) => {                                      // The el.addEventListener method listens for the click event on the game board and calls the handler function when the event occurs.
      if (event.target.matches(selector)) {                                         // The event.target.matches method checks if the target element matches the selector.
        handler(event.target);                                                      // The handler function is called with the target element as an argument.
      }
    });
  }
}