import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="conteudoCabecalho">
        <h1>Clima Nexus</h1>
        <nav className="navegacao">
          <Link className="linkNavegacao" to="/brasil">
            Brasil
          </Link>
          <Link className="linkNavegacao" to="/japao">
            Japão
          </Link>
          <Link className="linkNavegacao" to="/eua">
            EUA
          </Link>
          <Link className="linkNavegacao" to="/favoritos">
            Favoritos
          </Link>
        </nav>
      </div>
    </header>
  );
}