import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import FavoriteButton from "../components/FavoriteButton";
import AlertCard from "../components/AlertCard";
import ForecastGraph from "../components/ForecastGraph";
import { identificarPeriodoDoDia } from "../utils/timezone";
import "./Japao.css";

const IMAGEM_FUNDO =
  "https://flipjapanguide.com/wp-content/uploads/2022/12/What-to-do-when-it-rains-in-Tokyo-Featured-Image.jpg.webp";

export default function Japao() {
  const [cidade, setCidade] = useState({
    nome: "Tóquio",
    pais: "Japão",
    codigoPais: "JP",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
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
        const cidades = await BuscarCidades(pesquisa, "JP");
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
      className={`pagina-japao periodo-${periodoDoDia}`}
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)), url("${IMAGEM_FUNDO}")`,
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
        Meteorologia no Japão{" "}
        <img
          src="https://flagcdn.com/w40/jp.png"
          alt="Bandeira do Japão"
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

      <AlertCard
        tipo="terremoto"
        lat={cidade.latitude}
        lon={cidade.longitude}
      />

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
        <p className="mensagemAviso">Não foi possível carregar os dados meteorológicos.</p>
      )}
    </div>
  );
}
