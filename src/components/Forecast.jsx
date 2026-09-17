import ForecastCard from "./ForecastCard";

export default function Forecast({ clima }) {
  return (
    <section>
      <h2>Previsão dos próximos 7 dias</h2>
      <div className="forecast-container">
        {clima.daily.time.map((dia, index) => (
          <ForecastCard
            key={dia}
            dia={dia}
            maxima={clima.daily.temperature_2m_max[index]}
            minima={clima.daily.temperature_2m_min[index]}
            chuva={clima.daily.precipitation_probability_max[index]}
          />
        ))}
      </div>
    </section>
  );
}
