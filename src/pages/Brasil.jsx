import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import Moon from "../components/Moon";
import Forecast from "../components/Forecast";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import FavoriteButton from "../components/FavoriteButton";
import { identificarPeriodoDoDia } from "../utils/timezone";
import "./Brasil.css";

const imagemFundoBrasil =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.wired.com%2Fphotos%2F63dd40bb84464089ca2fc6ab%2Fmaster%2Fw_2560%252Cc_limit%2FSci-amazon-1322470077.jpg&f=1&nofb=1&ipt=ffd9fd4f800dceadb73dcf25b5f9397530889fb868bf3143ec391bbbd3d37763";

export default function Brasil() {
  const [cidade, setCidade] = useState({
    nome: "Rio de Janeiro",
    pais: "Brasil",
    codigoPais: "BR",
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
    if (!salvos) return [];
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
        const cidades = await BuscarCidades(pesquisa, "BR");
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
          cidade.timezone
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
        favorito.codigoPais === cidade.codigoPais
    );
    let novosFavoritos;
    if (jaFavoritado) {
      novosFavoritos = favoritos.filter(
        (favorito) =>
          !(
            favorito.nome === cidade.nome &&
            favorito.codigoPais === cidade.codigoPais
          )
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
      favorito.codigoPais === cidade.codigoPais
  );

  const periodoDoDia = clima?.current?.time
    ? identificarPeriodoDoDia(
        clima.current.time,
        clima.daily.sunrise[0],
        clima.daily.sunset[0]
      )
    : "dia";

  return (
    <div
      className={`paginaBrasil periodo-${periodoDoDia}`}
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)), url("${imagemFundoBrasil}")`,
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
        Meteorologia no Brasil{" "}
        <img
          src="https://flagcdn.com/w40/br.png"
          alt="Bandeira do Brasil"
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

      {carregando ? (
        <p className="loading">Carregando meteorologia...</p>
      ) : erro ? (
        <p className="errorMessage">{erro}</p>
      ) : clima && clima.current ? (
        <div className="conteudoClima">
          <WeatherCard cidade={cidade.nome} clima={clima} />

          <p className="textoFuso">
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
        <p className="mensagemAviso">
          Não foi possível carregar os dados meteorológicos.
        </p>
      )}
    </div>
  );
}