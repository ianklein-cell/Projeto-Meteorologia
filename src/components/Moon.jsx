import { useEffect, useState } from "react";

function getFaseLuaInfo(fase) {
  if (fase === 0 || fase === 1) return "Lua Nova 🌑";
  if (fase > 0 && fase < 0.25) return "Lua Crescente 🌒";
  if (fase === 0.25) return "Quarto Crescente 🌓";
  if (fase > 0.25 && fase < 0.5) return "Crescente Convexa 🌔";
  if (fase === 0.5) return "Lua Cheia 🌕";
  if (fase > 0.5 && fase < 0.75) return "Minguante Convexa 🌖";
  if (fase === 0.75) return "Quarto Minguante 🌗";
  if (fase > 0.75 && fase < 1) return "Lua Minguante 🌘";
  return "Fase não identificada";
}

function formatarHorario(isoString) {
  if (!isoString) return "Não ocorre hoje";
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Moon({ lat, lon, timezone }) {
  const [dadosLua, setDadosLua] = useState(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    async function carregarDadosLua() {
      setCarregando(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=moonrise,moonset,moon_phase&timezone=${encodeURIComponent(timezone)}`
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
  if (carregando) return <p>Carregando dados da lua...</p>;
  if (!dadosLua) return null;
  const faseValor = dadosLua.moon_phase[0];
  const nascerLua = dadosLua.moonrise[0];
  const porLua = dadosLua.moonset[0];

  return (
    <div>
      <h3>Informações Astronômicas 🌙</h3>
      <p><strong>Fase Atual:</strong> {getFaseLuaInfo(faseValor)}</p>
      <p><strong>Nascer da Lua:</strong> {formatarHorario(nascerLua)}</p>
      <p><strong>Pôr da Lua:</strong> {formatarHorario(porLua)}</p>
    </div>
  );
}