import "./SearchBar.css";

export default function SearchBar({
  valor,
  onChange,
  resultados,
  onSelecionar,
}) {
  return (
    <div className="searchBarContainer">
      <input
        type="text"
        placeholder="Buscar cidade..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />

      {resultados.length > 0 && (
        <ul className="resultadosBusca">
          {resultados.map((cidade, index) => (
            <li key={index} onClick={() => onSelecionar(cidade)}>
              {cidade.nome} {cidade.estado ? `- ${cidade.estado}` : ""} (
              {cidade.pais})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}