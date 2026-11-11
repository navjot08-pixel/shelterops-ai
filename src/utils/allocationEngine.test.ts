import test from 'node:test';
import assert from 'node:assert/strict';
import { solveShelterAllocation } from './allocationEngine';
import { Disaster, Shelter } from '../types';

const mockDisaster: Disaster = {
  id: 'disaster-assam-flood',
  name: 'Brahmaputra River Floods',
  type: 'flood',
  severity: 'Critical',
  location: {
    lat: 26.2006,
    lng: 92.9376,
    state: 'Assam',
    district: 'Morigaon',
    city: 'Morigaon',
  },
  affectedPopulation: 3500,
  vulnerableDemographics: {
    elderly: 420,
    children: 630,
    disabled: 140,
    medicalNeeds: 90,
  },
  probability: 95,
  confidence: 94,
  forecastHorizon: '24 Hours',
  metrics: {
    rainfall_mm_24h: 245,
    riverLevel_m: 51.8,
    riverDangerMark_m: 49.5,
  },
  contributingFactors: ['72h heavy monsoon precipitation', 'Discharge 45,000 cusecs'],
  recommendedActions: ['Immediate evacuation of low-lying floodplains'],
  exclusionRadiusKm: 8, // Shelters within 8 km are inside the flooded zone!
  isSimulated: false,
  status: 'Active Alert',
  dataSource: 'CWC',
};

const mockShelters: Shelter[] = [
  {
    id: 'shelter-morigaon-unsafe',
    name: 'Morigaon Lowland Primary School',
    type: 'School',
    location: {
      lat: 26.2100, // ~2 km from epicenter - inside exclusion radius!
      lng: 92.9400,
      state: 'Assam',
      district: 'Morigaon',
    },
    capacity: 1000,
    currentOccupancy: 100,
    availableBeds: 900,
    medicalFacilities: ['First Aid'],
    foodWaterDays: 3,
    drinkingWaterLiters: 2000,
    electricityBackup: false,
    disabledAccessible: false,
    contactPerson: 'R. Saikia',
    contactPhone: '+91-9876543210',
    safetyScore: 35,
    status: 'Available',
  },
  {
    id: 'shelter-nagaon-highland',
    name: 'Nagaon Elevated Indoor Stadium',
    type: 'Stadium',
    location: {
      lat: 26.3464, // ~22 km away - safe distance
      lng: 92.6840,
      state: 'Assam',
      district: 'Nagaon',
    },
    capacity: 2500,
    currentOccupancy: 500,
    availableBeds: 2000,
    medicalFacilities: ['Trauma Center', 'Oxygen Beds', 'Pharmacy'],
    foodWaterDays: 7,
    drinkingWaterLiters: 15000,
    electricityBackup: true,
    disabledAccessible: true,
    contactPerson: 'Major K. Baruah',
    contactPhone: '+91-9435012345',
    safetyScore: 92,
    status: 'Available',
  },
  {
    id: 'shelter-tezpur-college',
    name: 'Tezpur Central Polytech Campus',
    type: 'College Campus',
    location: {
      lat: 26.6338, // ~55 km away - safe backup
      lng: 92.7926,
      state: 'Assam',
      district: 'Sonitpur',
    },
    capacity: 3000,
    currentOccupancy: 1000,
    availableBeds: 2000,
    medicalFacilities: ['Doctor on Call', 'Emergency Ward'],
    foodWaterDays: 5,
    drinkingWaterLiters: 12000,
    electricityBackup: true,
    disabledAccessible: true,
    contactPerson: 'Dr. P. Gogoi',
    contactPhone: '+91-9435098765',
    safetyScore: 88,
    status: 'Available',
  },
];

test('Never allocates people to shelter inside unsafe disaster exclusion zone', () => {
  const plan = solveShelterAllocation(mockDisaster, mockShelters);

  // The unsafe shelter within 8km must NOT be in the allocations
  const unsafeAlloc = plan.allocations.find((a) => a.shelterId === 'shelter-morigaon-unsafe');
  assert.equal(unsafeAlloc, undefined, 'Unsafe shelter inside exclusion perimeter must be rejected');
});

test('Never exceeds available shelter bed capacity', () => {
  const plan = solveShelterAllocation(mockDisaster, mockShelters, 5000);

  for (const alloc of plan.allocations) {
    const original = mockShelters.find((s) => s.id === alloc.shelterId);
    assert.ok(original);
    const maxBeds = original.capacity - original.currentOccupancy;
    assert.ok(
      alloc.allocatedCount <= maxBeds,
      `Allocated count ${alloc.allocatedCount} exceeds available capacity ${maxBeds}`
    );
  }
});

test('Prioritizes closer safe shelters and partitions vulnerable population', () => {
  const plan = solveShelterAllocation(mockDisaster, mockShelters, 2000);

  assert.ok(plan.allocations.length > 0);
  // Nagaon is closer than Tezpur, so it should receive the primary allocation
  assert.equal(plan.allocations[0].shelterId, 'shelter-nagaon-highland');
  assert.equal(plan.allocations[0].allocatedCount, 2000);
  assert.ok(plan.allocations[0].vulnerableCount.elderly > 0);
  assert.ok(plan.allocations[0].vulnerableCount.children > 0);
  assert.ok(plan.allocations[0].vulnerableCount.disabled > 0);
});

test('Correctly reports unallocated population when capacity is exceeded', () => {
  // Total available safe capacity: Nagaon (2000) + Tezpur (2000) = 4000
  // Test with 6000 population:
  const plan = solveShelterAllocation(mockDisaster, mockShelters, 6000);

  assert.equal(plan.totalAllocated, 4000);
  assert.equal(plan.unallocatedCount, 2000);
  assert.ok(plan.efficiencyScore < 100);
});
