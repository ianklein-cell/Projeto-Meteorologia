import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import ForecastGraph from "../components/ForecastGraph";
import Moon from "../components/Moon";
import { identificarPeriodoDoDia } from "../utils/timezone";
import "./Favoritos.css";
import "./Japao.css";
import "./Brasil.css";
import "./EUA.css";

const IMAGEM_FUNDO_JAPAO =
  "https://flipjapanguide.com/wp-content/uploads/2022/12/What-to-do-when-it-rains-in-Tokyo-Featured-Image.jpg.webp";

const IMAGEM_FUNDO_BRASIL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.wired.com%2Fphotos%2F63dd40bb84464089ca2fc6ab%2Fmaster%2Fw_2560%252Cc_limit%2FSci-amazon-1322470077.jpg&f=1&nofb=1&ipt=ffd9fd4f800dceadb73dcf25b5f9397530889fb868bf3143ec391bbbd3d37763";

const IMAGEM_FUNDO_EUA =
  "https://ondeirestadosunidos.com.br/wp-content/uploads/2025/01/Snow-covered-Commonwealth-Avenue-through-the-Back-Bay-neighborhood-of-Boston-1024x576.webp";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [climas, setClimas] = useState({});
  const [cidadeAberta, setCidadeAberta] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregarFavoritos() {
      const salvos = localStorage.getItem("favoritos");

      if (!salvos) return;

      try {
        const dados = JSON.parse(salvos);
        const favoritosCompletos = [];

        for (const favorito of dados) {
          if (typeof favorito === "object") {
            favoritosCompletos.push(favorito);
            continue;
          }

          const buscas = await Promise.all([
            BuscarCidades(favorito, "BR"),
            BuscarCidades(favorito, "JP"),
            BuscarCidades(favorito, "US"),
          ]);

          const cidadeEncontrada = buscas
            .flat()
            .find(
              (cidade) => cidade.nome.toLowerCase() === favorito.toLowerCase(),
            );

          if (cidadeEncontrada) {
            favoritosCompletos.push(cidadeEncontrada);
          }
        }

        setFavoritos(favoritosCompletos);
        localStorage.setItem("favoritos", JSON.stringify(favoritosCompletos));
      } catch {
        setFavoritos([]);
      }
    }

    carregarFavoritos();
  }, []);

  async function verClima(cidade) {
    const chave = cidade.nome + cidade.codigoPais;

    if (cidadeAberta === chave) {
      setCidadeAberta(null);
      return;
    }

    setCidadeAberta(chave);

    if (climas[chave]) return;

    setCarregando(true);

    try {
      const climaDados = await BuscarClima(
        cidade.latitude,
        cidade.longitude,
        cidade.timezone,
      );

      let climaTratado = climaDados;

      if (cidade.codigoPais === "BR") {
        const codigosNeve = [56, 57, 66, 67, 71, 73, 75, 77, 85, 86];

        climaTratado = {
          ...climaDados,

          current: {
            ...climaDados.current,
            weather_code: codigosNeve.includes(climaDados.current?.weather_code)
              ? 61
              : climaDados.current?.weather_code,
          },

          daily: {
            ...climaDados.daily,
            weather_code: climaDados.daily?.weather_code?.map((codigo) =>
              codigosNeve.includes(codigo) ? 61 : codigo,
            ),
          },
        };
      }

      setClimas((anteriores) => ({
        ...anteriores,
        [chave]: climaTratado,
      }));
    } finally {
      setCarregando(false);
    }
  }

  function removerFavorito(cidade) {
    const novosFavoritos = favoritos.filter(
      (favorito) =>
        !(
          favorito.nome === cidade.nome &&
          favorito.codigoPais === cidade.codigoPais
        ),
    );

    const chave = cidade.nome + cidade.codigoPais;

    setFavoritos(novosFavoritos);

    localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));

    setClimas((anteriores) => {
      const novosClimas = { ...anteriores };

      delete novosClimas[chave];

      return novosClimas;
    });

    if (cidadeAberta === chave) {
      setCidadeAberta(null);
    }
  }

  return (
    <div className="favoritosContainer">
      <div className="favoritosConteudo">
        <Link to="/" className="btnVoltar">
          ← Voltar para Home
        </Link>

        <h1>Meus Favoritos</h1>

        {favoritos.length === 0 ? (
          <p>Nenhuma cidade favoritada.</p>
        ) : (
          <div className="listaFavoritos">
            {favoritos.map((cidade) => {
              const chave = cidade.nome + cidade.codigoPais;
              const clima = climas[chave];
              const aberto = cidadeAberta === chave;

              const classePais =
                cidade.codigoPais === "JP"
                  ? " favorito-japao"
                  : cidade.codigoPais === "BR"
                    ? " favorito-brasil"
                    : cidade.codigoPais === "US"
                      ? " favorito-eua"
                      : "";

              const japones = cidade.codigoPais === "JP";
              const brasileiro = cidade.codigoPais === "BR";
              const americano = cidade.codigoPais === "US";

              const periodoDoDia =
                clima?.current?.time &&
                clima?.daily?.sunrise?.[0] &&
                clima?.daily?.sunset?.[0]
                  ? identificarPeriodoDoDia(
                      clima.current.time,
                      clima.daily.sunrise[0],
                      clima.daily.sunset[0],
                    )
                  : "dia";

              return (
                <div key={chave} className={`favoritoItem${classePais}`}>
                  <h2>
                    {cidade.nome} - {cidade.pais}
                  </h2>

                  <div className="botoesFavorito">
                    <button type="button" onClick={() => verClima(cidade)}>
                      {carregando && aberto
                        ? "Carregando..."
                        : aberto
                          ? "Fechar clima"
                          : "Ver clima"}
                    </button>

                    <button
                      type="button"
                      onClick={() => removerFavorito(cidade)}
                    >
                      Remover dos favoritos
                    </button>
                  </div>

                  {aberto && clima && (
                    <div
                      className={
                        japones
                          ? `climaFavorito pagina-japao periodo-${periodoDoDia}`
                          : brasileiro
                            ? `climaFavorito paginaBrasil periodo-${periodoDoDia}`
                            : americano
                              ? `climaFavorito pagina-eua periodo-${periodoDoDia}`
                              : "climaFavorito"
                      }
                      style={
                        japones
                          ? {
                              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url("${IMAGEM_FUNDO_JAPAO}")`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              borderRadius: "16px",
                              padding: "20px",
                            }
                          : brasileiro
                            ? {
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)), url("${IMAGEM_FUNDO_BRASIL}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                borderRadius: "16px",
                                padding: "20px",
                              }
                            : americano
                              ? {
                                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url("${IMAGEM_FUNDO_EUA}")`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                  borderRadius: "16px",
                                  padding: "20px",
                                }
                              : undefined
                      }
                    >
                      <WeatherCard
                        cidade={cidade.nome}
                        clima={clima}
                        codigoPais={cidade.codigoPais}
                      />

                      <p>
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
                        codigoPais={cidade.codigoPais}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
