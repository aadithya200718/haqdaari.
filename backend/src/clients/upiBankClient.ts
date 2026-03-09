// Mock UPI Bank Verify - swap with NPCI API when ready

export interface BankVerification {
  verified: boolean;
  accountName: string;
  bankName: string;
  ifsc: string;
  accountType: "SAVINGS" | "CURRENT" | "JAN_DHAN";
  upiId: string | null;
  janDhanAccount: boolean;
  latencyMs: number;
}

const MOCK_BANK_DATA: Record<string, BankVerification> = {
  default: {
    verified: true,
    accountName: "RAMESH KUMAR",
    bankName: "State Bank of India",
    ifsc: "SBIN0001234",
    accountType: "JAN_DHAN",
    upiId: "ramesh.kumar@sbi",
    janDhanAccount: true,
    latencyMs: 0,
  },
  "111122223333": {
    verified: true,
    accountName: "SUNITA DEVI",
    bankName: "Bank of Baroda",
    ifsc: "BARB0VARANA",
    accountType: "SAVINGS",
    upiId: "sunita.devi@bob",
    janDhanAccount: false,
    latencyMs: 0,
  },
  "444455556666": {
    verified: true,
    accountName: "ARJUN VISHWAKARMA",
    bankName: "Punjab National Bank",
    ifsc: "PUNB0123400",
    accountType: "JAN_DHAN",
    upiId: null,
    janDhanAccount: true,
    latencyMs: 0,
  },
  "222233334444": {
    verified: true,
    accountName: "LAKSHMI NARAYANAN",
    bankName: "Indian Bank",
    ifsc: "IDIB0001234",
    accountType: "SAVINGS",
    upiId: "lakshmi.n@indianbank",
    janDhanAccount: false,
    latencyMs: 0,
  },
  "333344445555": {
    verified: true,
    accountName: "PRIYA SHARMA",
    bankName: "HDFC Bank",
    ifsc: "HDFC0001234",
    accountType: "SAVINGS",
    upiId: "priya.sharma@hdfc",
    janDhanAccount: false,
    latencyMs: 0,
  },
  "555566667777": {
    verified: true,
    accountName: "BIJU MOHAN",
    bankName: "Federal Bank",
    ifsc: "FDRL0001234",
    accountType: "SAVINGS",
    upiId: "biju.mohan@federal",
    janDhanAccount: false,
    latencyMs: 0,
  },
  "666677778888": {
    verified: true,
    accountName: "MEENA KUMARI",
    bankName: "UCO Bank",
    ifsc: "UCBA0001234",
    accountType: "JAN_DHAN",
    upiId: null,
    janDhanAccount: true,
    latencyMs: 0,
  },
  "777788889999": {
    verified: true,
    accountName: "RAJENDRA PATIL",
    bankName: "Bank of Maharashtra",
    ifsc: "MAHB0001234",
    accountType: "SAVINGS",
    upiId: "rajendra.patil@bom",
    janDhanAccount: false,
    latencyMs: 0,
  },
  "888899990000": {
    verified: true,
    accountName: "KAVITA SINGH",
    bankName: "Bank of Baroda",
    ifsc: "BARB0AHMDBD",
    accountType: "JAN_DHAN",
    upiId: "kavita.singh@bob",
    janDhanAccount: true,
    latencyMs: 0,
  },
  "999900001111": {
    verified: true,
    accountName: "MAHENDRA ORAON",
    bankName: "State Bank of India",
    ifsc: "SBIN0005678",
    accountType: "SAVINGS",
    upiId: "mahendra.oraon@sbi",
    janDhanAccount: false,
    latencyMs: 0,
  },
};

export async function verifyBankAccount(
  aadhaarNumber: string,
): Promise<BankVerification> {
  const start = Date.now();
  const clean = aadhaarNumber.replace(/\s|-/g, "");

  const data = MOCK_BANK_DATA[clean] ?? MOCK_BANK_DATA["default"];
  if (!data) {
    return {
      verified: false,
      accountName: "",
      bankName: "",
      ifsc: "",
      accountType: "SAVINGS",
      upiId: null,
      janDhanAccount: false,
      latencyMs: Date.now() - start,
    };
  }

  return { ...data, latencyMs: Date.now() - start };
}
