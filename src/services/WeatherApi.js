const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";

export async function BuscarCidades(nome, codigoPais) {
  const params = new URLSearchParams({
    name: nome,
    count: "10",
    language: "pt",
    format: "json",
    countryCode: codigoPais,
  });
  const response = await fetch(`${GEOCODING_API}?${params}`);
  if (!response.ok) {
    throw new Error("Erro ao localizar a cidade.");
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    return [];
  }
  return data.results.map((cidade) => ({
    nome: cidade.name,
    estado: cidade.admin1,
    codigoEstado: cidade.admin1_id,
    pais: cidade.country,
    codigoPais: cidade.country_code,
    latitude: cidade.latitude,
    longitude: cidade.longitude,
    timezone: cidade.timezone,
  }));
}

export async function BuscarCidade(nome, codigoPais) {
  const cidades = await BuscarCidades(nome, codigoPais);

  if (cidades.length === 0) {
    throw new Error("Cidade não encontrada.");
  }
  return cidades[0];
}

export async function BuscarClima(latitude, longitude, timezone = "auto") {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone,
    // uv_index e snowfall adicionados aqui no parâmetro current:
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,snowfall",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max",
    forecast_days: 7,
  });
  const response = await fetch(`${WEATHER_API}?${params}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar o clima.");
  }
  const data = await response.json();
  return data;
}