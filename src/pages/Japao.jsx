import { useEffect, useState } from "react";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import { Link } from "react-router-dom";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";

export default function Japao() {
  const [cidade, setCidade] = useState({
    nome: "Tóquio",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
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
        const cidades = await BuscarCidades(pesquisa, "JP");
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
      <Link to="/">← Voltar para Home</Link>

      <h1>Meteorologia no Japão 🇯🇵</h1>

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
