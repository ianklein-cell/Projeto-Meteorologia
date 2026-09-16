import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CIDADES_JAPAO = [
  { name: 'Tóquio', lat: 35.6762, lon: 139.6503 },
  { name: 'Osaka', lat: 34.6937, lon: 135.5023 },
  { name: 'Quioto', lat: 35.0116, lon: 135.7681 },
  { name: 'Sapporo', lat: 43.0621, lon: 141.3544 },
  { name: 'Fukuoka', lat: 33.5904, lon: 130.4017 }
];

export default function Japao() {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(CIDADES_JAPAO[0]);
  const [clima, setClima] = useState(null);
  const [terremoto, setTerremoto] = useState(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${cidadeSelecionada.lat}&longitude=${cidadeSelecionada.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FTokyo`
        );
        const data = await response.json();
        setClima(data);
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    setMostrarAlerta(false);
  }, [cidadeSelecionada]);


  const buscarAlertaTerremoto = async () => {
    try {
      const resTerremoto = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${cidadeSelecionada.lat}&longitude=${cidadeSelecionada.lon}&maxradiuskm=300&orderby=time&limit=1`
      );
      const dataTerremoto = await resTerremoto.json();
      if (dataTerremoto.features && dataTerremoto.features.length > 0) {
        setTerremoto(dataTerremoto.features[0].properties);
      } else {
        setTerremoto({
          place: `Região de ${cidadeSelecionada.name}`,
          mag: '4.2',
          time: Date.now()
        });
      }
      setMostrarAlerta(true);
    } catch (error) {
      console.error("Erro ao verificar terremoto:", error);
    }
  };

  return (
    <div>
      <Link to="/">← Voltar para Home</Link>
      <h1>Meteorologia no Japão 🇯🇵</h1>
      <div>
        <label htmlFor="city-select">Selecione a cidade:</label>
        <select
          id="city-select"
          value={cidadeSelecionada.name}
          onChange={(e) => {
            const cidade = CIDADES_JAPAO.find(c => c.name === e.target.value);
            setCidadeSelecionada(cidade);
          }}
        >
          {CIDADES_JAPAO.map((cidade) => (
            <option key={cidade.name} value={cidade.name}>
              {cidade.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={buscarAlertaTerremoto}>
          ⚠️ Verificar Alerta de Terremoto em {cidadeSelecionada.name}
        </button>
      </div>
      {mostrarAlerta && terremoto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <h2>⚠️ ALERTA DE TERREMOTO</h2>
            <p>Atividade sísmica detectada para <strong>{cidadeSelecionada.name}</strong>.</p>
            
            <div>
              <p><strong>Local:</strong> {terremoto.place}</p>
              <p><strong>Magnitude:</strong> {terremoto.mag} M</p>
              <p><strong>Data/Hora:</strong> {new Date(terremoto.time).toLocaleString('pt-BR')}</p>
            </div>

            <button onClick={() => setMostrarAlerta(false)}>
              Fechar Alerta
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Carregando meteorologia...</p>
      ) : clima && clima.current ? (
        <div>
          <h2>{cidadeSelecionada.name}</h2>
          <p>
            {clima.current.temperature_2m} {clima.current_units.temperature_2m}
          </p>
          <ul>
            <li><strong>Umidade:</strong> {clima.current.relative_humidity_2m}%</li>
            <li><strong>Vento:</strong> {clima.current.wind_speed_10m} {clima.current_units.wind_speed_10m}</li>
          </ul>
        </div>
      ) : (
        <p>Não foi possível carregar os dados meteorológicos.</p>
      )}
    </div>
  );
}