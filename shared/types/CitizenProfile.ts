export interface Address {
  readonly state: string;
  readonly district: string;
  readonly pincode: string;
}

export interface Document {
  readonly type:
    | "income_certificate"
    | "caste_certificate"
    | "land_record"
    | "aadhaar"
    | "bank_account"
    | "education";
  readonly value: string;
  readonly numericValue?: number;
  readonly verified: boolean;
  readonly fetchedAt: string;
}

export interface CitizenProfile {
  readonly citizenId: string;
  readonly name: string;
  readonly age: number;
  readonly gender: "male" | "female" | "other";
  readonly phone: string;
  readonly address: Address;
  readonly income: number;
  readonly caste: string;
  readonly occupation: string;
  readonly landOwnership: number | null;
  readonly documents: Document[];
}
