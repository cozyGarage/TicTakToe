class View{
    $ = {}
    constructor() {
        this.$.menu = this.#qs('[data-id="menu"]'),
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]'),
        this.$.menuItems = this.#qs('[data-id="menu-items"]'),
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]'),
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]'),
        this.$.modal = this.#qs('[data-id="modal"]'),
        this.$.modalText = this.#qs('[data-id="modal-text"]'),
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]'),
        this.$.turn = this.#qs('[data-id="turn"]'),
        this.$.p1Wins = this.#qs('[data-id="p1-wins"]'),
        this.$.p2Wins = this.#qs('[data-id="p2-wins"]'),
        this.$.ties = this.#qs('[data-id="ties"]'),
        this.$.grid = this.#qs('[data-id="grid"]'),
    }
}