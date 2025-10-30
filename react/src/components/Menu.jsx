import PropTypes from "prop-types";
import classNames from "classnames";
import { useState } from "react";

import "./Menu.css";

export default function Menu({ onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="menu">
      <button
        className="menu-btn"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-label="Game actions menu"
      >
        Actions
        <i
          className={classNames(
            "fa-solid",
            menuOpen ? "fa-chevron-up" : "fa-chevron-down"
          )}
          aria-hidden="true"
        ></i>
      </button>

      {menuOpen && (
        <div className="items border" role="menu">
          <button
            role="menuitem"
            onClick={() => {
              onAction("reset");
              setMenuOpen(false);
            }}
          >
            Reset
          </button>
          <button
            role="menuitem"
            onClick={() => {
              onAction("new-round");
              setMenuOpen(false);
            }}
          >
            New Round
          </button>
        </div>
      )}
    </div>
  );
}

Menu.propTypes = {
  onAction: PropTypes.func.isRequired,
};