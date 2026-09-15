const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GECODING_API = "https://geocoding-api.open-meteo.com/v1/search";
export async function BuscarCidade(nome) {
  const response = await fetch(
    `${GECODING_API}?name=${encodeURIComponent(nome)}&count=1&language=pt&format=json`,
  );
  if (!response.ok) {
    throw new Error("Erro ao localizar a cidade.");
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("Cidade não encontrada.");
  }
  const cidade = data.results[0];
  return {
    nome: cidade.name,
    pais: cidade.country,
    codigoPais: cidade.countryPais,
    latitude: cidade.latitude,
    longitude: cidade.longitude,
    timezone: cidade.timezone,
  };
}
export async function BuscarClima(latitude, longitude, timezone = "auto") {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    forecast_days: 7,
  });
  const response = await fetch(`${WEATHER_API}?${params}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar o clima.");
  }
  const data = await response.json();
  return data;
}
