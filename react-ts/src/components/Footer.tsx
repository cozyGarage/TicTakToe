import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <p>
        Original project by
        <a href="https://twitter.com/megfdev">@megfdev</a> and
        <a href="https://twitter.com/Ivan00sto">@Ivan00Sto</a>
      </p>

      <p>
        Refactored by
        <a
          href="https://github.com/cozyGarage" target="_blank" rel="noreferrer"
          style={{ color: "var(--turquoise)" }}
        >
          cozyGarage
        </a>
      </p>
    </footer>
  );
}