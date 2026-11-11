// Haversine formula to compute great-circle distance between two coordinates in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

// Estimate realistic travel time in minutes based on distance, terrain, and emergency convoy speeds
export function estimateTravelTimeMinutes(
  distanceKm: number,
  isHillyTerrain: boolean = false,
  isDisasterCongested: boolean = true
): number {
  // Base average emergency convoy speed (km/h)
  let speedKmH = 45;
  if (isHillyTerrain) speedKmH = 25;
  if (isDisasterCongested) speedKmH = speedKmH * 0.7; // 30% reduction due to rain/traffic

  const hours = distanceKm / Math.max(speedKmH, 15);
  return Math.max(5, Math.round(hours * 60));
}

// Interpolate realistic road coordinates with gentle bends between two geographic points
export function generateCurvedRoutePath(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  numSteps: number = 8,
  curvatureOffset: number = 0.02
): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  points.push(start);

  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;

  // Perpendicular vector for realistic highway bend
  const dLat = end.lat - start.lat;
  const dLng = end.lng - start.lng;
  const perpLat = -dLng * curvatureOffset;
  const perpLng = dLat * curvatureOffset;

  for (let i = 1; i < numSteps; i++) {
    const t = i / numSteps;
    // Quadratic Bezier formula
    const lat =
      (1 - t) * (1 - t) * start.lat +
      2 * (1 - t) * t * (midLat + perpLat) +
      t * t * end.lat;
    const lng =
      (1 - t) * (1 - t) * start.lng +
      2 * (1 - t) * t * (midLng + perpLng) +
      t * t * end.lng;
    points.push({
      lat: Math.round(lat * 100000) / 100000,
      lng: Math.round(lng * 100000) / 100000,
    });
  }

  points.push(end);
  return points;
}
