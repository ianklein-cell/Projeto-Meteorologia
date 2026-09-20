import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import Moon from "../components/Moon";
import { identificarPeriodoDoDia } from "../utils/timezone";
import "./Favoritos.css";
import "./Japao.css";

const IMAGEM_FUNDO_JAPAO =
  "https://media.istockphoto.com/id/2189197752/pt/vetorial/japan-the-country-silhouette-on-the-national-flag.jpg?s=612x612&w=0&k=20&c=DxwwAPbJNocH-nHDXuszDb8vZtxjhr0cJg38sQ15rS8=";

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
      const clima = await BuscarClima(
        cidade.latitude,
        cidade.longitude,
        cidade.timezone,
      );

      setClimas((anteriores) => ({
        ...anteriores,
        [chave]: clima,
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
              cidade.codigoPais === "JP" ? " favorito-japao" : "";

            const japones = cidade.codigoPais === "JP";

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

                  <button type="button" onClick={() => removerFavorito(cidade)}>
                    Remover dos favoritos
                  </button>
                </div>

                {aberto && clima && (
                  <div
                    className={
                      japones
                        ? `climaFavorito pagina-japao periodo-${periodoDoDia}`
                        : "climaFavorito"
                    }
                    style={
                      japones
                        ? {
                            "--imagem-fundo": `url("${IMAGEM_FUNDO_JAPAO}")`,
                          }
                        : undefined
                    }
                  >
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
