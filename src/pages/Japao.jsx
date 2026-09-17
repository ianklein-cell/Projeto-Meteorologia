import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WatherCard";

const CIDADES_JAPAO = [
  { name: "Tóquio", lat: 35.6762, lon: 139.6503 },
  { name: "Osaka", lat: 34.6937, lon: 135.5023 },
  { name: "Quioto", lat: 35.0116, lon: 135.7681 },
  { name: "Sapporo", lat: 43.0621, lon: 141.3544 },
  { name: "Fukuoka", lat: 33.5904, lon: 130.4017 },
];

export default function Japao() {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(CIDADES_JAPAO[0]);
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarClima() {
      setLoading(true);
      setErro("");
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${cidadeSelecionada.lat}&longitude=${cidadeSelecionada.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&forecast_days=7&timezone=Asia%2FTokyo`,
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar o clima.");
        }
        const data = await response.json();
        setClima(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarClima();
  }, [cidadeSelecionada]);
  return (
    <div>
      <Link to="/">← Voltar para Home</Link>
      <h1>Meteorologia no Japão 🇯🇵</h1>
      <div>
        <label htmlFor="city-select">Selecione a cidade:</label>
        <select
          id="city-select"
          value={cidadeSelecionada.name}
          onChange={(event) => {
            const cidade = CIDADES_JAPAO.find(
              (item) => item.name === event.target.value,
            );
            setCidadeSelecionada(cidade);
          }}
        >
          {CIDADES_JAPAO.map((cidade) => (
            <option key={cidade.name} value={cidade.name}>
              {cidade.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="loading">Carregando meteorologia...</p>
      ) : erro ? (
        <p className="error-message">{erro}</p>
      ) : clima && clima.current ? (
        <div>
          <WeatherCard cidade={cidadeSelecionada.name} clima={clima} />
          <p>
            <strong>Fuso horário:</strong> {clima.timezone}
          </p>
          <Forecast clima={clima} />
          <Moon
            lat={cidadeSelecionada.lat}
            lon={cidadeSelecionada.lon}
            timezone="Asia/Tokyo"
          />
        </div>
      ) : (
        <p>Não foi possível carregar os dados meteorológicos.</p>
      )}
    </div>
  );
}
