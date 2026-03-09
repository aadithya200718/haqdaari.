// Mock Transcribe client - swap with @aws-sdk/client-transcribe-streaming when ready

export interface TranscribeResult {
  transcript: string;
  translatedText: string;
  language: string;
  confidence: number;
  latencyMs: number;
  detectedEntities: DetectedEntity[];
}

export interface DetectedEntity {
  type: "NAME" | "AADHAAR" | "PHONE" | "LOCATION" | "AMOUNT" | "SCHEME";
  value: string;
  confidence: number;
}

const MOCK_TRANSCRIPTIONS: Record<string, TranscribeResult> = {
  default: {
    transcript:
      "नमस्ते, मैं सुनीता देवी हूं। मेरा आधार नंबर है बारह अंक का। मुझे योजनाओं के बारे में जानना है।",
    translatedText:
      "Hello, I am Sunita Devi. My Aadhaar number is twelve digits. I want to know about schemes.",
    language: "hi-IN",
    confidence: 0.94,
    latencyMs: 0,
    detectedEntities: [
      { type: "NAME", value: "Sunita Devi", confidence: 0.97 },
      { type: "SCHEME", value: "government schemes", confidence: 0.85 },
    ],
  },
  children: {
    transcript: "मेरे तीन बच्चे हैं - दो बेटियां और एक बेटा।",
    translatedText: "I have three children - two daughters and one son.",
    language: "hi-IN",
    confidence: 0.96,
    latencyMs: 0,
    detectedEntities: [
      { type: "AMOUNT", value: "3 children", confidence: 0.98 },
    ],
  },
  income: {
    transcript: "मेरी सालाना आमदनी अड़तालीस हज़ार रुपये है। मैं खेती करती हूं।",
    translatedText:
      "My annual income is forty-eight thousand rupees. I do farming.",
    language: "hi-IN",
    confidence: 0.92,
    latencyMs: 0,
    detectedEntities: [
      { type: "AMOUNT", value: "₹48,000/year", confidence: 0.95 },
    ],
  },
};

export async function transcribeAudio(
  audioContext: string = "default",
): Promise<TranscribeResult> {
  const start = Date.now();
  const result =
    MOCK_TRANSCRIPTIONS[audioContext] || MOCK_TRANSCRIPTIONS.default;
  return {
    ...result,
    latencyMs: Date.now() - start,
  };
}
