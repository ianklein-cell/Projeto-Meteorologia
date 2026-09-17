import { useEffect, useState } from "react";
import { BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WatherCard";

const CIDADES_EUA = [
  {
    name: "Nova York",
    lat: 40.7128,
    lon: -74.006,
    timezone: "America/New_York",
  },
  {
    name: "Los Angeles",
    lat: 34.0522,
    lon: -118.2437,
    timezone: "America/Los_Angeles",
  },
  {
    name: "Chicago",
    lat: 41.8781,
    lon: -87.6298,
    timezone: "America/Chicago",
  },
  {
    name: "Houston",
    lat: 29.7604,
    lon: -95.3698,
    timezone: "America/Chicago",
  },
  {
    name: "Miami",
    lat: 25.7617,
    lon: -80.1918,
    timezone: "America/New_York",
  },
];
export default function EUA() {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(CIDADES_EUA[0]);

  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarClima() {
      setCarregando(true);
      setErro("");
      try {
        const dadosClima = await BuscarClima(
          cidadeSelecionada.lat,
          cidadeSelecionada.lon,
          cidadeSelecionada.timezone,
        );
        setClima(dadosClima);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarClima();
  }, [cidadeSelecionada]);
  return (
    <div>
      <h1>Estados Unidos 🇺🇸</h1>
      <div>
        <label htmlFor="city-select">Selecione a cidade:</label>
        <select
          id="city-select"
          value={cidadeSelecionada.name}
          onChange={(event) => {
            const cidade = CIDADES_EUA.find(
              (item) => item.name === event.target.value,
            );
            setCidadeSelecionada(cidade);
          }}
        >
          {CIDADES_EUA.map((cidade) => (
            <option key={cidade.name} value={cidade.name}>
              {cidade.name}
            </option>
          ))}
        </select>
      </div>
      {carregando ? (
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
            timezone={cidadeSelecionada.timezone}
          />
        </div>
      ) : (
        <p>Não foi possível carregar os dados meteorológicos.</p>
      )}
    </div>
  );
}
