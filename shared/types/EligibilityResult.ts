export interface MatchedScheme {
  readonly schemeId: string;
  readonly schemeName: string;
  readonly schemeNameHindi: string;
  readonly benefit: { amount: number; frequency: string; description: string };
  readonly eligibilityScore: number;
  readonly missingDocuments: string[];
}

export interface EligibilityResult {
  readonly citizenId: string;
  readonly eligibleSchemes: MatchedScheme[];
  readonly processingTimeMs: number;
}
