import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">

      <div>
        <h1>
          🏆 KIELBUS CUP 21
        </h1>

        <span>
          Registro oficial del torneo
        </span>
      </div>

      <nav className="header-nav">

        <Link to="/admin-login">
          👑 Administrador
        </Link>

      </nav>

    </header>
  );
}