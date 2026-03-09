import { CitizenProfile } from "../../../shared/types/CitizenProfile";
import { SchemeRule } from "../../../shared/types/SchemeRule";
import {
  EligibilityResult,
  MatchedScheme,
} from "../../../shared/types/EligibilityResult";

/**
 * Rule-based eligibility matching engine.
 * No Bedrock — pure deterministic matching for demo/MVP.
 */
export function matchSchemes(
  profile: CitizenProfile,
  schemes: SchemeRule[],
): EligibilityResult {
  const start = Date.now();
  const matched: MatchedScheme[] = [];

  for (const scheme of schemes) {
    if (scheme.status !== "active") continue;

    const { score, totalCriteria } = scoreProfile(profile, scheme);
    if (totalCriteria === 0) continue;

    const normalizedScore = score / totalCriteria;
    if (normalizedScore < 0.7) continue;

    const missing = findMissingDocuments(profile, scheme);

    matched.push({
      schemeId: scheme.schemeId,
      schemeName: scheme.schemeName,
      schemeNameHindi: scheme.schemeNameHindi,
      benefit: {
        amount: scheme.benefit.amount,
        frequency: scheme.benefit.frequency,
        description: scheme.benefit.description,
      },
      eligibilityScore: Math.round(normalizedScore * 100) / 100,
      missingDocuments: missing,
    });
  }

  matched.sort((a, b) => b.eligibilityScore - a.eligibilityScore);

  return {
    citizenId: profile.citizenId,
    eligibleSchemes: matched,
    processingTimeMs: Date.now() - start,
  };
}

function scoreProfile(
  profile: CitizenProfile,
  scheme: SchemeRule,
): { score: number; totalCriteria: number } {
  let score = 0;
  let total = 0;
  const elig = scheme.eligibility;

  // Age range
  if (elig.ageMin !== undefined || elig.ageMax !== undefined) {
    total++;
    const minOk = elig.ageMin === undefined || profile.age >= elig.ageMin;
    const maxOk = elig.ageMax === undefined || profile.age <= elig.ageMax;
    if (minOk && maxOk) score++;
  }

  // Income ceiling
  if (elig.incomeCeiling !== undefined) {
    total++;
    if (profile.income <= elig.incomeCeiling) score++;
  }

  // Gender
  if (elig.gender && elig.gender.length > 0) {
    total++;
    if (elig.gender.includes(profile.gender)) score++;
  }

  // Caste
  if (elig.caste && elig.caste.length > 0) {
    total++;
    if (elig.caste.some((c) => c.toLowerCase() === profile.caste.toLowerCase()))
      score++;
  }

  // Occupation
  if (elig.occupation && elig.occupation.length > 0) {
    total++;
    if (
      elig.occupation.some(
        (o) => o.toLowerCase() === profile.occupation.toLowerCase(),
      )
    )
      score++;
  }

  // State
  if (elig.state && elig.state.length > 0) {
    total++;
    if (
      elig.state.some(
        (s) => s.toLowerCase() === profile.address.state.toLowerCase(),
      )
    )
      score++;
  }

  // Land ownership
  if (elig.landOwnership) {
    total++;
    if (profile.landOwnership !== null) {
      const minOk =
        elig.landOwnership.min === undefined ||
        profile.landOwnership >= elig.landOwnership.min;
      const maxOk =
        elig.landOwnership.max === undefined ||
        profile.landOwnership <= elig.landOwnership.max;
      if (minOk && maxOk) score++;
    }
  }

  return { score, totalCriteria: total };
}

function findMissingDocuments(
  profile: CitizenProfile,
  scheme: SchemeRule,
): string[] {
  const haveDocs = new Set(profile.documents.map((d) => d.type));
  return scheme.requiredDocuments.filter((req) => !haveDocs.has(req as any));
}
