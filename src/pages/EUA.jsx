import { useEffect, useState } from "react";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";

export default function EUA() {
  const [cidade, setCidade] = useState({
    nome: "Nova York",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
  });
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    async function pesquisarCidade() {
      if (pesquisa.trim().length < 3) {
        setResultados([]);
        return;
      }
      try {
        const cidades = await BuscarCidades(pesquisa, "US");
        setResultados(cidades);
      } catch (error) {
        setResultados([]);
      }
    }
    const timer = setTimeout(pesquisarCidade, 500);
    return () => clearTimeout(timer);
  }, [pesquisa]);
  useEffect(() => {
    async function carregarClima() {
      setCarregando(true);
      setErro("");
      try {
        const dadosClima = await BuscarClima(
          cidade.latitude,
          cidade.longitude,
          cidade.timezone,
        );
        setClima(dadosClima);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarClima();
  }, [cidade]);
  function selecionarCidade(novaCidade) {
    setCidade(novaCidade);
    setPesquisa("");
    setResultados([]);
  }
  return (
    <div>
      <h1>Estados Unidos 🇺🇸</h1>
      <SearchBar
        valor={pesquisa}
        onChange={setPesquisa}
        resultados={resultados}
        onSelecionar={selecionarCidade}
      />
      {carregando ? (
        <p className="loading">Carregando meteorologia...</p>
      ) : erro ? (
        <p className="error-message">{erro}</p>
      ) : clima && clima.current ? (
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
