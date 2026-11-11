import { Disaster, Shelter, AllocationPlan, AllocationItem } from '../types';
import { calculateHaversineDistance, estimateTravelTimeMinutes } from './geoUtils';

export interface AllocationEngineOptions {
  maxAllocationRadiusKm?: number;
  weightDistance?: number;
  weightCapacity?: number;
  weightSafety?: number;
  weightResources?: number;
}

export interface CandidateShelterEvaluation {
  shelter: Shelter;
  distanceKm: number;
  etaMinutes: number;
  availableBeds: number;
  isInsideExclusionZone: boolean;
  isEligible: boolean;
  score: number;
  disqualificationReason?: string;
  scoringFactors: {
    distanceScore: number;
    capacityScore: number;
    safetyScore: number;
    resourcesScore: number;
  };
}

/**
 * Smart Constraint-Optimized Shelter Allocation Engine
 * Solves multi-objective allocation with hard constraints:
 * 1. Hard constraint: Never allocate to a shelter within disaster exclusion radius.
 * 2. Hard constraint: Never exceed available shelter bed capacity.
 * 3. Soft objective: Prioritize vulnerable population to best-equipped shelters.
 * 4. Soft objective: Minimize evacuation distance and convoy transit time.
 * 5. Soft objective: Balance load across available shelters.
 */
export function solveShelterAllocation(
  disaster: Disaster,
  shelters: Shelter[],
  overrideAffectedPopulation?: number,
  options: AllocationEngineOptions = {}
): AllocationPlan {
  const startTime = Date.now();
  const populationToAllocate = overrideAffectedPopulation !== undefined 
    ? overrideAffectedPopulation 
    : disaster.affectedPopulation;

  const maxRadius = options.maxAllocationRadiusKm || 150;
  const wDist = options.weightDistance || 0.40;
  const wCap = options.weightCapacity || 0.25;
  const wSafe = options.weightSafety || 0.20;
  const wRes = options.weightResources || 0.15;

  let statesExplored = 0;

  // Step 1: Filter and evaluate all candidates
  const candidates: CandidateShelterEvaluation[] = shelters.map((s) => {
    statesExplored++;
    const dist = calculateHaversineDistance(
      disaster.location.lat,
      disaster.location.lng,
      s.location.lat,
      s.location.lng
    );

    const availableBeds = Math.max(0, s.capacity - s.currentOccupancy);
    const isInsideExclusionZone = dist <= disaster.exclusionRadiusKm;
    
    let isEligible = true;
    let disqualificationReason = '';

    if (isInsideExclusionZone) {
      isEligible = false;
      disqualificationReason = `Inside hazard exclusion perimeter (${dist}km <= ${disaster.exclusionRadiusKm}km safe radius)`;
    } else if (availableBeds <= 0) {
      isEligible = false;
      disqualificationReason = `Shelter at 100% full capacity (0 beds available)`;
    } else if (s.status === 'Compromised') {
      isEligible = false;
      disqualificationReason = `Shelter infrastructure reported compromised`;
    } else if (dist > maxRadius) {
      isEligible = false;
      disqualificationReason = `Exceeds max operational evacuation boundary (${dist}km > ${maxRadius}km)`;
    }

    // Scoring (0 - 100)
    // Distance score: closer is better
    const distanceScore = Math.max(0, 100 - (dist / maxRadius) * 100);
    // Capacity score: higher available beds is better
    const capacityScore = Math.min(100, (availableBeds / 2000) * 100);
    // Safety score: from shelter attributes
    const safetyScore = s.safetyScore;
    // Resources score: based on food/water days, medical triage, power backup, disabled access
    let resourcesScore = Math.min(100, s.foodWaterDays * 12);
    if (s.electricityBackup) resourcesScore += 15;
    if (s.disabledAccessible) resourcesScore += 15;
    if (s.medicalFacilities && s.medicalFacilities.length > 0) {
      resourcesScore += Math.min(20, s.medicalFacilities.length * 6);
    }
    resourcesScore = Math.min(100, resourcesScore);

    const totalScore = isEligible
      ? distanceScore * wDist +
        capacityScore * wCap +
        safetyScore * wSafe +
        resourcesScore * wRes
      : -1;

    return {
      shelter: s,
      distanceKm: dist,
      etaMinutes: estimateTravelTimeMinutes(dist, disaster.type === 'landslide'),
      availableBeds,
      isInsideExclusionZone,
      isEligible,
      score: Math.round(totalScore * 10) / 10,
      disqualificationReason,
      scoringFactors: {
        distanceScore: Math.round(distanceScore),
        capacityScore: Math.round(capacityScore),
        safetyScore: Math.round(safetyScore),
        resourcesScore: Math.round(resourcesScore),
      },
    };
  });

  // Sort eligible candidates by highest total optimization score
  const eligibleCandidates = candidates
    .filter((c) => c.isEligible)
    .sort((a, b) => b.score - a.score);

  // Step 2: Multi-Pass Greedy Allocation with Vulnerable Demographic Partitioning
  let remainingPopulation = populationToAllocate;
  let remainingElderly = disaster.vulnerableDemographics?.elderly || Math.round(populationToAllocate * 0.12);
  let remainingChildren = disaster.vulnerableDemographics?.children || Math.round(populationToAllocate * 0.18);
  let remainingDisabled = disaster.vulnerableDemographics?.disabled || Math.round(populationToAllocate * 0.04);
  
  const allocations: AllocationItem[] = [];
  const alternativeShelters: Record<string, { id: string; name: string; availableBeds: number; distanceKm: number }[]> = {};

  // Track modified shelter capacities during allocation
  const tempCapacities = new Map<string, number>();
  eligibleCandidates.forEach((c) => tempCapacities.set(c.shelter.id, c.availableBeds));

  for (const candidate of eligibleCandidates) {
    if (remainingPopulation <= 0) break;

    statesExplored++;
    const currentAvailable = tempCapacities.get(candidate.shelter.id) || 0;
    if (currentAvailable <= 0) continue;

    // How many can this shelter accommodate without violating capacity constraint
    const allocatedCount = Math.min(remainingPopulation, currentAvailable);

    // Prioritize placing vulnerable demographics into top-scoring shelters
    const allocDisabled = Math.min(remainingDisabled, Math.round(allocatedCount * 0.08), allocatedCount);
    const allocElderly = Math.min(remainingElderly, Math.round(allocatedCount * 0.20), allocatedCount - allocDisabled);
    const allocChildren = Math.min(remainingChildren, Math.round(allocatedCount * 0.25), allocatedCount - allocDisabled - allocElderly);
    const allocGeneral = Math.max(0, allocatedCount - allocDisabled - allocElderly - allocChildren);

    remainingDisabled -= allocDisabled;
    remainingElderly -= allocElderly;
    remainingChildren -= allocChildren;
    remainingPopulation -= allocatedCount;

    const remainingCapacityAfter = currentAvailable - allocatedCount;
    tempCapacities.set(candidate.shelter.id, remainingCapacityAfter);

    // Formulate explainable reasoning
    const reasons: string[] = [];
    reasons.push(`${candidate.distanceKm} km transit (${candidate.etaMinutes} min convoy ETA)`);
    reasons.push(`Safety index: ${candidate.shelter.safetyScore}/100`);
    if (candidate.shelter.disabledAccessible && allocDisabled > 0) {
      reasons.push(`Accessible facilities matched for ${allocDisabled} mobility-impaired persons`);
    }
    if (candidate.shelter.medicalFacilities?.length) {
      reasons.push(`On-site triage: ${candidate.shelter.medicalFacilities.slice(0, 2).join(', ')}`);
    }
    if (candidate.shelter.foodWaterDays >= 5) {
      reasons.push(`Pre-stocked ${candidate.shelter.foodWaterDays} days sustenance`);
    }

    allocations.push({
      shelterId: candidate.shelter.id,
      shelterName: candidate.shelter.name,
      shelterType: candidate.shelter.type,
      allocatedCount,
      vulnerableCount: {
        elderly: allocElderly,
        children: allocChildren,
        disabled: allocDisabled,
        general: allocGeneral,
      },
      distanceKm: candidate.distanceKm,
      etaMinutes: candidate.etaMinutes,
      reason: reasons.join(' • '),
      safetyScore: candidate.shelter.safetyScore,
      remainingCapacityAfter,
    });
  }

  // Step 3: Compute alternative backup shelters for each allocated shelter
  for (const alloc of allocations) {
    const alternates = eligibleCandidates
      .filter((c) => c.shelter.id !== alloc.shelterId && (tempCapacities.get(c.shelter.id) || 0) > 0)
      .slice(0, 3)
      .map((c) => ({
        id: c.shelter.id,
        name: c.shelter.name,
        availableBeds: tempCapacities.get(c.shelter.id) || 0,
        distanceKm: c.distanceKm,
      }));
    alternativeShelters[alloc.shelterId] = alternates;
  }

  const totalAllocated = populationToAllocate - remainingPopulation;
  const unallocatedCount = Math.max(0, remainingPopulation);
  const efficiencyScore = populationToAllocate > 0
    ? Math.round((totalAllocated / populationToAllocate) * 100)
    : 100;

  const executionTimeMs = Date.now() - startTime;

  return {
    disasterId: disaster.id,
    disasterName: disaster.name,
    totalAffected: populationToAllocate,
    totalAllocated,
    unallocatedCount,
    allocations,
    alternativeShelters,
    statesExplored,
    executionTimeMs,
    efficiencyScore,
    timestamp: new Date().toISOString(),
  };
}
