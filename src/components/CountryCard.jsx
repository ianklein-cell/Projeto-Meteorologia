import { Link } from "react-router-dom";
import "./CountryCard.css";

export default function CountryCard({
  nome,
  codigoPais,
  bandeira,
  descricao,
  rota,
  imagem,
  imagemFundo,
}) {
  const imagemCard = imagemFundo || imagem;

  const estiloCard = imagemCard
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65)), url("${imagem}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <article
      className={`countryCard ${imagem ? "comImagem" : ""}`}
      style={estiloCard}
    >
      <div className="countryCardHeader">
        {codigoPais ? (
          <img
            src={`https://flagcdn.com/w80/${codigoPais.toLowerCase()}.png`}
            alt={`Bandeira do ${nome}`}
            className="countryFlagImg"
          />
        ) : (
          <span className="countryFlag" aria-hidden="true">
            {bandeira}
          </span>
        )}
        <h2>{nome}</h2>
      </div>
      <p>{descricao}</p>
      <Link className="countryCardLink" to={rota}>
        Ver meteorologia
      </Link>
    </article>
  );
}
