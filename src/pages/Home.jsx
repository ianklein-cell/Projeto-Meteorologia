import Header from "../components/Header";
import CountryCard from "../components/CountryCard";
import "./Home.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="homeContainer">
        <section className="homeHero">
          <h1>Previsão do Tempo ☂️</h1>
          <p>Consulte a meteorologia dos países abaixo:</p>
        </section>
        <div className="countriesContainer">
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