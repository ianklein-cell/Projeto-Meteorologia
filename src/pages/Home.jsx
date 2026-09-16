import { Link } from "react-router-dom";
import Header from "../componets/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <h1>Previsão do Tempo Mundial 🌍</h1>
        <p>Selecione um país para consultar o clima:</p>
        <div>
          <Link to="/brasil">🇧🇷 Brasil</Link>
          <Link to="/japao">🇯🇵 Japão</Link>
          <Link to="/eua">🇺🇸 EUA</Link>
        </div>
      </main>
    </>
  );
}
