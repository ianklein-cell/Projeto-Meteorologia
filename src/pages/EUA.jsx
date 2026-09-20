import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import FavoriteButton from "../components/FavoriteButton";
import AlertCard from "../components/AlertCard";
import { identificarPeriodoDoDia } from "../utils/timezone";

const IMAGEM_FUNDO =
  "https://static.vecteezy.com/ti/vetor-gratis/p1/3701314-icone-do-mapa-dos-eua-gratis-vetor.jpg";

export default function EUA() {
  const [cidade, setCidade] = useState({
    nome: "Nova York",
    pais: "Estados Unidos",
    codigoPais: "US",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
  });

  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem("favoritos");

    if (!salvos) {
      return [];
    }

    try {
      return JSON.parse(salvos);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function pesquisarCidade() {
      if (pesquisa.trim().length < 3) {
        setResultados([]);
        return;
      }

      try {
        const cidades = await BuscarCidades(pesquisa, "US");
        setResultados(cidades);
      } catch {
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

  function alternarFavorito() {
    const jaFavoritado = favoritos.some(
      (favorito) =>
        favorito.nome === cidade.nome &&
        favorito.codigoPais === cidade.codigoPais,
    );

    let novosFavoritos;

    if (jaFavoritado) {
      novosFavoritos = favoritos.filter(
        (favorito) =>
          !(
            favorito.nome === cidade.nome &&
            favorito.codigoPais === cidade.codigoPais
          ),
      );
    } else {
      novosFavoritos = [...favoritos, cidade];
    }

    setFavoritos(novosFavoritos);
    localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
  }

  const favoritoAtual = favoritos.some(
    (favorito) =>
      favorito.nome === cidade.nome &&
      favorito.codigoPais === cidade.codigoPais,
  );
  const periodoDoDia = clima?.current?.time
    ? identificarPeriodoDoDia(
        clima.current.time,
        clima.daily.sunrise[0],
        clima.daily.sunset[0],
      )
    : "dia";
  return (
    <div
      className={`periodo-${periodoDoDia}`}
      style={{
        minHeight: "100vh",
        width: "100%",
        "--imagem-fundo": `url("${IMAGEM_FUNDO}")`,
        backgroundSize: "100% 100%, 1000px",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundAttachment: "fixed",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Link to="/">← Voltar para Home</Link>
      <h1>Estados Unidos 🇺🇸</h1>
      <SearchBar
        valor={pesquisa}
        onChange={setPesquisa}
        resultados={resultados}
        onSelecionar={selecionarCidade}
      />
      <AlertCard tipo="tornado" lat={cidade.latitude} lon={cidade.longitude} />
      {carregando ? (
        <p className="loading">Carregando meteorologia...</p>
      ) : erro ? (
        <p className="error-message">{erro}</p>
      ) : clima && clima.current ? (
        <div>
          <WeatherCard cidade={cidade.nome} clima={clima} />

          <FavoriteButton
            cidade={cidade}
            favorito={favoritoAtual}
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