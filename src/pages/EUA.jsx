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
import "./EUA.css";
import ForecastGraph from "../components/ForecastGraph";

const IMAGEM_FUNDO =
  "https://ondeirestadosunidos.com.br/wp-content/uploads/2025/01/Snow-covered-Commonwealth-Avenue-through-the-Back-Bay-neighborhood-of-Boston-1024x576.webp";

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
      className={`pagina-eua periodo-${periodoDoDia}`}
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url("${IMAGEM_FUNDO}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Link to="/" className="btnVoltar">
        ← Voltar para Home
      </Link>

      <h1>
        Meteorologia no Estados Unidos{" "}
        <img
          src="https://flagcdn.com/w40/us.png"
          alt="Bandeira dos Estados Unidos"
          className="bandeiraHeader"
        />
      </h1>

      <div className="secaoBusca">
        <SearchBar
          valor={pesquisa}
          onChange={setPesquisa}
          resultados={resultados}
          onSelecionar={selecionarCidade}
        />
        <FavoriteButton
          cidade={cidade}
          favorito={favoritoAtual}
          onToggle={alternarFavorito}
        />
      </div>

      <AlertCard tipo="tornado" lat={cidade.latitude} lon={cidade.longitude} />

      {carregando ? (
        <p className="loading">Carregando meteorologia...</p>
      ) : erro ? (
        <p className="error-message">{erro}</p>
      ) : clima && clima.current ? (
        <div className="conteudoClima">
          <WeatherCard
            cidade={cidade.nome}
            clima={clima}
            codigoPais={cidade.codigoPais}
          />

          <p className="textoFuso">
            <strong>Fuso horário:</strong> {cidade.timezone}
          </p>

          <Forecast clima={clima} codigoPais={cidade.codigoPais} />
          <ForecastGraph
            clima={clima}
            nomeCidade={cidade.nome}
            timezone={cidade.timezone}
            codigoPais={cidade.codigoPais}
          />
          <Moon
            lat={cidade.latitude}
            lon={cidade.longitude}
            timezone={cidade.timezone}
          />
        </div>
      ) : (
        <p className="mensagemAviso">
          Não foi possível carregar os dados meteorológicos.
        </p>
      )}
    </div>
  );
}
