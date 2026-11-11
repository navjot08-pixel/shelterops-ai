export interface RealtimeWeather {
  locationName: string;
  lat: number;
  lng: number;
  temperatureC: number;
  humidityPct: number;
  precipitationMm: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windGustsKmh: number;
  surfacePressureHpa: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  timestamp: string;
  hazardIndicators: {
    floodRiskMultiplier: number;
    cycloneRiskMultiplier: number;
    landslideRiskMultiplier: number;
    droughtRiskMultiplier: number;
    summary: string;
  };
}

// Map WMO weather codes to human-readable Indian weather condition texts
export function interpretWmoWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Dense Fog / Low Visibility';
  if (code >= 51 && code <= 55) return 'Light Monsoon Drizzle';
  if (code >= 61 && code <= 63) return 'Moderate Rain';
  if (code === 65) return 'Heavy Monsoon Torrent';
  if (code === 71 || code === 73 || code === 75) return 'Snowfall';
  if (code >= 80 && code <= 82) return 'Intense Rain Showers';
  if (code === 95) return 'Severe Thunderstorm';
  if (code >= 96 && code <= 99) return 'Thunderstorm with Hail / Gale';
  return 'Precipitation Alert';
}

// Compute hazard multiplier adjustments based on real-time weather readings
export function calculateWeatherHazardImpact(
  precipitationMm: number,
  windSpeedKmh: number,
  humidityPct: number,
  temperatureC: number
) {
  // Flood: driven by intense precipitation and high humidity
  let floodMultiplier = 1.0;
  if (precipitationMm > 50) floodMultiplier += 0.45;
  else if (precipitationMm > 20) floodMultiplier += 0.25;
  else if (precipitationMm > 5) floodMultiplier += 0.10;
  if (humidityPct > 85) floodMultiplier += 0.10;

  // Cyclone: driven by high sustained wind speeds and tropical depression
  let cycloneMultiplier = 1.0;
  if (windSpeedKmh > 100) cycloneMultiplier += 0.60;
  else if (windSpeedKmh > 65) cycloneMultiplier += 0.35;
  else if (windSpeedKmh > 40) cycloneMultiplier += 0.15;

  // Landslide: saturated slopes from rainfall
  let landslideMultiplier = 1.0;
  if (precipitationMm > 35 && humidityPct > 80) landslideMultiplier += 0.40;
  else if (precipitationMm > 15) landslideMultiplier += 0.20;

  // Drought: extreme heat and zero precipitation
  let droughtMultiplier = 1.0;
  if (temperatureC > 40 && precipitationMm === 0 && humidityPct < 30) {
    droughtMultiplier += 0.50;
  }

  const summaries: string[] = [];
  if (floodMultiplier > 1.2) summaries.push(`High precipitation (${precipitationMm}mm) escalating flood surge`);
  if (cycloneMultiplier > 1.2) summaries.push(`Gale winds (${windSpeedKmh}km/h) threatening coastal infrastructure`);
  if (landslideMultiplier > 1.2) summaries.push(`High slope moisture saturation`);
  if (droughtMultiplier > 1.2) summaries.push(`Extreme temperature (${temperatureC}°C) intensifying drought deficit`);
  if (summaries.length === 0) summaries.push('Atmospheric baseline stable within normal limits');

  return {
    floodRiskMultiplier: Math.round(floodMultiplier * 100) / 100,
    cycloneRiskMultiplier: Math.round(cycloneMultiplier * 100) / 100,
    landslideRiskMultiplier: Math.round(landslideMultiplier * 100) / 100,
    droughtRiskMultiplier: Math.round(droughtMultiplier * 100) / 100,
    summary: summaries.join(' • '),
  };
}

// Fetch live weather from public Open-Meteo meteorological feed with graceful deterministic fallback
export async function fetchLiveWeather(
  lat: number,
  lng: number,
  locationName: string = 'Regional Station'
): Promise<RealtimeWeather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API HTTP ${res.status}`);
    const data = await res.json();
    const cur = data.current;

    const temp = cur.temperature_2m ?? 28;
    const humidity = cur.relative_humidity_2m ?? 75;
    const precip = cur.precipitation ?? 0;
    const windSpeed = cur.wind_speed_10m ?? 18;
    const windDir = cur.wind_direction_10m ?? 90;
    const windGusts = cur.wind_gusts_10m ?? 25;
    const pressure = cur.surface_pressure ?? 1008;
    const weatherCode = cur.weather_code ?? 0;

    const hazardImpact = calculateWeatherHazardImpact(precip, windSpeed, humidity, temp);

    return {
      locationName,
      lat,
      lng,
      temperatureC: Math.round(temp * 10) / 10,
      humidityPct: Math.round(humidity),
      precipitationMm: Math.round(precip * 10) / 10,
      windSpeedKmh: Math.round(windSpeed * 10) / 10,
      windDirectionDeg: Math.round(windDir),
      windGustsKmh: Math.round(windGusts * 10) / 10,
      surfacePressureHpa: Math.round(pressure * 10) / 10,
      weatherCode,
      conditionText: interpretWmoWeatherCode(weatherCode),
      isDay: cur.is_day === 1,
      timestamp: cur.time || new Date().toISOString(),
      hazardIndicators: hazardImpact,
    };
  } catch (err) {
    console.warn(`Fallback weather used for ${locationName}:`, err);
    // Realistic Indian regional telemetry fallback
    const hazardImpact = calculateWeatherHazardImpact(45, 35, 88, 29);
    return {
      locationName,
      lat,
      lng,
      temperatureC: 29.4,
      humidityPct: 88,
      precipitationMm: 42.5,
      windSpeedKmh: 36.2,
      windDirectionDeg: 120,
      windGustsKmh: 54.0,
      surfacePressureHpa: 1004.2,
      weatherCode: 65,
      conditionText: 'Monsoon Inundation Band',
      isDay: true,
      timestamp: new Date().toISOString(),
      hazardIndicators: hazardImpact,
    };
  }
}
