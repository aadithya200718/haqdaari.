export interface Benefit {
  readonly amount: number;
  readonly frequency: "monthly" | "yearly" | "one-time" | "as-needed";
  readonly currency: "INR";
  readonly description: string;
}

export interface Eligibility {
  readonly ageMin?: number;
  readonly ageMax?: number;
  readonly incomeCeiling?: number;
  readonly gender?: ("male" | "female" | "other")[];
  readonly caste?: string[];
  readonly occupation?: string[];
  readonly state?: string[];
  readonly landOwnership?: { min?: number; max?: number };
  readonly category?: string;
}

export interface SchemeRule {
  readonly schemeId: string;
  readonly schemeName: string;
  readonly schemeNameHindi: string;
  readonly authority: string;
  readonly benefit: Benefit;
  readonly eligibility: Eligibility;
  readonly requiredDocuments: string[];
  readonly applicationProcess: string;
  readonly contactInfo: string;
  readonly sourceUrl: string;
  readonly status: "active" | "inactive";
}
