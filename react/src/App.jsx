import "./App.css";

import { useMemo, useCallback } from "react";
import classNames from "classnames";

import { useLocalStorage } from "./useLocalStorage";
import { deriveStats, deriveGame } from "./utils";
import { INITIAL_STATE, STORAGE_KEY } from "./constants";

import Footer from "./components/Footer";
import Modal from "./components/Modal";
import Menu from "./components/Menu";
import Square from "./components/Square";
import ScoreBoard from "./components/ScoreBoard";

export default function App() {
  const [state, setState] = useLocalStorage(STORAGE_KEY, INITIAL_STATE);

  const game = useMemo(() => deriveGame(state), [state]);
  const stats = useMemo(() => deriveStats(state), [state]);

  const resetGame = useCallback(
    (isNewRound) => {
      setState((prevState) => {
        const stateCopy = structuredClone(prevState);

        if (game.status.isComplete) {
          const { moves, status } = game;
          stateCopy.history.currentRoundGames.push({
            moves,
            status,
          });
        }

        stateCopy.currentGameMoves = [];

        if (isNewRound) {
          stateCopy.history.allGames.push(...stateCopy.history.currentRoundGames);
          stateCopy.history.currentRoundGames = [];
        }

        return stateCopy;
      });
    },
    [game, setState]
  );

  const handlePlayerMove = useCallback(
    (squareId, player) => {
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
    },
    [setState]
  );

  return (
    <>
      <main>
        <div className="grid" role="application" aria-label="Tic Tac Toe Game">
          <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <i
              className={classNames("fa-solid", game.currentPlayer.iconClass)}
              aria-hidden="true"
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
              <Square
                key={squareId}
                squareId={squareId}
                move={existingMove}
                onClick={() => {
                  if (!existingMove && !game.status.isComplete) {
                    handlePlayerMove(squareId, game.currentPlayer);
                  }
                }}
                isGameComplete={game.status.isComplete}
              />
            );
          })}

          <ScoreBoard stats={stats} />
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