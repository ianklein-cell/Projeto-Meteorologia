import Header from "../components/Header";
import CountryCard from "../components/CountryCard";
import "./Home.css";

const IMAGEM_BRASIL =
  "https://bondinhowebsitestgprd.blob.core.windows.net/bondinho-website-str-container-prd//image_80_c3e3947c99.png";

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
            imagemFundo={IMAGEM_BRASIL}
          />
          <CountryCard
            nome="Japão"
            codigoPais="jp"
            descricao="Consulte a previsão do tempo no Japão."
            rota="/japao"
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