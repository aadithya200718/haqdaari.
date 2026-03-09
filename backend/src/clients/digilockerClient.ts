// Mock DigiLocker — swap with OAuth API when ready

interface DigiLockerDocument {
  type: "income_certificate" | "caste_certificate" | "land_record";
  value: string;
  numericValue?: number;
  verified: boolean;
  fetchedAt: string;
}

const MOCK_DOCUMENTS: Record<string, DigiLockerDocument[]> = {
  default: [
    {
      type: "income_certificate",
      value: "Annual income Rs 72,000",
      numericValue: 72000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "OBC",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "land_record",
      value: "0.5 hectare",
      numericValue: 0.5,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "111122223333": [
    {
      type: "income_certificate",
      value: "Annual income Rs 48,000",
      numericValue: 48000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "SC",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "444455556666": [
    {
      type: "income_certificate",
      value: "Annual income Rs 96,000",
      numericValue: 96000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "OBC",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "222233334444": [
    {
      type: "income_certificate",
      value: "Annual income Rs 60,000",
      numericValue: 60000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "SC",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "333344445555": [
    {
      type: "income_certificate",
      value: "Annual income Rs 1,50,000",
      numericValue: 150000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "General",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "555566667777": [
    {
      type: "income_certificate",
      value: "Annual income Rs 84,000",
      numericValue: 84000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "OBC",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "land_record",
      value: "1.2 hectare",
      numericValue: 1.2,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "666677778888": [
    {
      type: "income_certificate",
      value: "Annual income Rs 36,000",
      numericValue: 36000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "ST",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "land_record",
      value: "0.3 hectare",
      numericValue: 0.3,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "777788889999": [
    {
      type: "income_certificate",
      value: "Annual income Rs 5,00,000",
      numericValue: 500000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "General",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "land_record",
      value: "2.0 hectare",
      numericValue: 2.0,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "888899990000": [
    {
      type: "income_certificate",
      value: "Annual income Rs 1,20,000",
      numericValue: 120000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "OBC",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
  "999900001111": [
    {
      type: "income_certificate",
      value: "Annual income Rs 10,00,000",
      numericValue: 1000000,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "caste_certificate",
      value: "ST",
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
    {
      type: "land_record",
      value: "4.0 hectare",
      numericValue: 4.0,
      verified: true,
      fetchedAt: new Date().toISOString(),
    },
  ],
};

export async function fetchDocuments(
  citizenId: string,
): Promise<DigiLockerDocument[]> {
  const docs = MOCK_DOCUMENTS[citizenId] ?? MOCK_DOCUMENTS["default"];
  return docs;
}
