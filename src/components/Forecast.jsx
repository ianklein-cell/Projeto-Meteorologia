export default function ForecastCard({ dia, maxima, minima, chuva }) {
  const dataFormatada = new Date(dia + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "8px", minWidth: "120px" }}>
      <h4>{dataFormatada}</h4>
      <p><strong>Máx:</strong> {maxima}°C</p>
      <p><strong>Mín:</strong> {minima}°C</p>
      <p><strong>Chuva:</strong> {chuva}%</p>
    </div>
  );
}