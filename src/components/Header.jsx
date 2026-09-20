import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="conteudoCabecalho">
        <h1>Clima Nexus</h1>
        <nav className="navegacao">
          <NavLink className="linkNavegacao" to="/brasil">
            Brasil
          </NavLink>
          <NavLink className="linkNavegacao" to="/japao">
            Japão
          </NavLink>
          <NavLink className="linkNavegacao" to="/eua">
            EUA
          </NavLink>
          <NavLink className="linkNavegacao" to="/favoritos">
            Favoritos
          </NavLink>
        </nav>
      </div>
    </header>
  );
}