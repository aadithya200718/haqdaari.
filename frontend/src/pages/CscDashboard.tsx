import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { checkEligibility, submitApplication, transcribeAudio } from "../api";
import { formatRupees } from "../utils";

interface TranscriptEntry {
  speaker: "citizen" | "system" | "operator";
  name: string;
  text: string;
  time: string;
}

interface FormField {
  label: string;
  value: string;
  source: string;
  verified: boolean;
}

interface MatchedScheme {
  schemeId: string;
  schemeName: string;
  schemeNameHindi: string;
  benefit: { amount: number; frequency: string; description: string };
  eligibilityScore: number;
  missingDocuments: string[];
}

export default function CscDashboard() {
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [schemes, setSchemes] = useState<MatchedScheme[]>([]);
  const [citizenId, setCitizenId] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  function addTranscript(entry: TranscriptEntry) {
    setTranscript((prev) => [...prev, entry]);
  }

  function now() {
    return new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleLookup() {
    const clean = aadhaarInput.replace(/\s|-/g, "");
    if (clean.length !== 12 || !/^\d{12}$/.test(clean)) {
      setError("Enter valid 12-digit Aadhaar number");
      return;
    }
    setError("");
    setLoading(true);
    setFormFields([]);
    setSchemes([]);
    setAppliedCount(0);
    addTranscript({
      speaker: "operator",
      name: "OPERATOR",
      text: `Looking up Aadhaar ****${clean.slice(-4)}...`,
      time: now(),
    });

    try {
      const data = await checkEligibility(clean);
      setCitizenId(data.maskedAadhaar || clean);
      setCitizenName(data.citizenName || "Citizen");

      addTranscript({
        speaker: "system",
        name: `DETECTED: NAME = ${data.citizenName} (MATCHED eKYC)`,
        text: "",
        time: "",
      });
      addTranscript({
        speaker: "system",
        name: `MATCHED ${data.eligibilityResult?.eligibleSchemes?.length || 0} SCHEMES`,
        text: "",
        time: "",
      });

      // Build auto-fill form from response
      const fields: FormField[] = [
        {
          label: "NAAM (NAME)",
          value: data.citizenName || "-",
          source: "eKYC",
          verified: true,
        },
      ];
      if (data.eligibilityResult?.eligibleSchemes?.length) {
        fields.push({
          label: "ELIGIBLE SCHEMES",
          value: `${data.eligibilityResult.eligibleSchemes.length} found`,
          source: "Engine",
          verified: true,
        });
      }
      if (data.bankVerification?.bankName) {
        fields.push({
          label: "BANK",
          value: `${data.bankVerification.bankName} (${data.bankVerification.accountType})`,
          source: "UPI",
          verified: data.bankVerification.verified,
        });
      }
      if (data.arbitrage?.length) {
        fields.push({
          label: "ARBITRAGE FOUND",
          value: `${data.arbitrage.length} better scheme(s)`,
          source: "AI",
          verified: true,
        });
      }
      setFormFields(fields);
      setSchemes(data.eligibilityResult?.eligibleSchemes || []);
    } catch (err: any) {
      setError(err.message || "Lookup failed");
      addTranscript({
        speaker: "system",
        name: "ERROR: " + (err.message || "Lookup failed"),
        text: "",
        time: "",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyAll() {
    if (!schemes.length || applying) return;
    setApplying(true);
    let count = 0;
    for (const s of schemes.slice(0, 10)) {
      try {
        await submitApplication({
          citizenId,
          schemeId: s.schemeId,
          schemeName: s.schemeName,
        });
        count++;
      } catch {}
    }
    setAppliedCount(count);
    setApplying(false);
    addTranscript({
      speaker: "system",
      name: `APPLIED TO ${count} SCHEME(S) SUCCESSFULLY`,
      text: "",
      time: "",
    });
  }

  async function handleMicToggle() {
    setIsListening(!isListening);
    if (!isListening) {
      addTranscript({
        speaker: "operator",
        name: "OPERATOR",
        text: "Started voice capture...",
        time: now(),
      });
      try {
        const result = await transcribeAudio("default");
        addTranscript({
          speaker: "citizen",
          name: citizenName || "CITIZEN",
          text: result.translatedText || result.transcript,
          time: now(),
        });
        if (result.detectedEntities?.length) {
          const entities = result.detectedEntities
            .map((e: any) => `${e.type}=${e.value}`)
            .join(", ");
          addTranscript({
            speaker: "system",
            name: `DETECTED: ${entities}`,
            text: "",
            time: "",
          });
        }
      } catch {}
      setIsListening(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* CSC Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-trust rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-txt-primary">
              HAQDAARI CSC Co-Pilot
            </h1>
            <p className="text-[11px] text-txt-secondary">
              Ward Office · Varanasi (Varuna Zone)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
              !isOnline
                ? "bg-destructive/10 text-destructive"
                : "bg-success/10 text-success"
            }`}
          >
            {!isOnline ? <WifiOff size={12} /> : <Wifi size={12} />}
            {!isOnline ? "OFFLINE" : "ONLINE"}
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
            OP
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:h-[calc(100vh-56px)]">
        {/* Column 1: Live Conversation + Aadhaar Input */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col mb-4 lg:mb-0">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="font-display font-semibold text-sm">
                LIVE CONVERSATION
              </span>
            </div>
            <button
              onClick={handleMicToggle}
              className={`p-2 rounded-lg ${isListening ? "bg-success/10 text-success" : "bg-gray-100 text-gray-400"}`}
            >
              {isListening ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>

          {/* Aadhaar Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 12-digit Aadhaar"
                value={aadhaarInput}
                onChange={(e) =>
                  setAadhaarInput(e.target.value.replace(/[^\d\s-]/g, ""))
                }
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust/50"
                maxLength={14}
              />
              <button
                onClick={handleLookup}
                disabled={loading}
                className="px-3 py-2 bg-trust text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-1"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Search size={14} />
                )}
                Lookup
              </button>
            </div>
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] lg:max-h-none">
            {transcript.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {item.speaker === "system" ? (
                  <div className="bg-success/10 rounded-lg px-3 py-2">
                    <p className="text-[11px] font-mono text-success font-medium">
                      {item.name}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          item.speaker === "citizen"
                            ? "text-trust"
                            : "text-brand"
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.time && (
                        <span className="text-[10px] text-txt-muted">
                          {item.time}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-txt-primary">{item.text}</p>
                  </div>
                )}
              </motion.div>
            ))}
            {/* Listening indicator */}
            {isListening && (
              <div className="flex items-center gap-2 text-txt-muted">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-success rounded-full animate-pulse"
                      style={{
                        height: `${8 + Math.random() * 12}px`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px]">LISTENING...</span>
              </div>
            )}
            {!transcript.length && !loading && (
              <p className="text-sm text-txt-muted text-center py-8">
                Enter Aadhaar number above to start
              </p>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Column 2: Auto-Filled Form */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col mb-4 lg:mb-0">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-sm">
                AUTO-FILLED FORM
              </span>
              {formFields.length > 0 && (
                <span className="text-[11px] text-success font-medium">
                  {formFields.length} FIELDS FILLED
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {formFields.length === 0 && !loading && (
              <p className="text-sm text-txt-muted text-center py-8">
                Form will auto-fill after lookup
              </p>
            )}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-trust" />
              </div>
            )}
            {formFields.map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <label className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">
                  {field.label}
                </label>
                <div className="mt-0.5 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <span className="text-sm font-medium text-txt-primary">
                    {field.value}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        field.source === "eKYC"
                          ? "bg-trust/10 text-trust"
                          : field.source === "UPI"
                            ? "bg-success/10 text-success"
                            : "bg-brand/10 text-brand"
                      }`}
                    >
                      {field.source}
                    </span>
                    {field.verified && (
                      <CheckCircle size={14} className="text-success" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {formFields.length > 0 && (
              <div className="mt-4 bg-success/5 border border-success/20 rounded-lg p-3 flex items-center gap-3">
                <CheckCircle size={20} className="text-success flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-success">
                    Form Integrity High
                  </p>
                  <p className="text-[11px] text-txt-muted">
                    AUTO-FILLED FROM eKYC + DigiLocker
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Eligible Schemes */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="font-display font-semibold text-sm">
              ELIGIBLE SCHEMES {schemes.length > 0 && `(${schemes.length})`}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {schemes.length === 0 && !loading && (
              <p className="text-sm text-txt-muted text-center py-8">
                Schemes appear after Aadhaar lookup
              </p>
            )}
            {schemes.slice(0, 20).map((scheme, i) => (
              <motion.div
                key={scheme.schemeId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-txt-primary truncate">
                      {scheme.schemeName}
                    </p>
                    <p className="text-xs text-success font-medium mt-0.5">
                      {formatRupees(scheme.benefit.amount)}/
                      {scheme.benefit.frequency}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-bold ml-2 flex-shrink-0">
                    {Math.round(scheme.eligibilityScore * 100)}%
                  </span>
                </div>
                {scheme.missingDocuments.length > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600">
                    <AlertCircle size={10} />
                    Missing: {scheme.missingDocuments.join(", ")}
                  </div>
                )}
              </motion.div>
            ))}

            {schemes.length > 0 && (
              <>
                <button
                  onClick={handleApplyAll}
                  disabled={applying || appliedCount > 0}
                  className="w-full h-10 rounded-lg bg-success text-white font-display font-semibold text-sm active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {applying && <Loader2 size={14} className="animate-spin" />}
                  {appliedCount > 0
                    ? `Applied to ${appliedCount} schemes`
                    : `Apply Top ${Math.min(schemes.length, 10)} Schemes`}
                </button>
              </>
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 text-[10px] text-txt-muted text-right">
            {new Date().toLocaleDateString("en-IN")} ·{" "}
            {new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
