import { motion } from "framer-motion";
import { useStore } from "../store";

interface Props {
  actions: { description: string; descriptionHindi: string }[];
  onApprove: () => void;
  onCancel: () => void;
}

export default function ShadowModal({ actions, onApprove, onCancel }: Props) {
  const { language } = useStore();
  const hi = language === "hi";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
    >
      <motion.div
        initial={{ y: 40, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand to-amber-400 px-5 py-4">
          <h2 className="text-white font-display font-semibold text-lg">
            <span className="font-hindi">
              {hi ? "कार्य पूर्वावलोकन" : "Action Preview"}
            </span>
          </h2>
          <p className="text-white/90 text-sm">{hi ? "Action Preview" : ""}</p>
        </div>

        {/* Action list */}
        <div className="px-5 py-4 space-y-3">
          {actions.map((action, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-semibold text-txt-primary">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-hindi font-medium text-txt-primary">
                  {hi ? action.descriptionHindi : action.description}
                </p>
                <p className="text-xs text-txt-secondary">
                  {hi ? action.description : action.descriptionHindi}
                </p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <div className="mx-5 mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-hindi text-trust">
            {hi
              ? "यह डेटा केवल पात्रता जांच के लिए उपयोग होगा। 48 घंटे में डिलीट हो जाएगा।"
              : "This data will only be used for eligibility check. Will be deleted in 48 hours."}
          </p>
          <p className="text-[11px] text-txt-muted mt-0.5">
            This data will only be used for eligibility check. Will be deleted
            in 48 hours.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-5 pb-4">
          <button
            onClick={onApprove}
            className="flex-1 h-[52px] rounded-xl bg-success text-white font-display font-semibold text-sm active:scale-95 transition-transform"
          >
            <span className="font-hindi">{hi ? "स्वीकृति" : "Approve"}</span>
            <span className="block text-[11px] font-normal opacity-80">
              {hi ? "Approve" : ""}
            </span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 h-[52px] rounded-xl bg-destructive text-white font-display font-semibold text-sm active:scale-95 transition-transform"
          >
            <span className="font-hindi">{hi ? "रद्द करें" : "Cancel"}</span>
            <span className="block text-[11px] font-normal opacity-80">
              {hi ? "Cancel" : ""}
            </span>
          </button>
        </div>

        {/* Audit footer */}
        <div className="px-5 pb-3">
          <p className="text-[10px] text-txt-muted text-center font-hindi">
            {hi
              ? "हर कार्य ऑडिट लॉग में रिकॉर्ड होगा"
              : "Every action will be recorded in audit log"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
