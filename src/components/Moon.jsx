import { useEffect, useState } from "react";
import MoonPhases from "./MoonPhases";

export default function Moon({ lat, lon, timezone, codigoPais }) {
  const [dadosLua, setDadosLua] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDadosLua() {
      setCarregando(true);

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=moonrise,moonset,moon_phase&timezone=${encodeURIComponent(timezone)}`,
        );

        const data = await response.json();

        setDadosLua(data.daily);
      } catch (error) {
        console.error("Erro ao buscar fases da lua:", error);
      } finally {
        setCarregando(false);
      }
    }

    if (lat && lon && timezone) {
      carregarDadosLua();
    }
  }, [lat, lon, timezone]);

  if (carregando) {
    return <p>Carregando dados da lua...</p>;
  }

  if (!dadosLua) {
    return null;
  }

  const faseValor = dadosLua.moon_phase[0];
  const nascerLua = dadosLua.moonrise[0];
  const porLua = dadosLua.moonset[0];

  return (
    <div>
      <MoonPhases
        faseAtual={faseValor}
        nascerLua={nascerLua}
        porLua={porLua}
        codigoPais={codigoPais}
      />
    </div>
  );
}