export type DisasterType = 
  | 'flood' 
  | 'earthquake' 
  | 'cyclone' 
  | 'landslide' 
  | 'drought' 
  | 'forest_fire';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  state: string;
  district: string;
  city?: string;
  address?: string;
}

export interface Disaster {
  id: string;
  name: string;
  type: DisasterType;
  severity: SeverityLevel;
  location: LocationCoordinates;
  affectedPopulation: number;
  vulnerableDemographics: {
    elderly: number;
    children: number;
    disabled: number;
    medicalNeeds: number;
  };
  probability: number; // 0 - 100%
  confidence: number; // 0 - 100%
  forecastHorizon: '24 Hours' | '48 Hours' | '7 Days';
  metrics: {
    rainfall_mm_24h?: number;
    windSpeed_kmh?: number;
    riverLevel_m?: number;
    riverDangerMark_m?: number;
    seismicMagnitude?: number;
    seismicDepth_km?: number;
    temperature_c?: number;
    soilSaturation_pct?: number;
  };
  contributingFactors: string[];
  recommendedActions: string[];
  exclusionRadiusKm: number;
  isSimulated: boolean;
  status: 'Active Alert' | 'Predicted' | 'Escalating' | 'Contained';
  dataSource: 'IMD' | 'NDMA' | 'CWC' | 'USGS' | 'ISRO Bhuvan' | 'AI Ensemble';
}

export interface Shelter {
  id: string;
  name: string;
  type: 'School' | 'Stadium' | 'College Campus' | 'Community Hall' | 'Hospital' | 'Cyclone Shelter' | 'Relief Camp';
  location: LocationCoordinates;
  capacity: number;
  currentOccupancy: number;
  availableBeds: number;
  medicalFacilities: string[];
  foodWaterDays: number;
  drinkingWaterLiters: number;
  electricityBackup: boolean;
  disabledAccessible: boolean;
  contactPerson: string;
  contactPhone: string;
  safetyScore: number; // 0 - 100
  status: 'Available' | 'Near Capacity' | 'Full' | 'In Hazard Zone' | 'Standby' | 'Compromised';
}

export interface AllocationItem {
  shelterId: string;
  shelterName: string;
  shelterType: string;
  allocatedCount: number;
  vulnerableCount: {
    elderly: number;
    children: number;
    disabled: number;
    general: number;
  };
  distanceKm: number;
  etaMinutes: number;
  reason: string;
  safetyScore: number;
  remainingCapacityAfter: number;
}

export interface AllocationPlan {
  disasterId: string;
  disasterName: string;
  totalAffected: number;
  totalAllocated: number;
  unallocatedCount: number;
  allocations: AllocationItem[];
  alternativeShelters: Record<string, { id: string; name: string; availableBeds: number; distanceKm: number }[]>;
  statesExplored: number;
  executionTimeMs: number;
  efficiencyScore: number; // 0-100
  timestamp: string;
}

export interface EvacuationRoute {
  id: string;
  disasterId: string;
  shelterId: string;
  shelterName: string;
  originName: string;
  destinationName: string;
  path: { lat: number; lng: number }[];
  distanceKm: number;
  etaMinutes: number;
  status: 'Safest' | 'Normal' | 'Congested' | 'Blocked';
  blockedReason?: string;
  alternativeRouteName?: string;
}

export interface IndianState {
  code: string;
  name: string;
  type: 'State' | 'UT';
  lat: number;
  lng: number;
  zoom: number;
  riskLevel: SeverityLevel;
  capital: string;
  activeDisasters: number;
  totalShelters: number;
}

export interface AIAgent {
  id: 'dpa' | 'raa' | 'saa' | 'rpa' | 'mra' | 'rma';
  code: string;
  name: string;
  title: string;
  status: 'Active' | 'Optimizing' | 'Alert' | 'Standby';
  confidence: number;
  lastMessage: string;
  metrics: { label: string; value: string }[];
  icon: string;
}
