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
            imagem="https://cdn.prod.website-files.com/63b7026306af943f8e01771f/687e420e8fdcbd7127eb12f1_65f060ff6d6a4ebc9a43ab6a_times%2520square.webp"
          />
        </div>
      </main>
    </>
  );
}
