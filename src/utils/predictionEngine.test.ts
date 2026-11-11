import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDynamicDisasterRisk } from './predictionEngine';
import { calculateWeatherHazardImpact } from './weatherService';
import { Disaster } from '../types';

const testFloodDisaster: Disaster = {
  id: 'd-test-flood',
  name: 'Assam Flood Test',
  type: 'flood',
  severity: 'Moderate',
  location: { lat: 26.2, lng: 92.9, state: 'Assam', district: 'Morigaon' },
  affectedPopulation: 25000,
  vulnerableDemographics: { elderly: 3000, children: 4500, disabled: 1000, medicalNeeds: 500 },
  probability: 60,
  confidence: 85,
  forecastHorizon: '24 Hours',
  metrics: { rainfall_mm_24h: 120 },
  contributingFactors: ['Rising river level'],
  recommendedActions: ['Alert NDRF'],
  exclusionRadiusKm: 5,
  isSimulated: true,
  status: 'Active Alert',
  dataSource: 'CWC',
};

test('Dynamic risk prediction adjusts upward when high precipitation is detected', () => {
  const severeWeather = {
    locationName: 'Assam Station',
    lat: 26.2,
    lng: 92.9,
    temperatureC: 27,
    humidityPct: 92,
    precipitationMm: 65, // > 50mm heavy rain
    windSpeedKmh: 20,
    windDirectionDeg: 90,
    windGustsKmh: 35,
    surfacePressureHpa: 1002,
    weatherCode: 65,
    conditionText: 'Heavy Monsoon Torrent',
    isDay: true,
    timestamp: new Date().toISOString(),
    hazardIndicators: calculateWeatherHazardImpact(65, 20, 92, 27),
  };

  const result = evaluateDynamicDisasterRisk(testFloodDisaster, severeWeather);
  assert.ok(result.adjustedProbability > testFloodDisaster.probability, 'Probability should increase with severe rainfall');
  assert.equal(result.isRealtimeDataAttached, true);
  assert.ok(result.forecastHorizons['24h'].probability >= result.originalProbability);
});

test('Multi-horizon forecasting outputs 24h, 48h, and 7d evaluations', () => {
  const result = evaluateDynamicDisasterRisk(testFloodDisaster, null);
  assert.ok(result.forecastHorizons['24h']);
  assert.ok(result.forecastHorizons['48h']);
  assert.ok(result.forecastHorizons['7d']);
  assert.equal(result.isRealtimeDataAttached, false);
});
