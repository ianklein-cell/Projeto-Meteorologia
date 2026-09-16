import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className="cabecalho">
      <div className="conteudo-cabecalho">
        <NavLink className="logo" to="/">
          🌤️ Meteorologia
        </NavLink>
        <nav className="navegacao" aria-label="Navegação principal">
          <NavLink className="link-navegacao" to="/">
            Início
          </NavLink>
          <NavLink className="link-navegacao" to="/brasil">
            🇧🇷 Brasil
          </NavLink>
          <NavLink className="link-navegacao" to="/japao">
            🇯🇵 Japão
          </NavLink>
          <NavLink className="link-navegacao" to="/eua">
            🇺🇸 EUA
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
