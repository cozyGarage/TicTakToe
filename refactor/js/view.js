
export default class View {                           // The View class implements the View component and is responsible for rendering the game board and UI.
  $ = {};                                  // The $ object contains single elements that are selected from the DOM.
  $$ = {};                                // The $$ object contains lists of elements that are selected from the DOM.
  constructor() {                                                 // The constructor method is called when a new instance of the View class is created. which selects HTML elements from the DOM and initializes event listeners.
    /**
     * Pre-select all the elements we'll need (for convenience and clarity)
     */

    // Single elements
    this.$.menu = this.#qs('[data-id="menu"]');
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
    this.$$.squares = this.#qsAll('[data-id="square"]');

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
  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : "Tie!");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  /**
   * Events that are handled by the "Controller" in app.js
   * ----------------------------------------------------------
   */

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
  }

  /**
   * All methods below are private utility methods used for updating the UI
   * -----------------------------------------------------------------------------
   */

  #updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} wins`;
    this.$.p2Wins.innerText = `${p2Wins} wins`;
    this.$.ties.innerText = `${ties} ties`;
  }

  #openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    const icon = this.$.menuBtn.querySelector("i");

    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }

  #toggleMenu() {                                                                 // The toggleMenu method toggles the visibility of the menu items.
    this.$.menuItems.classList.toggle("hidden");                                  // The $.menuItems.classList.toggle method toggles the hidden class on the menu items.
    this.$.menuBtn.classList.toggle("border");                                    // The $.menuBtn.classList.toggle method toggles the border class on the menu button.

    const icon = this.$.menuBtn.querySelector("i");                               // The $.menuBtn.querySelector method selects the chevron icon from the menu button.

    icon.classList.toggle("fa-chevron-down");                                     // The icon.classList.toggle method toggles the fa-chevron-down class on the chevron icon.
    icon.classList.toggle("fa-chevron-up");                                       // The icon.classList.toggle method toggles the fa-chevron-up class on the chevron icon.
  }

  #handlePlayerMove(squareEl, player) {                                           // The #handlePlayerMove method is responsible for rendering a player's move on the game board.
    const icon = document.createElement("i");                                   // The document.createElement method creates a new i element.
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);          // The icon.classList.add method adds the fa-solid, iconClass, and colorClass classes to the icon element.
    squareEl.replaceChildren(icon);                                               // The squareEl.replaceChildren method replaces the contents of the square element with the icon element.
  }

  #setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);

    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  /**
   * The #qs and #qsAll methods are "safe selectors", meaning they
   * _guarantee_ the elements we select exist in the DOM (otherwise throw an error)
   */
  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector) : document.querySelector(selector);

    if (!el) throw new Error("Could not find element");

    return el;
  }

  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");

    return elList;
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
  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}