export default function Moon({ fase, iluminacao }) {
  return (
    <section className="moon-phase">
      <h2>Fase da Lua</h2>
      <div className="visual-lua" aria-hidden="true">
        🌙
      </div>
      <p className="nome-fase-lua">{fase}</p>
      {iluminacao !== undefined && (
        <p className="iluminacao-lua">Iluminação: {iluminacao}%</p>
      )}
    </section>
  );
}
