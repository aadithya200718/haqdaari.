import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../store";
import { formatRupees } from "../utils";
import SchemeCard from "../components/SchemeCard";

const CATEGORIES = [
  "All",
  "Agriculture",
  "Health",
  "Housing",
  "Employment",
  "Pension",
];

export default function Results() {
  const navigate = useNavigate();
  const { eligibilityResult, shadowApproved, language } = useStore();
  const hi = language === "hi";

  if (!eligibilityResult || !shadowApproved) {
    return (
      <div className="px-4 pt-20 text-center">
        <p className="font-hindi text-txt-secondary">
          {hi ? "कृपया पहले पात्रता जांचें" : "Please check eligibility first"}
        </p>
        <button
          onClick={() => navigate("/eligibility")}
          className="mt-4 px-6 py-2 rounded-xl bg-success text-white font-display font-semibold active:scale-95 transition-transform"
        >
          Check Eligibility
        </button>
      </div>
    );
  }

  const schemes = eligibilityResult.eligibleSchemes;
  const totalBenefit = schemes.reduce((sum, s) => sum + s.benefit.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      {/* Header */}
      <div className="bg-brand px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <div>
          <h1 className="font-hindi font-bold text-lg text-white">
            {hi ? "पात्र योजनाएं" : "Eligible Schemes"}
          </h1>
          <p className="text-white/80 text-xs">
            {hi ? "Eligible Schemes" : ""}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mx-4 -mt-0 mb-4 mt-4 bg-success/10 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-4xl font-display font-bold text-success">
              {schemes.length}
            </span>
            <p className="text-xs font-hindi text-txt-secondary mt-0.5">
              {hi ? "योजनाएं" : "schemes"}
            </p>
          </div>
          <div className="flex-1">
            <p className="font-hindi font-medium text-sm text-txt-primary">
              {hi ? "आपके लिए उपलब्ध योजनाएं" : "Schemes available for you"}
            </p>
            <p className="text-success font-display font-bold text-lg mt-0.5">
              {formatRupees(totalBenefit)}/year
            </p>
            <p className="text-[11px] text-txt-secondary">
              {hi
                ? "कुल अनुमानित वार्षिक लाभ"
                : "Total estimated annual benefit"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 -mx-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-medium bg-white border border-gray-200 text-txt-secondary whitespace-nowrap active:scale-95 transition-transform first:bg-brand first:text-white first:border-brand"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scheme list */}
      <div className="px-4 space-y-3">
        {schemes.map((scheme, i) => (
          <SchemeCard
            key={scheme.schemeId}
            schemeName={scheme.schemeName}
            schemeNameHindi={scheme.schemeNameHindi}
            benefit={scheme.benefit}
            eligibilityScore={scheme.eligibilityScore}
            missingDocuments={scheme.missingDocuments}
            index={i}
            onApply={() => navigate(`/apply/${scheme.schemeId}`)}
          />
        ))}
      </div>

      {/* Processing time */}
      <p className="text-center text-[10px] text-txt-muted mt-4 px-4">
        {hi
          ? `${eligibilityResult.processingTimeMs}ms में प्रोसेस किया गया`
          : `Processed in ${eligibilityResult.processingTimeMs}ms`}
      </p>
    </motion.div>
  );
}
