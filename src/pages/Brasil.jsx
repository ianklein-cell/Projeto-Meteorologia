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
const IMAGEM_FUNDO = "/FundoBrasilCard.webp";

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
      className={`brasilContainer periodo${periodoDoDia}`}
      style={{ "--imagem-fundo": `url("${IMAGEM_FUNDO}")` }}
    >
      <div className="conteudoCentralizado">
        <Link to="/" className="btnVoltar">
          ← Voltar para Home
        </Link>
        <h1>Brasil 🇧🇷</h1>

        {/* Barra de pesquisa e botão de favorito lado a lado */}
        <div className="secaoBusca">
          <div className="cardElemento cardBusca">
            <SearchBar
              valor={pesquisa}
              onChange={setPesquisa}
              resultados={resultados}
              onSelecionar={selecionarCidade}
            />
          </div>
          <div className="cardElemento cardFavorito">
            <FavoriteButton
              cidade={cidade}
              favorito={favoritoAtual}
              onToggle={alternarFavorito}
            />
          </div>
        </div>

        {carregando ? (
          <div className="cardElemento cardMensagem">
            <p className="mensagemCarregando">Carregando meteorologia...</p>
          </div>
        ) : erro ? (
          <div className="cardElemento cardMensagem">
            <p className="mensagemErro">{erro}</p>
          </div>
        ) : clima && clima.current ? (
          <div className="conteudoClima">
            <div className="cardElemento cardClimaPrincipal">
              <WeatherCard cidade={cidade.nome} clima={clima} />
              <p className="textoFuso">
                <strong>Fuso horário:</strong> {cidade.timezone}
              </p>
            </div>

            {/* Previsão diária em cards individuais */}
            <div className="secaoPrevisao">
              <Forecast clima={clima} />
            </div>

            <div className="cardElemento cardLua">
              <Moon
                lat={cidade.latitude}
                lon={cidade.longitude}
                timezone={cidade.timezone}
              />
            </div>
          </div>
        ) : (
          <div className="cardElemento cardMensagem">
            <p className="mensagemAviso">
              Não foi possível carregar os dados meteorológicos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
