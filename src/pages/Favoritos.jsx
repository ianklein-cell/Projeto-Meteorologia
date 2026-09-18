import { useEffect, useState } from "react";
import { BuscarCidades, BuscarClima } from "../services/WeatherApi";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import Moon from "../components/Moon";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [climas, setClimas] = useState({});
  const [carregando, setCarregando] = useState(false);
  useEffect(() => {
    async function carregarFavoritos() {
      const salvos = localStorage.getItem("favoritos");
      if (!salvos) {
        return;
      }
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
    setCarregando(true);
    try {
      const clima = await BuscarClima(
        cidade.latitude,
        cidade.longitude,
        cidade.timezone,
      );
      setClimas((anteriores) => ({
        ...anteriores,
        [cidade.nome + cidade.codigoPais]: clima,
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
    setFavoritos(novosFavoritos);
    localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
    setClimas((anteriores) => {
      const novosClimas = { ...anteriores };
      delete novosClimas[cidade.nome + cidade.codigoPais];
      return novosClimas;
    });
  }
  return (
    <div>
      <h1>Meus Favoritos</h1>
      {favoritos.length === 0 ? (
        <p>Nenhuma cidade favoritada.</p>
      ) : (
        <div>
          {favoritos.map((cidade) => {
            const chave = cidade.nome + cidade.codigoPais;
            const clima = climas[chave];
            return (
              <div key={chave}>
                <h2>
                  {cidade.nome} - {cidade.pais}
                </h2>
                <button
                  type="button"
                  onClick={() => verClima(cidade)}
                  disabled={carregando}
                >
                  {carregando ? "Carregando..." : "Ver clima"}
                </button>

                <button type="button" onClick={() => removerFavorito(cidade)}>
                  Remover dos favoritos
                </button>
                {clima && (
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
