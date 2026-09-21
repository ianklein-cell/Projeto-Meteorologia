import ForecastCard from "./ForecastCard";

export default function Forecast({ clima, codigoPais }) {
  return (
    <section>
      <h2>Previsão dos próximos 7 dias</h2>
      <div className="forecastContainer">
        {clima.daily.time.map((dia, index) => (
          <ForecastCard
            key={dia}
            dia={dia}
            maxima={clima.daily.temperature_2m_max[index]}
            minima={clima.daily.temperature_2m_min[index]}
            chuva={clima.daily.precipitation_probability_max[index]}
            weatherCode={clima.daily.weather_code[index]}
            codigoPais={codigoPais}
          />
        ))}
      </div>
    </section>
  );
}