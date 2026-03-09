import { create } from "zustand";

interface ShadowAction {
  description: string;
  descriptionHindi: string;
}

interface MatchedScheme {
  schemeId: string;
  schemeName: string;
  schemeNameHindi: string;
  benefit: { amount: number; frequency: string; description: string };
  eligibilityScore: number;
  missingDocuments: string[];
}

interface ShadowPreview {
  previewId: string;
  citizenId: string;
  actions: ShadowAction[];
  status: "pending" | "approved" | "cancelled";
  timestamp: string;
  expiresAt: string;
}

interface EligibilityResult {
  citizenId: string;
  eligibleSchemes: MatchedScheme[];
  processingTimeMs: number;
}

interface ArbitrageOpportunity {
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

interface AiExplanation {
  content: string;
  contentHindi: string;
  model: string;
  tokens: { input: number; output: number };
  latencyMs: number;
}

interface AppState {
  language: "hi" | "en";
  setLanguage: (lang: "hi" | "en") => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  maskedAadhaar: string | null;
  citizenName: string | null;
  shadowPreview: ShadowPreview | null;
  eligibilityResult: EligibilityResult | null;
  arbitrage: ArbitrageOpportunity[];
  aiExplanation: AiExplanation | null;
  shadowApproved: boolean;
  setShadowApproved: (v: boolean) => void;
  setApiResult: (data: {
    maskedAadhaar: string;
    citizenName: string;
    shadowPreview: ShadowPreview;
    eligibilityResult: EligibilityResult;
    arbitrage?: ArbitrageOpportunity[];
    aiExplanation?: AiExplanation;
  }) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  language: "hi",
  setLanguage: (lang) => set({ language: lang }),
  loading: false,
  setLoading: (v) => set({ loading: v }),
  maskedAadhaar: null,
  citizenName: null,
  shadowPreview: null,
  eligibilityResult: null,
  arbitrage: [],
  aiExplanation: null,
  shadowApproved: false,
  setShadowApproved: (v) => set({ shadowApproved: v }),
  setApiResult: (data) =>
    set({
      maskedAadhaar: data.maskedAadhaar,
      citizenName: data.citizenName,
      shadowPreview: data.shadowPreview,
      eligibilityResult: data.eligibilityResult,
      arbitrage: data.arbitrage ?? [],
      aiExplanation: data.aiExplanation ?? null,
    }),
  reset: () =>
    set({
      maskedAadhaar: null,
      citizenName: null,
      shadowPreview: null,
      eligibilityResult: null,
      arbitrage: [],
      aiExplanation: null,
      shadowApproved: false,
    }),
}));
