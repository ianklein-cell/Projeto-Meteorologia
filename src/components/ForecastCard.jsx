import clearDay from "@meteocons/svg/fill/clear-day.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import overcast from "@meteocons/svg/fill/overcast.svg";
import fog from "@meteocons/svg/fill/fog.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import thunderstorms from "@meteocons/svg/fill/thunderstorms.svg";

function obterCondicao(weatherCode) {
  if (weatherCode === 0) {
    return {
      icone: clearDay,
      descricao: "Céu limpo",
    };
  }
  if (weatherCode === 1) {
    return {
      icone: clearDay,
      descricao: "Principalmente limpo",
    };
  }
  if (weatherCode === 2) {
    return {
      icone: partlyCloudyDay,
      descricao: "Parcialmente nublado",
    };
  }
  if (weatherCode === 3) {
    return {
      icone: overcast,
      descricao: "Nublado",
    };
  }
  if ([45, 48].includes(weatherCode)) {
    return {
      icone: fog,
      descricao: "Neblina",
    };
  }
  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return {
      icone: drizzle,
      descricao: "Garoa",
    };
  }
  if ([61, 63, 65, 66, 67].includes(weatherCode)) {
    return {
      icone: rain,
      descricao: "Chuva",
    };
  }
  if ([71, 73, 75, 77].includes(weatherCode)) {
    return {
      icone: snow,
      descricao: "Neve",
    };
  }
  if ([80, 81, 82].includes(weatherCode)) {
    return {
      icone: rain,
      descricao: "Pancadas de chuva",
    };
  }
  if ([85, 86].includes(weatherCode)) {
    return {
      icone: snow,
      descricao: "Pancadas de neve",
    };
  }
  if ([95, 96, 99].includes(weatherCode)) {
    return {
      icone: thunderstorms,
      descricao: "Tempestade",
    };
  }
  return {
    icone: partlyCloudyDay,
    descricao: "Condição desconhecida",
  };
}
export default function ForecastCard({
  dia,
  maxima,
  minima,
  chuva,
  weatherCode,
}) {
  const condicao = obterCondicao(weatherCode);
  return (
    <article className="forecast-card">
      <h3>{dia}</h3>

      <div className="icone-tempo">
        <img
          src={condicao.icone}
          alt={condicao.descricao}
          width="64"
          height="64"
          loading="lazy"
        />
      </div>
      <p className="condicao-tempo">{condicao.descricao}</p>
      <p>
        <strong>Máxima:</strong> {maxima} °C
      </p>
      <p>
        <strong>Mínima:</strong> {minima} °C
      </p>
      <p>
        <strong>Chuva:</strong> {chuva}%
      </p>
    </article>
  );
}
