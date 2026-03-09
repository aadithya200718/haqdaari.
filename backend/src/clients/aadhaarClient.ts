// Mock Aadhaar eKYC — swap with UIDAI API when ready

interface AadhaarDemographics {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  occupation: string;
  phone: string;
  address: {
    state: string;
    district: string;
    pincode: string;
  };
}

const MOCK_PROFILES: Record<string, AadhaarDemographics> = {
  default: {
    name: "Ramesh Kumar",
    age: 45,
    gender: "male",
    occupation: "farmer",
    phone: "+919876543210",
    address: { state: "Uttar Pradesh", district: "Lucknow", pincode: "226001" },
  },
  "111122223333": {
    name: "Sunita Devi",
    age: 32,
    gender: "female",
    occupation: "daily_wage",
    phone: "+919123456789",
    address: { state: "Bihar", district: "Patna", pincode: "800001" },
  },
  "444455556666": {
    name: "Arjun Vishwakarma",
    age: 28,
    gender: "male",
    occupation: "artisan",
    phone: "+919988776655",
    address: { state: "Madhya Pradesh", district: "Bhopal", pincode: "462001" },
  },
  "222233334444": {
    name: "Lakshmi Narayanan",
    age: 55,
    gender: "male",
    occupation: "fisherman",
    phone: "+919445566778",
    address: { state: "Tamil Nadu", district: "Chennai", pincode: "600001" },
  },
  "333344445555": {
    name: "Priya Sharma",
    age: 24,
    gender: "female",
    occupation: "self_employed",
    phone: "+919334455667",
    address: { state: "Rajasthan", district: "Jaipur", pincode: "302001" },
  },
  "555566667777": {
    name: "Biju Mohan",
    age: 62,
    gender: "male",
    occupation: "farmer",
    phone: "+919556677889",
    address: { state: "Kerala", district: "Ernakulam", pincode: "682001" },
  },
  "666677778888": {
    name: "Meena Kumari",
    age: 40,
    gender: "female",
    occupation: "weaver",
    phone: "+919667788990",
    address: { state: "Odisha", district: "Cuttack", pincode: "753001" },
  },
  "777788889999": {
    name: "Rajendra Patil",
    age: 35,
    gender: "male",
    occupation: "farmer",
    phone: "+919778899001",
    address: { state: "Maharashtra", district: "Pune", pincode: "411001" },
  },
  "888899990000": {
    name: "Kavita Singh",
    age: 29,
    gender: "female",
    occupation: "street_vendor",
    phone: "+919889900112",
    address: { state: "Gujarat", district: "Ahmedabad", pincode: "380001" },
  },
  "999900001111": {
    name: "Mahendra Oraon",
    age: 50,
    gender: "male",
    occupation: "farmer",
    phone: "+919990011223",
    address: { state: "Jharkhand", district: "Ranchi", pincode: "834001" },
  },
};

export async function fetchDemographics(
  aadhaarNumber: string,
): Promise<AadhaarDemographics> {
  const clean = aadhaarNumber.replace(/\s|-/g, "");
  const profile = MOCK_PROFILES[clean] ?? MOCK_PROFILES["default"];

  return profile;
}
