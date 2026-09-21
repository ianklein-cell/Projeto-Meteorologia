import { Link } from "react-router-dom";
import "./Error404.css";

export default function Error404() {
  return (
    <div className="errorContainer">
      <div className="errorCard">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        <Link to="/" className="btnVoltarHome">
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}