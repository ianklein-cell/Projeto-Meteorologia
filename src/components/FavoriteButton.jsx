export default function FavoriteButton({ cidade, favorito, onToggle }) {
  return (
    <button
      className="favorite-button"
      onClick={onToggle}
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
