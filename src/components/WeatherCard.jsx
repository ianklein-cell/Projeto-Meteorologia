export default function WeatherCard({ cidade, clima }) {
  if (!clima || !clima.current) return null;

  return (
    <section className="weather-card">
      <h2>{cidade}</h2>
      <div className="weather-temperatura">
        {clima.current.temperature_2m}°C
      </div>
      <div className="weather-info">
        <p>
          <strong>Umidade:</strong>
          <span>{clima.current.relative_humidity_2m}%</span>
        </p>
        <p>
          <strong>Vento:</strong>
          <span>
            {clima.current.wind_speed_10m} {clima.current_units.wind_speed_10m}
          </span>
        </p>
        <p>
          <strong>Índice UV:</strong>
          <span>{clima.current.uv_index ?? "N/A"}</span>
        </p>
        <p>
          <strong>Queda de Neve:</strong>
          <span>
            {clima.current.snowfall > 0
              ? `${clima.current.snowfall} ${clima.current_units?.snowfall || "cm"}`
              : "Sem neve"}
          </span>
        </p>
      </div>
    </section>
  );
}
