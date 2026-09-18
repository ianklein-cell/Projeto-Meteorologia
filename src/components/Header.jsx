import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="conteudoCabecalho">
        <h2>NOME DO SITE</h2>
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