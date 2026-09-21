import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ForecastGraph.css";

export default function ForecastGraph({
  clima,
  nomeCidade,
  timezone,
  codigoPais,
}) {
  const [tipoGrafico, setTipoGrafico] = useState("temperatura");

  const dadosGrafico = useMemo(() => {
    if (!clima?.hourly?.time) return [];

    const {
      time,
      temperature_2m,
      relative_humidity_2m,
      precipitation_probability,
      wind_speed_10m,
    } = clima.hourly;

    return time.slice(0, 24).map((hora, index) => ({
      hora: new Date(hora).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      }),
      temperatura: temperature_2m?.[index] ?? null,
      chuva: precipitation_probability?.[index] ?? null,
      vento: wind_speed_10m?.[index] ?? null,
      umidade: relative_humidity_2m?.[index] ?? null,
    }));
  }, [clima, timezone]);

  const configuracoes = {
    temperatura: {
      titulo: "Temperatura",
      unidade: "°",
      chave: "temperatura",
      cor: "#f28c28",
      corClara: "#f28c28",
    },
    chuva: {
      titulo: "Chuva",
      unidade: "%",
      chave: "chuva",
      cor: "#2878d8",
      corClara: "#2878d8",
    },
    vento: {
      titulo: "Vento",
      unidade: " km/h",
      chave: "vento",
      cor: "#805ad5",
      corClara: "#805ad5",
    },
    umidade: {
      titulo: "Umidade",
      unidade: "%",
      chave: "umidade",
      cor: "#0089b8",
      corClara: "#0089b8",
    },
  };

  const configuracao = configuracoes[tipoGrafico];

  if (!clima?.hourly?.time) {
    return null;
  }

  return (
    <section className={`graficoPrevisao grafico-${codigoPais?.toLowerCase()}`}>
      <div className="graficoCabecalho">
        <h2>
          Previsão hora a hora
          {nomeCidade ? ` em ${nomeCidade}` : ""}
        </h2>
      </div>

      <div className="graficoOpcoes">
        <button
          type="button"
          className={tipoGrafico === "temperatura" ? "opcaoAtiva" : ""}
          onClick={() => setTipoGrafico("temperatura")}
        >
          <span>🌡️</span>
          Temperatura
        </button>

        <button
          type="button"
          className={tipoGrafico === "chuva" ? "opcaoAtiva" : ""}
          onClick={() => setTipoGrafico("chuva")}
        >
          <span>🌧️</span>
          Chuva
        </button>

        <button
          type="button"
          className={tipoGrafico === "vento" ? "opcaoAtiva" : ""}
          onClick={() => setTipoGrafico("vento")}
        >
          <span>💨</span>
          Vento
        </button>

        <button
          type="button"
          className={tipoGrafico === "umidade" ? "opcaoAtiva" : ""}
          onClick={() => setTipoGrafico("umidade")}
        >
          <span>💧</span>
          Umidade
        </button>
      </div>

      <div className="graficoArea">
        <ResponsiveContainer width="100%" height={330}>
          <AreaChart
            data={dadosGrafico}
            margin={{
              top: 35,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="gradienteGrafico" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={configuracao.cor}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={configuracao.cor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.15}
            />

            <XAxis
              dataKey="hora"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(valor) =>
                `${valor}${configuracao.unidade.trim()}`
              }
            />

            <Tooltip
              formatter={(valor) => [
                `${valor}${configuracao.unidade}`,
                configuracao.titulo,
              ]}
              labelFormatter={(hora) => `Horário: ${hora}`}
            />

            <Area
              type="monotone"
              dataKey={configuracao.chave}
              stroke={configuracao.cor}
              strokeWidth={3}
              fill="url(#gradienteGrafico)"
              fillOpacity={1}
              dot={{
                r: 4,
                fill: configuracao.cor,
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: configuracao.cor,
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              label={{
                position: "top",
                formatter: (valor) =>
                  `${Math.round(valor)}${configuracao.unidade}`,
                fontSize: 12,
                fill: configuracao.cor,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
