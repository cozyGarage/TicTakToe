export type Player = {
        id: number,
        name: string,
        iconClass: string,
        colorClass: string,
}
export type move = {
    squareId: number,
    player: Player,
}

export type game = {
    moves: move[],
    status: gameStatus,
}

export type gameStatus = {
    isComplete: boolean,
    winner: Player | null,
}

export type gameState = { 
    currentGameMoves: move[], 
    history: {
      currentRoundGames: game[],
      allGames: game[],
    };
}

