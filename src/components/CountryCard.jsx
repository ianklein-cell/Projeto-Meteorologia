import { Link } from "react-router-dom";

export default function CountryCard({ nome, bandeira, descricao, rota }) {
  return (
    <article className="country-card">
      <div className="country-card-header">
        <span className="country-flag" aria-hidden="true">
          {bandeira}
        </span>
        <h2>{nome}</h2>
      </div>
      <p>{descricao}</p>
      <Link className="country-card-link" to={rota}>
        Ver meteorologia
      </Link>
    </article>
  );
}
