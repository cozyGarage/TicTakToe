import "./App.css";

import classNames from "classnames";

// State helpers
import { useLocalStorage } from "./useLocalStorage";
import { deriveStats, deriveGame } from "./utils";

// Component imports
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import Menu from "./components/Menu";

const initialState = {                                                          // this is the initial state of the game
  currentGameMoves: [],                                                         // this is the current game moves
  history: {                                                                  // this is the history of the game            
    currentRoundGames: [],                                                  // this is the current round of the game    
    allGames: [],                                                          // this is all the games
  },
};

export default function App() {                                          // this is the main function of the game
  const [state, setState] = useLocalStorage("game-state-key", initialState);      // this is the state of the game

  // Derived state (updates on every state change)
  const game = deriveGame(state);                       // this is the game
  const stats = deriveStats(state);                     // this is the stats

  const resetGame = (isNewRound) => {                         // this is the function to reset the game 
    setState((prevState) => {                                 // this is the state of the game before the reset 
      const stateCopy = structuredClone(prevState);           // this is the copy of the state of the game before the reset 
      // If game is complete, archive it to history object
      if (game.status.isComplete) {     
        const { moves, status } = game;
        stateCopy.history.currentRoundGames.push({
          moves,
          status,
        });
      }

      stateCopy.currentGameMoves = [];                // this is the current game moves   

      // Must archive current round in addition to resetting current game
      if (isNewRound) {
        stateCopy.history.allGames.push(...stateCopy.history.currentRoundGames);
        stateCopy.history.currentRoundGames = [];
      }

      return stateCopy;
    });
  };

  const handlePlayerMove = (squareId, player) => {
    setState((prev) => {
      const { currentGameMoves } = structuredClone(prev);

      currentGameMoves.push({
        player,
        squareId,
      });

      return {
        ...prev,
        currentGameMoves,
      };
    });
  };

  return (
    <>
      <main>
        <div className="grid">
          <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <i
              className={classNames("fa-solid", game.currentPlayer.iconClass)}
            ></i>
            <p>{game.currentPlayer.name}, you're up!</p>
          </div>

          <Menu
            onAction={(action) => {
              resetGame(action === "new-round");
            }}
          />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div
                key={squareId}
                id={squareId.toString()}
                className="square shadow"
                onClick={() => {
                  // Don't make a move on square if there already is one
                  if (existingMove) return;

                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={classNames(
                      "fa-solid",
                      existingMove.player.iconClass,
                      existingMove.player.colorClass
                    )}
                  ></i>
                )}
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 1</p>
            <span>{stats.playersWithStats[0].wins} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span>{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 2</p>
            <span>{stats.playersWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />

      {game.status.isComplete && (
        <Modal
          text={
            game.status.winner ? `${game.status.winner.name} wins!` : "Tie!"
          }
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
}