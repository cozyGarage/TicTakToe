I refactor this app based on the original design. and I try to redesign it in MVC pattern. The process should be Visual Design (HTML,CSS) - Game State (create basic logic for game like fill the board, announce the player,...) and then redesign in MVC pattern to see the advantages of it as well as the thought flow in how to design a app with MVC pattern.


- **Game Design** - generic notes on designing a Tic Tac Toe game that will be used in each example.
  - [Visual Design](#visual-design)
  - [Game State](#game-state-design)
  - [MVC Pattern](#mvc-pattern)
- **Examples** - There are comments throughout the code that attempt to explain important concepts.
  - Vanilla ES6 (see `typescript` branch for a TS implementation)
  - React (see `typescript` branch for a TS implementation)

## Visual Design

I am not a professional designer, and therefore, I have kept the design refactor to a minimum.

Most of the visual changes were small tweaks to the original or to reflect additional functionality that was added as part of the refactor.

I create this new project based on tutorial from freecodecamp.org and the origin project from Github which i will demonstrate below.

## Original Design

![Screenshot 2023-04-08 at 16 30 48](https://user-images.githubusercontent.com/9263674/230723987-63f67380-b353-4fa8-bf78-8e3f4dcb778a.png)

## Refactored Design

I am not a professional designer, and therefore, I have kept the design refactor to a minimum.

Most of the visual changes were small tweaks to the original or to reflect additional functionality that was added as part of the refactor.

![image](https://user-images.githubusercontent.com/9263674/230105602-9ddeb1f6-5839-4a31-9948-ba235af8ecb9.png)

 3rd of April. I finish the layout as well as the style. UI. the logic to control all the grid will be work next.

![image](https://user-images.githubusercontent.com/9263674/230115012-4da4a687-6f22-4665-9225-6ab20eb0b698.png)

Design the MVC . Module - View - Control. It is a software architecture design pattern.

![Screenshot 2023-04-08 at 17 05 55](https://user-images.githubusercontent.com/9263674/230725557-a0ead266-cdc0-474f-a4af-d6c6b386d2de.png)



5th of April 2023. When i put all the javascript function in a file, it seem to have a lot of problem and it is very hard to scale and troubleshoot the bug

So i learn about MVC pattern and redesign the code.

![Screenshot 2023-04-08 at 16 01 39](https://user-images.githubusercontent.com/9263674/230722581-c388672d-bdcc-4cfe-88f2-af7d19d90ae2.png)

Update 16/4/2023
improve code from for to foreach

Update 26/4/2023

## Game State Design

For in-browser interactive games (and apps in general), designing a clean state schema is one of the most important initial design steps.

Below, I briefly cover some state concepts and outline the design for this game.

### State concepts

When we talk about "state", this can reference many different things. In larger web applications, there are _generally_ two primary types of state:

1. **Client state** - This keeps track of user interactions in the browser. For example, if using Amazon, the user might add some search filters, toggle open a navigation menu, or click "next" to go to the next page of results. These are all examples of "client state".
2. **Database state** - This describes what data is stored in the DB at a point in time. Various user actions can change the database state. For example, if a user purchases an item on Amazon, that item will be stored in some sort of `orders` table in a database so that when a user logs in on another device, we can show them their past orders.

In larger web applications, keeping client and DB state in-sync is important and often facilitated via external libraries (like [react-query](https://react-query-v3.tanstack.com/)).

In this Tic Tac Toe game, instead synchronizing our client state to a database, we will be syncing it to `localStorage`, which will act as our "DB".

For some foundational concepts on state management, the Redux documentation provides some great overviews of [_why_ we need to manage state](https://redux.js.org/understanding/thinking-in-redux/motivation) and some [best practices for managing state](https://redux.js.org/style-guide/#priority-a-rules-essential) in an application. While some could argue Redux has fallen out of favor in the past few years (React has its own way of managing state), it still has some great documentation and is a great place to learn from.

### Tic Tac Toe State Design

There are many ways to approach this, but in efforts to replicate the existing subscriber code provided in the [/original](https://github.com/zachgoll/subscriber-refactor-1/tree/main/original) folder, I have identified a few pieces of state that we will need to keep track of.

- Game - keeps track of the currently active game state
- Statistics - keeps track of past games and keeps records of each player

As you will see in the types below, `Scoreboard` can be _derived_ from a list of `Game` results, so we call this "derived state". When designing your state objects, it is usually best-practice to avoid storing "derived state", which will become more clear after reading through the example applications I have built.

Below is a brief outline of our "Game State". I am using TypeScript types to demonstrate, but the game on the `main` branch is written in vanilla JS and will not include these typings explicitly. If you want to see an implementation in TypeScript, visit the `typescript` branch.

```ts
// Below are supporting types (not actual state)
// -----------------------------------------------------------------

type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

type Move = {
  player: Player;
  squareId: number; // from 1-9, represents square on game board
};

type GameStatus = {
  isComplete: boolean;
  winner: Player | null; // If null and game is complete, is a tie
};

type Game = {
  moves: Move[];
  status: GameStatus;
};

// Below is the game state object that will be in localStorage
// -----------------------------------------------------------------

type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};
```

The state design above will be stored in local storage so that results are persisted across browser refreshes. Additionally, since local storage is available across browser tabs, each player can have their own browser tab to play from.

#### Why not include more in the state object?

Looking at the state object, you might wonder... Why are we only storing an array of `Move`s in the current game? Don't we want to know who's turn it is, if the game is complete, and who the winner is?

Of course we do! But we _should not_ store this information directly in state. Instead, we should _derive_ it from state as a "read only" concern. By doing this, we can make a "move" in the game by simply pushing it to an array of moves.

```ts
const player = { ... } // player object

const newMove = {
  squareId: 1,
  player
}

state.currentGameMoves.push(newMove)
```

And then later, we can define "getters" to read the array of current moves and get more information that we need.

## MVC Pattern

Different libraries and frameworks _enable_ different design patterns. Therefore, going from Vanilla => React, you'll see slightly different application designs and patterns throughout.

Below, I will explain the classic MVC design pattern as it pertains to our **vanilla refactor**. I will not be covering the design patterns behind the React refactor as these patterns are more obvious as you use these libraries more and more.

One of the unfortunate things about building Vanilla JavaScript applications is that there are no patterns that you _must_ use. You can get a JavaScript app working with hundreds of _different_ implementations, but if you want to build something that can be **scaled** and **easily debugged**, you'll need some sort of application pattern.

When building a game like Tic Tac Toe, it is generally a good idea to follow an MV\* design pattern, which is a variation of MVC (Model, View, Controller) and simply means, "Model, View, Whatever". This just means that in your app, you'll have one or more "models" that represent the data (like `Player`, `Move`, and `Game` as shown in the prior section), one or more "views" that are responsible for rendering the models to the browser, and finally, _something_ that ties the two together. Typically, this is called a "Controller", but as you'll see in our implementation, `app.js` acts as the "Controller" in addition to initializing the application. You _could_ split some of the logic into a dedicated `Controller` class, but this introduces one more layer of indirection and is not necessary for a smaller project like this.

_Tip: If you want to understand a pure MVC pattern better, I suggest building (or reading through) a basic [Ruby on Rails application](https://rubyonrails.org/), which is a framework that strictly follows the MVC pattern._

- `store.js` - This is the "Model" of MV\* that is responsible for managing game state.
- `view.js` - This is the "View" of MV\* that is responsible for manipulating DOM elements and registering event listeners.
- `app.js` - A small file that ties everything together and renders the UI (i.e. the "Controller").
