/**
 * Scheme Arbitrage Detector
 *
 * Compares citizen's current/enrolled schemes against ALL eligible schemes
 * to find better alternatives. Key differentiator: "Switch from Scheme A (₹500/mo)
 * to Scheme B (₹2,000/mo)"
 */

import { MatchedScheme } from "../../../shared/types/EligibilityResult";

export interface ArbitrageOpportunity {
  currentScheme: {
    schemeId: string;
    schemeName: string;
    schemeNameHindi: string;
    benefitAmount: number;
    frequency: string;
  };
  betterScheme: {
    schemeId: string;
    schemeName: string;
    schemeNameHindi: string;
    benefitAmount: number;
    frequency: string;
  };
  monthlySavings: number;
  yearlySavings: number;
  reason: string;
  reasonHindi: string;
}

// Normalize all benefits to monthly equivalent for comparison
function toMonthly(amount: number, frequency: string): number {
  switch (frequency) {
    case "monthly":
      return amount;
    case "yearly":
      return amount / 12;
    case "one-time":
      return amount / 60; // amortize over 5 years
    case "as-needed":
      return amount / 12;
    default:
      return amount / 12;
  }
}

// Simulated currently enrolled schemes for demo citizens
const ENROLLED_SCHEMES: Record<string, string[]> = {
  default: ["NSAP", "PMGKAY"], // Ramesh: on old pension + ration, missing better ones
  "111122223333": ["PMGKAY"], // Sunita: only ration, missing PMUY, PMMVY
  "444455556666": ["MGNREGA"], // Arjun: only MGNREGA, missing PM-VISHWAKARMA
  "222233334444": ["PMGKAY", "PMFBY"], // Lakshmi: ration + crop insurance
  "333344445555": ["MUDRA"], // Priya: only MUDRA loan
  "555566667777": ["PM-KISAN", "NSAP"], // Biju: on PM-KISAN + old pension
  "666677778888": ["MGNREGA", "PMGKAY"], // Meena: employment + ration
  "777788889999": ["PM-KISAN"], // Rajendra: only PM-KISAN, missing PMFBY
  "888899990000": ["PMSVANIDHI"], // Kavita: only street vendor loan
  "999900001111": ["PM-KISAN", "PMFBY", "MGNREGA"], // Mahendra: already on many schemes
};

// Category mapping for scheme comparison
const SCHEME_CATEGORIES: Record<string, string> = {
  "PM-KISAN": "agriculture",
  PMJAY: "health",
  PMAY: "housing",
  MGNREGA: "employment",
  PMUY: "fuel",
  SSY: "savings",
  "PM-VISHWAKARMA": "employment",
  MUDRA: "business",
  APY: "pension",
  PMGKAY: "food",
  NSAP: "pension",
  PMMVY: "maternity",
  "STANDUP-INDIA": "business",
  PMSVANIDHI: "business",
  PMFBY: "agriculture",
};

export function detectArbitrage(
  eligibleSchemes: MatchedScheme[],
  aadhaarNumber: string,
): ArbitrageOpportunity[] {
  const start = Date.now();
  const enrolled =
    ENROLLED_SCHEMES[aadhaarNumber] ?? ENROLLED_SCHEMES["default"];
  const opportunities: ArbitrageOpportunity[] = [];

  // For each enrolled scheme, check if there's a better eligible scheme in the same category
  for (const enrolledId of enrolled) {
    const enrolledScheme = eligibleSchemes.find(
      (s) => s.schemeId === enrolledId,
    );
    const enrolledCategory = SCHEME_CATEGORIES[enrolledId];

    if (!enrolledCategory) continue;

    // Find all eligible schemes in the same category that are better
    const betterOptions = eligibleSchemes.filter((s) => {
      if (s.schemeId === enrolledId) return false;
      const cat = SCHEME_CATEGORIES[s.schemeId];
      if (cat !== enrolledCategory) return false;

      const currentMonthly = enrolledScheme
        ? toMonthly(
            enrolledScheme.benefit.amount,
            enrolledScheme.benefit.frequency,
          )
        : 0;
      const newMonthly = toMonthly(s.benefit.amount, s.benefit.frequency);
      return newMonthly > currentMonthly;
    });

    for (const better of betterOptions) {
      const currentMonthly = enrolledScheme
        ? toMonthly(
            enrolledScheme.benefit.amount,
            enrolledScheme.benefit.frequency,
          )
        : 0;
      const newMonthly = toMonthly(
        better.benefit.amount,
        better.benefit.frequency,
      );
      const monthlySavings = Math.round(newMonthly - currentMonthly);
      const yearlySavings = monthlySavings * 12;

      opportunities.push({
        currentScheme: {
          schemeId: enrolledId,
          schemeName: enrolledScheme?.schemeName ?? enrolledId,
          schemeNameHindi: enrolledScheme?.schemeNameHindi ?? enrolledId,
          benefitAmount: enrolledScheme?.benefit.amount ?? 0,
          frequency: enrolledScheme?.benefit.frequency ?? "monthly",
        },
        betterScheme: {
          schemeId: better.schemeId,
          schemeName: better.schemeName,
          schemeNameHindi: better.schemeNameHindi,
          benefitAmount: better.benefit.amount,
          frequency: better.benefit.frequency,
        },
        monthlySavings,
        yearlySavings,
        reason: `Switch from ${enrolledScheme?.schemeName ?? enrolledId} (₹${Math.round(currentMonthly)}/mo) to ${better.schemeName} (₹${Math.round(newMonthly)}/mo)`,
        reasonHindi: `${enrolledScheme?.schemeNameHindi ?? enrolledId} से ${better.schemeNameHindi} में बदलें — ₹${monthlySavings}/माह अधिक लाभ`,
      });
    }
  }

  // Also find completely missing high-value schemes
  const enrolledSet = new Set(enrolled);
  const missing = eligibleSchemes
    .filter((s) => !enrolledSet.has(s.schemeId) && s.benefit.amount > 5000)
    .sort((a, b) => b.benefit.amount - a.benefit.amount)
    .slice(0, 3);

  for (const scheme of missing) {
    const monthly = toMonthly(scheme.benefit.amount, scheme.benefit.frequency);
    opportunities.push({
      currentScheme: {
        schemeId: "NONE",
        schemeName: "Not Enrolled",
        schemeNameHindi: "नामांकित नहीं",
        benefitAmount: 0,
        frequency: "monthly",
      },
      betterScheme: {
        schemeId: scheme.schemeId,
        schemeName: scheme.schemeName,
        schemeNameHindi: scheme.schemeNameHindi,
        benefitAmount: scheme.benefit.amount,
        frequency: scheme.benefit.frequency,
      },
      monthlySavings: Math.round(monthly),
      yearlySavings: Math.round(monthly * 12),
      reason: `You're missing ${scheme.schemeName} — ₹${Math.round(monthly)}/mo unclaimed`,
      reasonHindi: `${scheme.schemeNameHindi} में नामांकित नहीं — ₹${Math.round(monthly)}/माह का लाभ छूट रहा है`,
    });
  }

  // Sort by yearly savings descending
  opportunities.sort((a, b) => b.yearlySavings - a.yearlySavings);

  console.log(
    `[AUDIT][SchemeArbitrage] Found ${opportunities.length} arbitrage opportunities in ${Date.now() - start}ms`,
  );
  return opportunities;
}
