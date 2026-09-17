import { useEffect, useState } from "react";
import { BuscarCidade, BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WatherCard";

const CIDADES_BRASIL = [
  {
    name: "Rio de Janeiro",
    busca: "Rio de Janeiro",
  },
  {
    name: "São Paulo",
    busca: "São Paulo",
  },
  {
    name: "Brasília",
    busca: "Brasília",
  },
  {
    name: "Salvador",
    busca: "Salvador",
  },
  {
    name: "Porto Alegre",
    busca: "Porto Alegre",
  },
];

export default function Brasil() {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(CIDADES_BRASIL[0]);

  const [cidade, setCidade] = useState(null);
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarClima() {
      setCarregando(true);
      setErro("");

      try {
        const dadosCidade = await BuscarCidade(cidadeSelecionada.busca);

        setCidade(dadosCidade);

        const dadosClima = await BuscarClima(
          dadosCidade.latitude,
          dadosCidade.longitude,
          dadosCidade.timezone,
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
      <h1>Brasil 🇧🇷</h1>

      <div>
        <label htmlFor="city-select">Selecione a cidade:</label>

        <select
          id="city-select"
          value={cidadeSelecionada.name}
          onChange={(event) => {
            const cidade = CIDADES_BRASIL.find(
              (item) => item.name === event.target.value,
            );

            setCidadeSelecionada(cidade);
          }}
        >
          {CIDADES_BRASIL.map((cidade) => (
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
      ) : cidade && clima && clima.current ? (
        <div>
          <WeatherCard cidade={cidade.nome} clima={clima} />

          <p>
            <strong>Fuso horário:</strong> {cidade.timezone}
          </p>

          <Forecast clima={clima} />

          <Moon
            lat={cidade.latitude}
            lon={cidade.longitude}
            timezone={cidade.timezone}
          />
        </div>
      ) : (
        <p>Não foi possível carregar os dados meteorológicos.</p>
      )}
    </div>
  );
}
