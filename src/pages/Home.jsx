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
            codigoPais="br"
            descricao="Consulte a previsão do tempo no Brasil."
            rota="/brasil"
            imagem="/CardBrasil.webp"
          />
          <CountryCard
            nome="Japão"
            codigoPais="jp"
            descricao="Consulte a previsão do tempo no Japão."
            rota="/japao"
            imagem="/FundoCardJapao.webP"
          />
          <CountryCard
            nome="Estados Unidos"
            codigoPais="us"
            descricao="Consulte a previsão do tempo nos Estados Unidos."
            rota="/eua"
          />
        </div>
      </main>
    </>
  );
}
