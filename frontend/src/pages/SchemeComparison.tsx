import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useStore } from "../store";
import { formatRupees } from "../utils";

export default function SchemeComparison() {
  const navigate = useNavigate();
  const { eligibilityResult, language } = useStore();
  const hi = language === "hi";

  const schemes = eligibilityResult?.eligibleSchemes?.slice(0, 3) ?? [];
  const totalBenefit = schemes.reduce((sum, s) => sum + s.benefit.amount, 0);

  if (schemes.length === 0) {
    return (
      <div className="px-4 pt-20 text-center">
        <p className="font-hindi text-txt-secondary">
          {hi
            ? "कोई योजना तुलना के लिए उपलब्ध नहीं"
            : "No schemes available for comparison"}
        </p>
        <button
          onClick={() => navigate("/eligibility")}
          className="mt-4 px-6 py-2 rounded-xl bg-success text-white font-display font-semibold"
        >
          Check Eligibility
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      <div className="bg-trust px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <div>
          <h1 className="font-hindi font-bold text-lg text-white">
            {hi ? "योजनाओं की तुलना" : "Compare Schemes"}
          </h1>
          <p className="text-white/80 text-xs">{hi ? "Compare Schemes" : ""}</p>
        </div>
      </div>

      {/* Total savings banner */}
      <div className="mx-4 mt-4 bg-success/10 rounded-2xl p-4 text-center">
        <p className="font-hindi text-sm text-txt-secondary">
          {hi ? "कुल अनुमानित बचत" : "Total estimated savings"}
        </p>
        <p className="text-success font-display font-bold text-3xl mt-1">
          {formatRupees(totalBenefit)}
        </p>
        <p className="text-xs text-txt-muted mt-0.5">
          per year across {schemes.length} schemes
        </p>
      </div>

      {/* Comparison table */}
      <div className="mx-4 mt-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-hindi font-medium text-txt-secondary">
                {hi ? "योजना" : "Scheme"}
              </th>
              {schemes.map((s) => (
                <th
                  key={s.schemeId}
                  className="text-center py-2 font-hindi font-medium text-trust px-2 max-w-[100px]"
                >
                  {hi ? s.schemeNameHindi : s.schemeName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2.5 font-hindi text-txt-secondary">
                {hi ? "लाभ राशि" : "Amount"}
              </td>
              {schemes.map((s) => (
                <td
                  key={s.schemeId}
                  className="py-2.5 text-center font-display font-bold text-success"
                >
                  {formatRupees(s.benefit.amount)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-hindi text-txt-secondary">
                {hi ? "लाभ प्रकार" : "Type"}
              </td>
              {schemes.map((s) => (
                <td
                  key={s.schemeId}
                  className="py-2.5 text-center text-txt-primary"
                >
                  {s.benefit.frequency}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-hindi text-txt-secondary">
                {hi ? "पात्रता स्कोर" : "Eligibility"}
              </td>
              {schemes.map((s) => (
                <td key={s.schemeId} className="py-2.5 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full font-display font-bold ${
                      s.eligibilityScore >= 0.9
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-amber-700"
                    }`}
                  >
                    {Math.round(s.eligibilityScore * 100)}%
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 font-hindi text-txt-secondary">
                {hi ? "लापता दस्तावेज़" : "Missing Docs"}
              </td>
              {schemes.map((s) => (
                <td key={s.schemeId} className="py-2.5 text-center">
                  {s.missingDocuments.length === 0 ? (
                    <span className="text-success">✓</span>
                  ) : (
                    <span className="text-destructive">
                      {s.missingDocuments.length}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Apply buttons */}
      <div className="px-4 mt-5 space-y-2">
        {schemes.map((s) => (
          <button
            key={s.schemeId}
            onClick={() => navigate(`/apply/${s.schemeId}`)}
            className="w-full flex items-center justify-between bg-white rounded-xl p-3 active:scale-[0.98] transition-transform"
          >
            <div>
              <p className="font-hindi font-medium text-sm">
                {hi ? s.schemeNameHindi : s.schemeName}
              </p>
              <p className="text-xs text-txt-secondary">{s.schemeName}</p>
            </div>
            <ChevronRight size={18} className="text-txt-muted" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
