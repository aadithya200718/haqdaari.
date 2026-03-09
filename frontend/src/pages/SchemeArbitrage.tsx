import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { useStore } from "../store";
import { formatRupees } from "../utils";

export default function SchemeArbitrage() {
  const navigate = useNavigate();
  const { arbitrage, eligibilityResult, aiExplanation, language } = useStore();
  const hi = language === "hi";

  if (!eligibilityResult || arbitrage.length === 0) {
    return (
      <div className="px-4 pt-20 text-center">
        <p className="font-hindi text-txt-secondary">
          {hi
            ? "कोई बेहतर योजना विकल्प नहीं मिला"
            : "No better scheme options found"}
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

  const totalYearlySavings = arbitrage.reduce(
    (sum, a) => sum + a.yearlySavings,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-trust to-indigo-600 px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <div>
          <h1 className="font-hindi font-bold text-lg text-white">
            {hi ? "स्कीम आर्बिट्राज" : "Scheme Arbitrage"}
          </h1>
          <p className="text-white/80 text-xs">
            {hi ? "Scheme Arbitrage Detector" : ""}
          </p>
        </div>
      </div>

      {/* Total savings banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-success/10 to-emerald-100 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingUp size={20} className="text-success" />
          <p className="font-hindi text-sm text-txt-secondary">
            {hi ? "कुल अतिरिक्त वार्षिक लाभ" : "Total extra annual benefit"}
          </p>
        </div>
        <p className="text-success font-display font-black text-4xl">
          {formatRupees(totalYearlySavings)}
        </p>
        <p className="text-xs text-txt-muted mt-1">
          Extra annual benefits you're missing
        </p>
      </div>

      {/* AI recommendation */}
      {aiExplanation && (
        <div className="mx-4 mt-4 bg-brand/5 border border-brand/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-brand" />
            <span className="text-[10px] font-mono font-medium text-brand uppercase tracking-wider">
              Amazon Bedrock · {aiExplanation.model}
            </span>
          </div>
          <p className="font-hindi text-sm text-txt-primary leading-relaxed">
            {hi ? aiExplanation.contentHindi : aiExplanation.content}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-txt-muted">
            <span>
              {aiExplanation.tokens.input + aiExplanation.tokens.output} tokens
            </span>
            <span>{aiExplanation.latencyMs}ms</span>
          </div>
        </div>
      )}

      {/* Arbitrage cards */}
      <div className="px-4 mt-4 space-y-3">
        {arbitrage.map((opp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          >
            {/* Switch banner */}
            <div className="bg-gradient-to-r from-destructive/10 to-success/10 px-4 py-2 flex items-center gap-2">
              <span className="text-destructive text-xs font-semibold">
                {opp.currentScheme.schemeId === "NONE"
                  ? "Missing"
                  : opp.currentScheme.schemeName}
              </span>
              <ArrowRight size={14} className="text-txt-muted" />
              <span className="text-success text-xs font-semibold">
                {opp.betterScheme.schemeName}
              </span>
            </div>

            <div className="p-4">
              {/* Hindi reason */}
              <p className="font-hindi text-sm font-medium text-txt-primary leading-snug">
                {hi ? opp.reasonHindi : opp.reason}
              </p>
              <p className="text-xs text-txt-secondary mt-1">
                {hi ? opp.reason : opp.reasonHindi}
              </p>

              {/* Amount comparison */}
              <div className="flex items-center gap-4 mt-3">
                {opp.currentScheme.schemeId !== "NONE" && (
                  <div className="flex-1 bg-destructive/5 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-txt-muted">Current</p>
                    <p className="font-display font-bold text-destructive">
                      {formatRupees(opp.currentScheme.benefitAmount)}
                    </p>
                    <p className="text-[10px] text-txt-muted">
                      /{opp.currentScheme.frequency}
                    </p>
                  </div>
                )}
                <div className="flex-1 bg-success/5 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-txt-muted">Better</p>
                  <p className="font-display font-bold text-success">
                    {formatRupees(opp.betterScheme.benefitAmount)}
                  </p>
                  <p className="text-[10px] text-txt-muted">
                    /{opp.betterScheme.frequency}
                  </p>
                </div>
                <div className="flex-1 bg-brand/5 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-txt-muted">Extra</p>
                  <p className="font-display font-bold text-brand">
                    +{formatRupees(opp.monthlySavings)}
                  </p>
                  <p className="text-[10px] text-txt-muted">/month</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/apply/${opp.betterScheme.schemeId}`)}
                className="w-full mt-3 h-10 rounded-lg bg-success text-white font-display font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Switch Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
