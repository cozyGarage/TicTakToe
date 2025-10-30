import PropTypes from "prop-types";

export default function ScoreBoard({ stats }) {
  return (
    <>
      <div
        className="score shadow"
        style={{ backgroundColor: "var(--turquoise)" }}
        aria-label="Player 1 score"
      >
        <p>Player 1</p>
        <span>{stats.playersWithStats[0].wins} Wins</span>
      </div>
      <div
        className="score shadow"
        style={{ backgroundColor: "var(--light-gray)" }}
        aria-label="Tie score"
      >
        <p>Ties</p>
        <span>{stats.ties}</span>
      </div>
      <div
        className="score shadow"
        style={{ backgroundColor: "var(--yellow)" }}
        aria-label="Player 2 score"
      >
        <p>Player 2</p>
        <span>{stats.playersWithStats[1].wins} Wins</span>
      </div>
    </>
  );
}

ScoreBoard.propTypes = {
  stats: PropTypes.shape({
    playersWithStats: PropTypes.arrayOf(
      PropTypes.shape({
        wins: PropTypes.number.isRequired,
      })
    ).isRequired,
    ties: PropTypes.number.isRequired,
  }).isRequired,
};
