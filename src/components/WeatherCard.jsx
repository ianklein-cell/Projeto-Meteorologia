export default function WeatherCard({ cidade, clima, codigoPais }) {
  const eBrasil = codigoPais === "BR";

  const uvIndex =
    clima?.current?.uv_index ?? clima?.daily?.uv_index_max?.[0];

  return (
    <section className="weather-card">
      <h2>{cidade}</h2>
      <div className="weather-temperatura">
        {clima?.current?.temperature_2m}°C
      </div>
      <div className="weather-info">
        <p>
          <strong>Umidade:</strong>
          <span>{clima?.current?.relative_humidity_2m}%</span>
        </p>
        <p>
          <strong>Vento:</strong>
          <span>
            {clima?.current?.wind_speed_10m}{" "}
            {clima?.current_units?.wind_speed_10m}
          </span>
        </p>
        {uvIndex !== undefined && (
          <p>
            <strong>Índice UV:</strong>
            <span>{uvIndex}</span>
          </p>
        )}
        {!eBrasil && (
          <p>
            <strong>Queda de Neve:</strong>
            <span>
              {clima?.current?.snowfall && clima.current.snowfall > 0
                ? `${clima.current.snowfall} cm`
                : "Sem neve"}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}