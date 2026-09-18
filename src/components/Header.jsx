import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="conteudo-cabecalho">
        <h2>Clima Mundial 🌍</h2>
        <nav className="navegacao">
          <Link className="link-navegacao" to="/">
            Início
          </Link>
          <Link className="link-navegacao" to="/brasil">
            Brasil
          </Link>
          <Link className="link-navegacao" to="/japao">
            Japão
          </Link>
          <Link className="link-navegacao" to="/eua">
            EUA
          </Link>
          <Link className="link-navegcao" to="/favoritos">
            Favoritos
          </Link>
        </nav>
      </div>
    </header>
  );
}
