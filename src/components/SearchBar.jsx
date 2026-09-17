export default function SearchBar({ valor, onChange }) {
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
    </div>
  );
}
