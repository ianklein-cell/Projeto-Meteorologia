import { useEffect, useState } from "react";
import { BuscarCidade, BuscarClima } from "../services/WeatherApi";

export default function EUA() {
  const [cidade, setCidade] = useState(null);
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  useEffect(() => {
    async function carregarClima() {
      try {
        const dadosCidade = await BuscarCidade("New York City");
        setCidade(dadosCidade);
        const dadosClima = await BuscarClima(
          dadosCidade.latitude,
          dadosCidade.longitude,
          dadosCidade.timezone,
        );
        setClima(dadosClima);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarClima();
  }, []);
  if (carregando) {
    return <h1>Carregando clima...</h1>;
  }
  if (erro) {
    return <h1>{erro}</h1>;
  }
  return (
    <div>
      <h1>Estados Unidos</h1>
      <h2>{cidade.nome}</h2>
      <p>Temperatura: {clima.current.temperature_2m} °C</p>
      <p>Umidade: {clima.current.relative_humidity_2m}%</p>
      <p>Vento {clima.current.wind_speed_10m}km/h</p>
      <p>Fuso horário: {cidade.timezone}</p>
    </div>
  );
}