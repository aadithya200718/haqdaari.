import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Loader2 } from "lucide-react";
import { useStore } from "../store";
import { checkEligibility } from "../api";
import ShadowModal from "../components/ShadowModal";

export default function EligibilityCheck() {
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const {
    loading,
    setLoading,
    shadowPreview,
    setApiResult,
    setShadowApproved,
    language,
  } = useStore();
  const [showShadow, setShowShadow] = useState(false);
  const navigate = useNavigate();
  const hi = language === "hi";

  const handleSubmit = async () => {
    const clean = aadhaar.replace(/\s|-/g, "");
    if (!/^\d{12}$/.test(clean)) {
      setError(
        hi
          ? "कृपया 12 अंकों का आधार नंबर दर्ज करें"
          : "Please enter a 12-digit Aadhaar number",
      );
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await checkEligibility(clean);
      setApiResult(data);
      setShowShadow(true);
    } catch (err: any) {
      setError(err.message || (hi ? "कुछ गलत हो गया" : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    setShadowApproved(true);
    setShowShadow(false);
    navigate("/results");
  };

  const handleCancel = () => {
    setShowShadow(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-6 pb-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-hindi font-bold text-2xl text-txt-primary">
          {hi ? "पात्रता जांचें" : "Check Eligibility"}
        </h1>
        <p className="text-sm text-txt-secondary mt-1">
          {hi
            ? "15+ सरकारी योजनाओं के लिए पात्रता जांचें"
            : "Check your eligibility for 15+ government schemes"}
        </p>
      </div>

      {/* Aadhaar input card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-trust/10 flex items-center justify-center">
            <Fingerprint size={24} className="text-trust" />
          </div>
          <div>
            <p className="font-hindi font-semibold text-base">
              {hi ? "आधार नंबर दर्ज करें" : "Enter Aadhaar Number"}
            </p>
            <p className="text-xs text-txt-secondary">
              {hi
                ? "Enter your 12-digit Aadhaar number"
                : "Enter your 12-digit Aadhaar number"}
            </p>
          </div>
        </div>

        <input
          type="text"
          maxLength={14}
          placeholder="XXXX XXXX XXXX"
          value={aadhaar}
          onChange={(e) => {
            const val = e.target.value.replace(/[^\d\s]/g, "");
            setAadhaar(val);
            setError("");
          }}
          className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 font-mono text-xl tracking-[0.25em] text-center focus:outline-none focus:border-trust transition-colors"
        />

        {error && (
          <p className="text-destructive text-xs font-hindi mt-2">{error}</p>
        )}

        {/* Consent notice */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-hindi text-trust leading-relaxed">
            {hi
              ? "आपकी सहमति से ही आधार eKYC और डिजिलॉकर से डेटा प्राप्त किया जाएगा। आपका डेटा एन्क्रिप्टेड रहेगा।"
              : "Data will be fetched from Aadhaar eKYC and DigiLocker only with your consent. Your data stays encrypted."}
          </p>
          <p className="text-[11px] text-txt-muted mt-1">
            {hi
              ? "Data will be fetched from Aadhaar eKYC and DigiLocker only with your consent. Your data stays encrypted."
              : ""}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || aadhaar.replace(/\s/g, "").length < 12}
          className="w-full h-14 mt-4 rounded-xl bg-success text-white font-display font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="font-hindi">
                {hi ? "जांच हो रही है..." : "Checking..."}
              </span>
            </>
          ) : (
            <span className="font-hindi">
              {hi ? "पात्रता जांचें" : "Check Eligibility"}
            </span>
          )}
        </button>

        <p className="text-center text-[10px] text-txt-muted mt-3">
          256-bit encrypted. MeitY guidelines compliant.
        </p>
      </div>

      {/* Available test numbers */}
      <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-txt-secondary mb-2 uppercase tracking-wide">
          Demo Aadhaar Numbers
        </p>
        {[
          { num: "999988887777", name: "Ramesh Kumar (Default - Farmer, UP)" },
          { num: "111122223333", name: "Sunita Devi (Female, Bihar, SC)" },
          { num: "444455556666", name: "Arjun Vishwakarma (Male, MP, OBC)" },
        ].map(({ num, name }) => (
          <button
            key={num}
            onClick={() => setAadhaar(num)}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-mono text-sm text-trust">{num}</span>
            <span className="text-xs text-txt-secondary block">{name}</span>
          </button>
        ))}
      </div>

      {/* Shadow Mode Modal */}
      <AnimatePresence>
        {showShadow && shadowPreview && (
          <ShadowModal
            actions={shadowPreview.actions}
            onApprove={handleApprove}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
