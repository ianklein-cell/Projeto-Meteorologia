import { useState, useEffect } from "react";

export default function AlertCard({ tipo, lat, lon }) {
  const [alerta, setAlerta] = useState(null);
  const [listaTerremotos, setListaTerremotos] = useState([]);
  const [indiceSelecionado, setIndiceSelecionado] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    async function buscarAlertas() {
      setCarregando(true);
      try {
        if (tipo === "tornado") {
          const resposta = await fetch(
            `https://api.weather.gov/alerts/active?point=${lat},${lon}`
          );
          const dados = await resposta.json();
          const avisos = dados.features || [];
          const avisoTornado = avisos.find(
            (item) =>
              item.properties.event.toLowerCase().includes("tornado") ||
              item.properties.event.toLowerCase().includes("storm")
          );
          if (avisoTornado) {
            setAlerta({
              titulo: avisoTornado.properties.event,
              descricao:
                avisoTornado.properties.headline ||
                "Alerta de evento severo ativo para a região.",
              severidade: "Alta",
            });
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
            `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=500&minmagnitude=3.5&limit=10`
          );
          const dados = await resposta.json();
          const terremotos = dados.features || [];
          setListaTerremotos(terremotos);
          setIndiceSelecionado(0);
          if (terremotos.length > 0) {
            atualizarDetalhesTerremoto(terremotos[0]);
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
    const dataHora = new Date(
      itemTerremoto.properties.time
    ).toLocaleString("pt-BR");
    const alertaTsunami =
      magnitude >= 6.5
        ? "🌊 Risco potencial de Tsunami sob monitoramento!"
        : "Sem risco imediato de Tsunami.";
    setAlerta({
      titulo: `Terremoto Detectado: M ${magnitude}`,
      local: local,
      profundidade: `${profundidade} km`,
      dataHora: dataHora,
      statusTsunami: alertaTsunami,
      severidade: magnitude >= 5.5 ? "Alta" : "Moderada",
    });
  }
  function handleTrocarTerremoto(evento) {
    const novoIndice = Number(evento.target.value);
    setIndiceSelecionado(novoIndice);
    atualizarDetalhesTerremoto(listaTerremotos[novoIndice]);
  }
  const eCritico = alerta?.severidade === "Alta";
  const icone = tipo === "tornado" ? "🌪️" : "🪨";

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        title={
          tipo === "tornado"
            ? "Ver alertas de tornado"
            : "Ver alertas de terremoto e tsunami"
        }
        className={eCritico ? "alertaCritico" : "alertaNormal"}
      >
        {icone}
        {eCritico && <span className="pontoAlerta" />}
      </button>
      {aberto && (
        <div className="modalOverlay" onClick={() => setAberto(false)}>
          <div
            className="modalConteudo"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="modalCabecalho">
              <h3>
                {icone} {alerta?.titulo || "Carregando..."}
              </h3>
            </div>

            {carregando ? (
              <p>Consultando alertas em tempo real...</p>
            ) : (
              <>
                {tipo === "terremoto" && listaTerremotos.length > 1 && (
                  <div className="seletorTerremoto">
                    <label htmlFor="selectTerremoto">
                      <strong>🪨 Escolher evento recente: </strong>
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
                      <strong>🪨 Local:</strong> {alerta.local}
                    </p>
                    <p>
                      <strong>Profundidade:</strong> {alerta.profundidade}
                    </p>
                    <p>
                      <strong>Data e Hora:</strong> {alerta.dataHora}
                    </p>
                    <p>
                      <strong>🌊 Alerta de Tsunami:</strong> {alerta.statusTsunami}
                    </p>
                  </div>
                ) : (
                  <p>{alerta?.descricao}</p>
                )}
              </>
            )}
            <div className="modalRodape">
              <button type="button" onClick={() => setAberto(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}