import { useEffect, useMemo, useRef, useState } from "react";
import "./MoonPhases.css";

const fasesLua = [
  {
    nome: "Lua Nova",
    iluminacao: 0,
    descricao:
      "A Lua está entre o Sol e a Terra. A face iluminada fica voltada para o Sol.",
  },
  {
    nome: "Lua Crescente",
    iluminacao: 25,
    descricao:
      "Uma pequena parte da face visível da Lua começa a ficar iluminada.",
  },
  {
    nome: "Quarto Crescente",
    iluminacao: 50,
    descricao: "Metade da face visível da Lua está iluminada.",
  },
  {
    nome: "Gibosa Crescente",
    iluminacao: 75,
    descricao:
      "Mais da metade da face visível da Lua está iluminada e ela se aproxima da Lua Cheia.",
  },
  {
    nome: "Lua Cheia",
    iluminacao: 100,
    descricao:
      "A face visível da Lua está praticamente totalmente iluminada pelo Sol.",
  },
  {
    nome: "Gibosa Minguante",
    iluminacao: 75,
    descricao: "A iluminação começa a diminuir depois da Lua Cheia.",
  },
  {
    nome: "Quarto Minguante",
    iluminacao: 50,
    descricao: "Metade da face visível da Lua continua iluminada.",
  },
  {
    nome: "Lua Minguante",
    iluminacao: 25,
    descricao:
      "A parte iluminada da Lua fica cada vez menor até chegar à Lua Nova.",
  },
];

function obterIndiceFase(fase) {
  if (fase === null || fase === undefined) return 0;

  if (fase === 0 || fase === 1) return 0;
  if (fase > 0 && fase < 0.22) return 1;
  if (fase >= 0.22 && fase <= 0.28) return 2;
  if (fase > 0.28 && fase < 0.48) return 3;
  if (fase >= 0.48 && fase <= 0.52) return 4;
  if (fase > 0.52 && fase < 0.72) return 5;
  if (fase >= 0.72 && fase <= 0.78) return 6;
  if (fase > 0.78 && fase < 1) return 7;

  return 0;
}

function formatarHorario(horario) {
  if (!horario) return "Não ocorre hoje";

  const data = new Date(horario);

  if (Number.isNaN(data.getTime())) {
    return "Não disponível";
  }

  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MoonPhases({
  faseAtual,
  nascerLua,
  porLua,
  codigoPais,
}) {
  const indiceInicial = useMemo(() => obterIndiceFase(faseAtual), [faseAtual]);

  const [indiceFase, setIndiceFase] = useState(indiceInicial);
  const [arrastando, setArrastando] = useState(false);

  const inicioArraste = useRef(0);

  useEffect(() => {
    setIndiceFase(indiceInicial);
  }, [indiceInicial]);

  const fase = fasesLua[indiceFase];

  const angulos = [0, 45, 90, 135, 180, 225, 270, 315];

  const angulo = angulos[indiceFase];

  const centroX = 400;
  const centroY = 180;

  const raioX = 245;
  const raioY = 105;

  const radianos = (angulo * Math.PI) / 180;

  const luaX = centroX + Math.cos(radianos) * raioX;
  const luaY = centroY + Math.sin(radianos) * raioY;

  function moverFase(direcao) {
    setIndiceFase((atual) => {
      const novoIndice = atual + direcao;

      if (novoIndice < 0) {
        return fasesLua.length - 1;
      }

      if (novoIndice >= fasesLua.length) {
        return 0;
      }

      return novoIndice;
    });
  }

  function iniciarArraste(event) {
    setArrastando(true);
    inicioArraste.current = event.clientX;
  }

  function finalizarArraste(event) {
    if (!arrastando) return;

    const distancia = event.clientX - inicioArraste.current;

    if (Math.abs(distancia) > 40) {
      if (distancia < 0) {
        moverFase(1);
      } else {
        moverFase(-1);
      }
    }

    setArrastando(false);
  }

  function cancelarArraste() {
    setArrastando(false);
  }

  return (
    <section className={`fasesLua fases-${codigoPais?.toLowerCase() || ""}`}>
      <div className="fasesLuaCabecalho">
        <div>
          <span className="iconeLua">🌙</span>

          <div>
            <h2>Ciclo da Lua</h2>
            <p>Arraste para explorar as fases da Lua</p>
          </div>
        </div>

        <div className="fasesLuaBotoes">
          <button
            type="button"
            onClick={() => moverFase(-1)}
            aria-label="Fase anterior"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => moverFase(1)}
            aria-label="Próxima fase"
          >
            →
          </button>
        </div>
      </div>

      <div
        className={`sistemaLua ${arrastando ? "arrastando" : ""}`}
        onPointerDown={iniciarArraste}
        onPointerUp={finalizarArraste}
        onPointerCancel={cancelarArraste}
        onPointerLeave={cancelarArraste}
      >
        <svg
          className="sistemaLuaSvg"
          viewBox="0 0 800 360"
          role="img"
          aria-label="Representação interativa das fases da Lua"
        >
          <defs>
            <clipPath id="recorteTerra">
              <circle cx={centroX} cy={centroY} r="55" />
            </clipPath>

            <radialGradient id="brilhoSol">
              <stop offset="0%" stopColor="#fff7a8" />
              <stop offset="45%" stopColor="#ffd54a" />
              <stop offset="100%" stopColor="#ff9f1c" />
            </radialGradient>

            <radialGradient id="terraGradiente">
              <stop offset="0%" stopColor="#4fc3f7" />
              <stop offset="60%" stopColor="#1976d2" />
              <stop offset="100%" stopColor="#0d47a1" />
            </radialGradient>

            <radialGradient id="luaGradiente">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="75%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>

            <filter id="sombra">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="5"
                floodOpacity="0.35"
              />
            </filter>

            <filter id="brilho">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <ellipse
            cx={centroX}
            cy={centroY}
            rx={raioX}
            ry={raioY}
            className="orbitaLua"
          />

          <line
            x1="690"
            y1={centroY}
            x2={centroX}
            y2={centroY}
            className="raioSol"
          />

          <circle
            cx="700"
            cy={centroY}
            r="58"
            className="brilhoSol"
            filter="url(#brilho)"
          />

          <circle
            cx="700"
            cy={centroY}
            r="42"
            fill="url(#brilhoSol)"
            filter="url(#sombra)"
          />

          <text x="700" y="255" textAnchor="middle" className="textoSistema">
            Sol
          </text>

          <circle
            cx={centroX}
            cy={centroY}
            r="55"
            fill="url(#terraGradiente)"
            filter="url(#sombra)"
          />

          <path
            d="M365 145 C350 155 355 170 370 175 C380 178 385 168 390 160 C398 148 385 140 365 145Z"
            className="continente"
            clipPath="url(#recorteTerra)"
          />

          <path
            d="M420 205 C435 195 450 205 455 218 C458 230 448 240 435 235 C425 230 418 218 420 205Z"
            className="continente"
            clipPath="url(#recorteTerra)"
          />

          <text
            x={centroX}
            y="255"
            textAnchor="middle"
            className="textoSistema"
          >
            Terra
          </text>
          <g className="luaSvg" transform={`translate(${luaX} ${luaY})`}>
            <circle r="29" fill="url(#luaGradiente)" filter="url(#sombra)" />

            {fase.iluminacao < 100 && (
              <path d={obterSombraLua(indiceFase)} className="sombraLua" />
            )}
            <circle cx="-9" cy="-8" r="4" className="cratera" />
            <circle cx="10" cy="5" r="3" className="cratera" />
            <circle cx="-4" cy="12" r="2.5" className="cratera" />
          </g>

          <text
            x={luaX}
            y={luaY + 48}
            textAnchor="middle"
            className="textoSistema"
          >
            Lua
          </text>
        </svg>
      </div>

      <div className="controleFases">
        <button
          type="button"
          onClick={() => moverFase(-1)}
          aria-label="Fase anterior"
        >
          ‹
        </button>

        <div className="indicadoresFases">
          {fasesLua.map((item, index) => (
            <button
              key={item.nome}
              type="button"
              className={index === indiceFase ? "faseSelecionada" : ""}
              onClick={() => setIndiceFase(index)}
              aria-label={`Selecionar ${item.nome}`}
            >
              {obterSimboloFase(index)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => moverFase(1)}
          aria-label="Próxima fase"
        >
          ›
        </button>
      </div>

      <div className="informacaoFase">
        <div className="faseTitulo">
          <span>{obterSimboloFase(indiceFase)}</span>

          <div>
            <h3>{fase.nome}</h3>
            <strong>{fase.iluminacao}% iluminada</strong>
          </div>
        </div>

        <p>{fase.descricao}</p>

        <div className="dadosLua">
          <div>
            <span>🌅</span>
            <small>Nascer da Lua</small>
            <strong>{formatarHorario(nascerLua)}</strong>
          </div>

          <div>
            <span>🌇</span>
            <small>Pôr da Lua</small>
            <strong>{formatarHorario(porLua)}</strong>
          </div>
        </div>
      </div>

      <div className="fasesLuaIndicador">
        <span>←</span>
        <p>Arraste horizontalmente para explorar</p>
        <span>→</span>
      </div>
    </section>
  );
}

function obterSimboloFase(indice) {
  const simbolos = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

  return simbolos[indice];
}

function obterSombraLua(indice) {
  const sombras = [
    "M0 -29 A29 29 0 1 0 0 29 A29 29 0 1 1 0 -29Z",
    "M0 -29 A29 29 0 0 0 0 29 A17 29 0 0 1 0 -29Z",
    "M0 -29 A29 29 0 0 0 0 29 L0 -29Z",
    "M0 -29 A29 29 0 0 0 0 29 A17 29 0 0 0 -29Z",
    "",
    "M0 -29 A29 29 0 0 1 0 29 A17 29 0 0 0 -29Z",
    "M0 -29 A29 29 0 0 1 0 29 L0 -29Z",
    "M0 -29 A29 29 0 0 1 0 29 A17 29 0 0 1 0 -29Z",
  ];

  return sombras[indice] || "";
}