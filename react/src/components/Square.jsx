import PropTypes from "prop-types";
import classNames from "classnames";

export default function Square({ squareId, move, onClick, isGameComplete }) {
  return (
    <button
      id={squareId.toString()}
      className="square shadow"
      onClick={onClick}
      disabled={!!move || isGameComplete}
      aria-label={`Square ${squareId}${
        move ? `, played by ${move.player.name}` : ""
      }`}
    >
      {move && (
        <i
          className={classNames(
            "fa-solid",
            move.player.iconClass,
            move.player.colorClass
          )}
          aria-hidden="true"
        ></i>
      )}
    </button>
  );
}

Square.propTypes = {
  squareId: PropTypes.number.isRequired,
  move: PropTypes.shape({
    player: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      iconClass: PropTypes.string.isRequired,
      colorClass: PropTypes.string.isRequired,
    }).isRequired,
    squareId: PropTypes.number.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  isGameComplete: PropTypes.bool.isRequired,
};
