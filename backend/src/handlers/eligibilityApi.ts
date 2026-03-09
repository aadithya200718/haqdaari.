import { v4 as uuidv4 } from "uuid";
import { fetchDemographics } from "../clients/aadhaarClient";
import { fetchDocuments } from "../clients/digilockerClient";
import { generateEligibilityExplanation } from "../clients/bedrockClient";
import { recordAuditEvent } from "../clients/dynamoClient";
import { verifyBankAccount } from "../clients/upiBankClient";
import { notifyEligibilityResult } from "../clients/snsClient";
import { matchSchemes } from "../services/eligibilityService";
import {
  detectArbitrage,
  ArbitrageOpportunity,
} from "../services/arbitrageService";
import { CitizenProfile } from "../../../shared/types/CitizenProfile";
import { ShadowPreview } from "../../../shared/types/ShadowPreview";
import { EligibilityResult } from "../../../shared/types/EligibilityResult";
import schemes from "../../../data/schemes/all-schemes.json";

function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\s|-/g, "");
  return `XXXX-XXXX-${clean.slice(-4)}`;
}

function validateAadhaar(aadhaar: string): boolean {
  const clean = aadhaar.replace(/\s|-/g, "");
  return /^\d{12}$/.test(clean);
}

interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event: any): Promise<ApiResponse> {
  console.log("[AUDIT][EligibilityAPI] Request received");

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { aadhaarNumber } = body;

    if (!aadhaarNumber) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "aadhaarNumber is required" }),
      };
    }

    if (!validateAadhaar(aadhaarNumber)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "Invalid Aadhaar format. Must be 12 digits.",
        }),
      };
    }

    const masked = maskAadhaar(aadhaarNumber);
    console.log(`[AUDIT][EligibilityAPI] Processing for: ${masked}`);

    // Step 1: Fetch demographics (SIMULATED)
    const demographics = await fetchDemographics(aadhaarNumber);

    // Step 2: Fetch documents (SIMULATED)
    const cleanAadhaar = aadhaarNumber.replace(/\s|-/g, "");
    const documents = await fetchDocuments(cleanAadhaar);

    // Step 3: Build citizen profile
    const citizenId = `citizen_${uuidv4().slice(0, 8)}`;
    const incomeDoc = documents.find((d) => d.type === "income_certificate");
    const casteDoc = documents.find((d) => d.type === "caste_certificate");
    const landDoc = documents.find((d) => d.type === "land_record");

    const profile: CitizenProfile = {
      citizenId,
      name: demographics.name,
      age: demographics.age,
      gender: demographics.gender,
      phone: demographics.phone,
      address: demographics.address,
      income: incomeDoc?.numericValue ?? 100000,
      caste: casteDoc?.value ?? "General",
      occupation: demographics.occupation,
      landOwnership: landDoc?.numericValue ?? null,
      documents: documents.map((d) => ({ ...d, type: d.type as any })),
    };

    // Step 3b: Verify bank account (India Stack — UPI Bank Verify)
    const bankInfo = await verifyBankAccount(aadhaarNumber);
    console.log(
      `[AUDIT][EligibilityAPI] Bank verified: ${bankInfo.verified ? bankInfo.bankName : "NOT FOUND"} (Jan Dhan: ${bankInfo.janDhanAccount})`,
    );

    // Step 4: Match schemes
    const result: EligibilityResult = matchSchemes(profile, schemes as any);

    // Step 5: Scheme Arbitrage Detection
    const cleanAadhaarForArbitrage = aadhaarNumber.replace(/\s|-/g, "");
    const arbitrage: ArbitrageOpportunity[] = detectArbitrage(
      result.eligibleSchemes,
      cleanAadhaarForArbitrage,
    );

    // Step 6: Bedrock AI explanation (mock)
    const totalBenefit = result.eligibleSchemes.reduce(
      (sum, s) => sum + s.benefit.amount,
      0,
    );
    const aiExplanation = await generateEligibilityExplanation(
      profile.name,
      result.eligibleSchemes.length,
      totalBenefit,
    );

    // Step 7: Build Shadow Mode preview
    const preview: ShadowPreview = {
      previewId: `preview_${uuidv4().slice(0, 8)}`,
      citizenId,
      actions: [
        {
          description: "Fetch demographics from Aadhaar",
          descriptionHindi: "आधार से जनसांख्यिकीय डेटा प्राप्त करेंगे",
        },
        {
          description: "Fetch documents from DigiLocker",
          descriptionHindi: "डिजिलॉकर से दस्तावेज़ प्राप्त करेंगे",
        },
        {
          description: `Match against ${schemes.length} government schemes`,
          descriptionHindi: `${schemes.length} सरकारी योजनाओं से मिलान करेंगे`,
        },
        {
          description: "Save results to database",
          descriptionHindi: "परिणाम डेटाबेस में सहेजेंगे",
        },
      ],
      status: "pending",
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    };

    console.log(
      `[AUDIT][EligibilityAPI] Matched ${result.eligibleSchemes.length} schemes in ${result.processingTimeMs}ms`,
    );
    console.log(
      `[AUDIT][EligibilityAPI] Found ${arbitrage.length} arbitrage opportunities`,
    );
    console.log(
      `[AUDIT][BedrockClient] AI explanation generated in ${aiExplanation.latencyMs}ms (model: ${aiExplanation.model})`,
    );

    // Step 8: Send SMS notification via Amazon SNS
    const snsResult = await notifyEligibilityResult(
      profile.phone,
      profile.name,
      result.eligibleSchemes.length,
      totalBenefit,
    );
    console.log(
      `[AUDIT][SNS] SMS notification: ${snsResult.status} (msgId: ${snsResult.messageId})`,
    );

    // Step 9: Record audit trail
    await recordAuditEvent({
      eventId: `audit_${uuidv4().slice(0, 8)}`,
      citizenId,
      action: "eligibility_check",
      timestamp: new Date().toISOString(),
      details: {
        schemesMatched: result.eligibleSchemes.length,
        arbitrageFound: arbitrage.length,
        processingTimeMs: result.processingTimeMs,
        bedrockModel: aiExplanation.model,
        bedrockTokens: aiExplanation.tokens,
        bankVerified: bankInfo.verified,
        smsNotification: snsResult.status,
      },
      source: "eligibility",
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        maskedAadhaar: masked,
        citizenName: profile.name,
        shadowPreview: preview,
        eligibilityResult: result,
        arbitrage,
        bankVerification: {
          verified: bankInfo.verified,
          bankName: bankInfo.bankName,
          accountType: bankInfo.accountType,
          janDhanAccount: bankInfo.janDhanAccount,
        },
        aiExplanation: {
          content: aiExplanation.content,
          contentHindi: aiExplanation.contentHindi,
          model: aiExplanation.model,
          tokens: aiExplanation.tokens,
          latencyMs: aiExplanation.latencyMs,
        },
        smsNotification: {
          messageId: snsResult.messageId,
          status: snsResult.status,
        },
      }),
    };
  } catch (err: any) {
    console.error("[ERROR][EligibilityAPI]", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
