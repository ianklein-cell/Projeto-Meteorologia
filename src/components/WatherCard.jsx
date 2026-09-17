export default function WeatherCard({ cidade, clima }) {
  return (
    <section className="weather-card">
      <h2>{cidade}</h2>
      <div className="weather-temperatura">
        {clima.current.temperature_2m}°C
      </div>
      <div className="weather-info">
        <p>
          <strong>{Umidade}</strong>
          <span>{clima.current.ralative_humidity_2m}%</span>
        </p>
        <p>
          <strong>Vento</strong>
          <span>
            {clima.current.wind_speed_10m}
            {""}
            {clima.current_units.wind_speed_10m}
          </span>
        </p>
      </div>
    </section>
  );
}
