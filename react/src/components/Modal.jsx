import PropTypes from "prop-types";
import "./Modal.css";

export default function Modal({ text, onClick }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-text">
      <div className="modal-contents">
        <p id="modal-text">{text}</p>
        <button onClick={onClick} autoFocus>
          Play again
        </button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};