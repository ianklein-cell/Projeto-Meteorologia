export default function SearchBar({
  valor,
  onChange,
  resultados,
  onSelecionar,
}) {
  return (
    <div className="search-bar">
      <label htmlFor="pesquisa-cidade">Pesquisar cidade</label>
      <input
        id="pesquisa-cidade"
        type="search"
        placeholder="Digite o nome da cidade..."
        value={valor}
        onChange={(event) => onChange(event.target.value)}
      />
      {valor && resultados.length > 0 && (
        <div className="resultado-pesquisa">
          {resultados.map((cidade, index) => (
            <button
              key={`${cidade.nome}-${cidade.latitude}-${index}`}
              type="button"
              onClick={() => onSelecionar(cidade)}
            >
              <strong>{cidade.nome}</strong>
              {cidade.estado && ` - ${cidade.estado}`}
            </button>
          ))}
        </div>
      )}
      {valor && resultados.length === 0 && valor.length >= 3 && (
        <p className="nenhum-resultado">Nenhuma cidade encontrada.</p>
      )}
    </div>
  );
}
