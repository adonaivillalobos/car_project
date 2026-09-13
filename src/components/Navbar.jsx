import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        🎬 MovieFinder
      </Link>
    </header>
  );
}

export default Navbar;