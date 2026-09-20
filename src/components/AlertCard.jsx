import { useState, useEffect } from "react";
import "./AlertCard.css";

export default function AlertCard({ tipo, lat, lon }) {
  const [alerta, setAlerta] = useState(null);
  const [listaTerremotos, setListaTerremotos] = useState([]);
  const [indiceSelecionado, setIndiceSelecionado] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [foiVisualizado, setFoiVisualizado] = useState(false);

  useEffect(() => {
    async function buscarAlertas() {
      setCarregando(true);

      try {
        if (tipo === "tornado") {
          const resposta = await fetch(
            `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
          );
          const dados = await resposta.json();
          const avisos = dados.features || [];
          const avisoTornado = avisos.find(
            (item) =>
              item.properties.event.toLowerCase().includes("tornado") ||
              item.properties.event.toLowerCase().includes("storm"),
          );

          if (avisoTornado) {
            const idAlerta = avisoTornado.id;
            const alertasVistos = JSON.parse(
              localStorage.getItem("alertasVistos") || "[]",
            );
            const jaVisto = alertasVistos.includes(idAlerta);

            setAlerta({
              id: idAlerta,
              titulo: avisoTornado.properties.event,
              descricao:
                avisoTornado.properties.headline ||
                "Alerta de evento severo ativo para a região.",
              severidade: "Alta",
            });

            setFoiVisualizado(jaVisto);

            if (!jaVisto) {
              setAberto(true);
              localStorage.setItem(
                "alertasVistos",
                JSON.stringify([...alertasVistos, idAlerta]),
              );
            }
          } else {
            setAlerta({
              titulo: "Monitor de Tornados",
              descricao:
                "Nenhum aviso de tornado ou tempestade severa ativo para esta localização no momento.",
              severidade: "Normal",
            });
          }
        } else if (tipo === "terremoto") {
          const resposta = await fetch(
            `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=500&minmagnitude=3.5&limit=10`,
          );
          const dados = await resposta.json();
          const terremotos = dados.features || [];

          setListaTerremotos(terremotos);
          setIndiceSelecionado(0);

          if (terremotos.length > 0) {
            const primeiroTerremoto = terremotos[0];
            const idTerremoto = primeiroTerremoto.id;
            const alertasVistos = JSON.parse(
              localStorage.getItem("alertasVistos") || "[]",
            );
            const jaVisto = alertasVistos.includes(idTerremoto);

            atualizarDetalhesTerremoto(primeiroTerremoto);
            setFoiVisualizado(jaVisto);

            if (!jaVisto) {
              setAberto(true);
              localStorage.setItem(
                "alertasVistos",
                JSON.stringify([...alertasVistos, idTerremoto]),
              );
            }
          } else {
            setAlerta({
              titulo: "Monitor Sísmico",
              descricao:
                "Nenhum abalo sísmico significativo registrado recentemente nesta região.",
              severidade: "Normal",
            });
          }
        }
      } catch {
        setAlerta({
          titulo: "Alerta em Tempo Real",
          descricao: "Serviço de alertas temporariamente indisponível.",
          severidade: "Erro",
        });
      } finally {
        setCarregando(false);
      }
    }

    if (lat && lon) {
      buscarAlertas();
    }
  }, [tipo, lat, lon]);

  function atualizarDetalhesTerremoto(itemTerremoto) {
    const magnitude = itemTerremoto.properties.mag;
    const local = itemTerremoto.properties.place;
    const profundidade = itemTerremoto.geometry.coordinates[2];
    const dataHora = new Date(itemTerremoto.properties.time).toLocaleString(
      "pt-BR",
    );

    const alertaTsunami =
      magnitude >= 6.5
        ? "🌊 Risco potencial de Tsunami sob monitoramento!"
        : "Sem risco imediato de Tsunami.";

    setAlerta({
      id: itemTerremoto.id,
      titulo: `Terremoto Detectado: M ${magnitude}`,
      local,
      profundidade: `${profundidade} km`,
      dataHora,
      statusTsunami: alertaTsunami,
      severidade: magnitude >= 5.5 ? "Alta" : "Moderada",
    });
  }

  function handleTrocarTerremoto(evento) {
    const novoIndice = Number(evento.target.value);
    const terremoto = listaTerremotos[novoIndice];
    const idTerremoto = terremoto.id;
    const alertasVistos = JSON.parse(
      localStorage.getItem("alertasVistos") || "[]",
    );
    const jaVisto = alertasVistos.includes(idTerremoto);

    setIndiceSelecionado(novoIndice);
    atualizarDetalhesTerremoto(terremoto);
    setFoiVisualizado(jaVisto);
    setAberto(true);

    if (!jaVisto) {
      localStorage.setItem(
        "alertasVistos",
        JSON.stringify([...alertasVistos, idTerremoto]),
      );
    }
  }

  function fecharAlerta() {
    setAberto(false);
    setFoiVisualizado(true);
  }

  function reabrirAlerta() {
    setAberto(true);
  }

  const eCritico = alerta?.severidade === "Alta";
  const icone = tipo === "tornado" ? "🚨" : "🚨";

  if (carregando) {
    return null;
  }

  return (
    <>
      {!aberto && (
        <button
          type="button"
          className={`alertaFixo ${eCritico ? "alertaFixoCritico" : ""}`}
          onClick={reabrirAlerta}
          title="Ver alerta"
          aria-label="Ver alerta"
        >
          {icone}
        </button>
      )}

      {aberto && (
        <div className="alertaOverlay">
          <section
            className={`alertaCard ${eCritico ? "alertaCardCritico" : ""}`}
          >
            {eCritico && (
              <div className="luzesAlerta" aria-hidden="true">
                <span></span>
                <span></span>
              </div>
            )}

            <button
              type="button"
              className="alertaFechar"
              onClick={fecharAlerta}
              aria-label="Fechar alerta"
              title="Fechar alerta"
            >
              ×
            </button>

            <div className="alertaCabecalho">
              <span className="alertaIcone">{icone}</span>
              <div>
                <span className="alertaEtiqueta">ALERTA</span>
                <h2>{alerta?.titulo || "Alerta em tempo real"}</h2>
              </div>
            </div>

            {tipo === "terremoto" && listaTerremotos.length > 1 && (
              <div className="seletorTerremoto">
                <label htmlFor="selectTerremoto">
                  <strong>🪨 Escolher evento recente</strong>
                </label>
                <select
                  id="selectTerremoto"
                  value={indiceSelecionado}
                  onChange={handleTrocarTerremoto}
                >
                  {listaTerremotos.map((item, index) => (
                    <option key={item.id} value={index}>
                      M {item.properties.mag} - {item.properties.place}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {alerta?.local ? (
              <div className="detalhesTerremoto">
                <p>
                  <strong>🪨 Local:</strong>
                  <span>{alerta.local}</span>
                </p>
                <p>
                  <strong>Profundidade:</strong>
                  <span>{alerta.profundidade}</span>
                </p>
                <p>
                  <strong>Data e Hora:</strong>
                  <span>{alerta.dataHora}</span>
                </p>
                <p>
                  <strong>🌊 Alerta de Tsunami:</strong>
                  <span>{alerta.statusTsunami}</span>
                </p>
              </div>
            ) : (
              <p className="alertaDescricao">{alerta?.descricao}</p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
