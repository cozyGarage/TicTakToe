const App = {
    // All of our selected HTML elements
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        reset-btn: document.querySelector('[data-id="reset-btn"]'),
        newRound-btn: document.querySelector('[data-id="new-round-btn"]'),

    },

    init(){
        App.$.menu.addEventListener("click", (event) => {
            App.$.menuItems.classList.toggle("hidden");
        })
    }
};

window.addEventListener("load", App.init());
// test the app

