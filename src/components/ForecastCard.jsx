export default function ForecastCard({ dia, maxima, minima, chuva }) {
  return (
    <article className="forecast-card">
      <h3>{dia}</h3>
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
