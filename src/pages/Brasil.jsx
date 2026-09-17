import { useEffect, useState } from "react";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import FavoriteButton from "../components/FavoriteButton";

export default function Brasil() {
  const [cidade, setCidade] = useState({
    nome: "Rio de Janeiro",
    latitude: -22.9068,
    longitude: -43.1729,
    timezone: "America/Sao_Paulo",
  });
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem("favoritos");
    return salvos ? JSON.parse(salvos) : [];
  });
  useEffect(() => {
    async function pesquisarCidade() {
      if (pesquisa.trim().length < 3) {
        setResultados([]);
        return;
      }
      try {
        const cidades = await BuscarCidades(pesquisa, "BR");
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
  function alternarFavorito(nomeCidade) {
    let novosFavoritos;
    if (favoritos.includes(nomeCidade)) {
      novosFavoritos = favoritos.filter((favorito) => favorito !== nomeCidade);
    } else {
      novosFavoritos = [...favoritos, nomeCidade];
    }
    setFavoritos(novosFavoritos);
    localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
  }
  return (
    <div>
      <h1>Brasil 🇧🇷</h1>
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
          <FavoriteButton
            cidade={cidade.nome}
            favorito={favoritos.includes(cidade.nome)}
            onToggle={alternarFavorito}
          />
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
