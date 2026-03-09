import { formatRupees } from "../utils";
import { motion } from "framer-motion";
import { useStore } from "../store";

interface SchemeCardProps {
  schemeName: string;
  schemeNameHindi: string;
  benefit: { amount: number; frequency: string; description: string };
  eligibilityScore: number;
  missingDocuments: string[];
  index: number;
  onApply?: () => void;
}

function scoreColor(score: number) {
  if (score >= 0.9) return "text-success border-success";
  if (score >= 0.7) return "text-warning border-warning";
  return "text-txt-muted border-gray-300";
}

export default function SchemeCard({
  schemeName,
  schemeNameHindi,
  benefit,
  eligibilityScore,
  missingDocuments,
  index,
  onApply,
}: SchemeCardProps) {
  const { language } = useStore();
  const hi = language === "hi";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-hindi font-semibold text-base text-txt-primary leading-snug">
            {hi ? schemeNameHindi : schemeName}
          </h3>
          <p className="text-xs text-txt-secondary mt-0.5 truncate">
            {hi ? schemeName : schemeNameHindi}
          </p>
        </div>
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full border-[3px] flex items-center justify-center font-display font-bold text-sm ${scoreColor(eligibilityScore)}`}
        >
          {Math.round(eligibilityScore * 100)}%
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <span className="text-success font-display font-bold text-xl font-tabular">
            {benefit.amount > 0 ? formatRupees(benefit.amount) : "Free"}
          </span>
          <span className="text-xs text-txt-secondary ml-1">
            /{benefit.frequency}
          </span>
        </div>
        {onApply && (
          <button
            onClick={onApply}
            className="text-trust font-display font-semibold text-sm min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-95 transition-transform"
          >
            Apply
          </button>
        )}
      </div>

      {missingDocuments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {missingDocuments.map((doc) => (
            <span
              key={doc}
              className="text-[11px] px-2 py-0.5 rounded-full bg-warning/20 text-amber-700 font-medium"
            >
              {doc.replace(/_/g, " ")} missing
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
