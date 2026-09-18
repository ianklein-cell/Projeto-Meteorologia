import { Link } from "react-router-dom";
import "./CountryCard.css";

export default function CountryCard({ nome, bandeira, descricao, rota }) {
  return (
    <article className="countryCard">
      <div className="countryCardHeader">
        <span className="countryFlag" aria-hidden="true">
          {bandeira}
        </span>
        <h2>{nome}</h2>
      </div>
      <p>{descricao}</p>
      <Link className="countryCardLink" to={rota}>
        Ver meteorologia
      </Link>
    </article>
  );
}