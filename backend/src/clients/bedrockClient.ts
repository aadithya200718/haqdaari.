// Mock Bedrock client - swap with @aws-sdk/client-bedrock-runtime when ready

export interface BedrockResponse {
  model: string;
  content: string;
  contentHindi: string;
  tokens: { input: number; output: number };
  latencyMs: number;
}

export async function generateEligibilityExplanation(
  citizenName: string,
  schemeCount: number,
  totalBenefit: number,
): Promise<BedrockResponse> {
  const start = Date.now();
  return {
    model: "amazon.titan-text-premier-v2:0",
    content: `Based on your Aadhaar profile and DigiLocker documents, you are eligible for ${schemeCount} government schemes with total annual benefits of ₹${totalBenefit.toLocaleString("en-IN")}. Your profile matches criteria including age, income, occupation, and caste category across central and state schemes.`,
    contentHindi: `आपकी आधार प्रोफ़ाइल और डिजिलॉकर दस्तावेज़ों के आधार पर, आप ${schemeCount} सरकारी योजनाओं के लिए पात्र हैं। कुल वार्षिक लाभ ₹${totalBenefit.toLocaleString("en-IN")} है। आपकी आयु, आय, व्यवसाय और जाति श्रेणी केंद्रीय और राज्य योजनाओं से मेल खाती है।`,
    tokens: { input: 450, output: 180 },
    latencyMs: Date.now() - start,
  };
}

export async function generateArbitrageRecommendation(
  currentScheme: string,
  betterScheme: string,
  monthlySavings: number,
): Promise<BedrockResponse> {
  const start = Date.now();
  return {
    model: "amazon.titan-text-premier-v2:0",
    content: `I recommend switching from ${currentScheme} to ${betterScheme}. You will receive ₹${monthlySavings.toLocaleString("en-IN")} more per month. The eligibility criteria are similar, and I can auto-fill the application using your existing documents.`,
    contentHindi: `मेरी सिफारिश है कि ${currentScheme} से ${betterScheme} में बदलें। आपको हर महीने ₹${monthlySavings.toLocaleString("en-IN")} अधिक मिलेगा। पात्रता मानदंड समान हैं, और मैं आपके मौजूदा दस्तावेज़ों से आवेदन स्वतः भर सकता हूं।`,
    tokens: { input: 320, output: 150 },
    latencyMs: Date.now() - start,
  };
}

export async function generateFormFill(
  citizenName: string,
  schemeId: string,
): Promise<BedrockResponse> {
  const start = Date.now();
  return {
    model: "amazon.titan-text-premier-v2:0",
    content: `Auto-filled ${schemeId} application form for ${citizenName}. All mandatory fields populated from Aadhaar eKYC and DigiLocker. 5/5 fields filled. Form integrity: HIGH — no manual edits required.`,
    contentHindi: `${citizenName} के लिए ${schemeId} आवेदन फॉर्म स्वतः भरा गया। 5/5 अनिवार्य फ़ील्ड आधार eKYC और डिजिलॉकर से भरे गए। फॉर्म अखंडता: उच्च — मैन्युअल संपादन आवश्यक नहीं।`,
    tokens: { input: 280, output: 120 },
    latencyMs: Date.now() - start,
  };
}

export async function generateShadowPreview(
  citizenName: string,
  actions: string[],
): Promise<BedrockResponse> {
  const start = Date.now();
  const actionList = actions.map((a, i) => `${i + 1}. ${a}`).join("\n");
  const actionListHindi = actions.map((a, i) => `${i + 1}. ${a}`).join("\n");

  return {
    model: "amazon.titan-text-premier-v2:0",
    content: `Shadow Mode Preview for ${citizenName}:\n\nThe following actions will be performed ONLY after your approval:\n${actionList}\n\nNo data will be submitted without your explicit consent. You can approve, modify, or cancel any action.`,
    contentHindi: `${citizenName} के लिए शैडो मोड प्रीव्यू:\n\nनिम्नलिखित कार्य केवल आपकी मंज़ूरी के बाद किए जाएंगे:\n${actionListHindi}\n\nआपकी स्पष्ट सहमति के बिना कोई डेटा जमा नहीं होगा। आप किसी भी कार्य को स्वीकार, संशोधित या रद्द कर सकते हैं।`,
    tokens: { input: 350, output: 200 },
    latencyMs: Date.now() - start,
  };
}

export async function queryKnowledgeBase(
  query: string,
): Promise<BedrockResponse> {
  const start = Date.now();
  return {
    model: "amazon.titan-text-premier-v2:0",
    content: `Based on the HaqDaari Knowledge Base (750+ scheme rules):\n\nQuery: "${query}"\n\nFound 15 matching schemes in the knowledge base. The schemes are sourced from official government portals and verified against latest eligibility criteria. Rules are stored in Amazon S3 and indexed via Bedrock Knowledge Base for fast retrieval.`,
    contentHindi: `हकदारी नॉलेज बेस (750+ योजना नियम) के आधार पर:\n\nप्रश्न: "${query}"\n\n15 मिलती-जुलती योजनाएं मिलीं। योजनाएं सरकारी पोर्टलों से ली गई हैं और नवीनतम पात्रता मानदंडों के अनुसार सत्यापित हैं।`,
    tokens: { input: 500, output: 250 },
    latencyMs: Date.now() - start,
  };
}
