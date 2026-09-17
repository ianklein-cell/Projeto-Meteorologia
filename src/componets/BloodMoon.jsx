import { useState } from "react";
export default function BloodMoon() {
  const [progresso, setProgresso] = useState(0);
  return (
    <section className="lua-sangrenta">
      <h2>Lua de Sangue</h2>
      <div
        className={`lua-visual ${progresso > 70 ? "lua-vermelha" : ""}`}
        style={{
          "--progresso-lua": `${progresso}%`,
        }}
        aria-label={`Simulação de Lua de Sangue em ${progresso}%`}
      >
        🌕
      </div>
      <p>Simulação de um eclipse lunar</p>
      <label htmlFor="controle-lua">Avanço do eclipse: {progresso}%</label>
      <input
        id="controle-lua"
        className="controle-lua"
        type="range"
        min="0"
        max="100"
        value={progresso}
        onChange={(event) => setProgresso(Number(event.target.value))}
      />
    </section>
  );
}
