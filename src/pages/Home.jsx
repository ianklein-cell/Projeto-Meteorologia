import Header from "../components/Header";
import CountryCard from "../components/CountryCard";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <h1>Previsão do Tempo Mundial 🌍</h1>
        <p>Consulte a meteorologia de diferentes países:</p>
        <div className="countries-container">
          <CountryCard
            nome="Brasil"
            bandeira="🇧🇷"
            descricao="Consulte a previsão do tempo no Brasil."
            rota="/brasil"
          />
          <CountryCard
            nome="Japão"
            bandeira="🇯🇵"
            descricao="Consulte a previsão do tempo no Japão."
            rota="/japao"
          />
          <CountryCard
            nome="Estados Unidos"
            bandeira="🇺🇸"
            descricao="Consulte a previsão do tempo nos Estados Unidos."
            rota="/eua"
          />
        </div>
      </main>
    </>
  );
}
