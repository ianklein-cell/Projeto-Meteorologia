import { Link } from "react-router-dom";
import "./CountryCard.css";

export default function CountryCard({
  nome,
  codigoPais,
  descricao,
  rota,
  imagemFundo,
}) {
  const estiloCard = imagemFundo
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65)), url("${imagemFundo}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <article
      className={`countryCard ${imagemFundo ? "comImagem" : ""}`}
      style={estiloCard}
    >
      <div className="countryCardHeader">
        <img
          src={`https://flagcdn.com/w80/${codigoPais.toLowerCase()}.png`}
          alt={`Bandeira do ${nome}`}
          className="countryFlagImg"
        />
        <h2>{nome}</h2>
      </div>
      <p>{descricao}</p>
      <Link className="countryCardLink" to={rota}>
        Ver meteorologia
      </Link>
    </article>
  );
}