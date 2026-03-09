// In production: Use the API Gateway endpoint from Terraform output
// In development: Vite proxies /api to localhost:3001
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function checkEligibility(aadhaarNumber: string) {
  const res = await fetch(`${API_BASE}/eligibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aadhaarNumber }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export async function submitApplication(data: {
  citizenId: string;
  schemeId: string;
  schemeName: string;
}) {
  const res = await fetch(`${API_BASE}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Application submission failed");
  return res.json();
}

export async function getApplications(citizenId?: string) {
  const url = citizenId
    ? `${API_BASE}/applications?citizenId=${citizenId}`
    : `${API_BASE}/applications`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function transcribeAudio(audioContext: string = "default") {
  const res = await fetch(`${API_BASE}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioContext }),
  });
  if (!res.ok) throw new Error("Transcription failed");
  return res.json();
}

export async function getAuditTrail() {
  const res = await fetch(`${API_BASE}/audit`);
  if (!res.ok) throw new Error("Failed to fetch audit trail");
  return res.json();
}
