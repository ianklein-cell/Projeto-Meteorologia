export default function FavoriteButton({ cidade, favorito, onToglle }) {
  return (
    <button
      className="favorite-button"
      onClick={() => onToglle(cidade)}
      type="button"
      aria-label={
        favorito
          ? `Remover ${cidade} dos favoritos`
          : `Adicionar ${cidade} aos favoritos`
      }
    >
      {favorito ? "★ Favorito" : "☆ Favoritar"}
    </button>
  );
}
