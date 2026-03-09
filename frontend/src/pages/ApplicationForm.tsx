import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Circle, Upload } from "lucide-react";
import { useStore } from "../store";

const documentChecklist = [
  {
    id: "aadhaar",
    label: "आधार कार्ड",
    labelEn: "Aadhaar Card",
    uploaded: true,
  },
  {
    id: "income",
    label: "आय प्रमाणपत्र",
    labelEn: "Income Certificate",
    uploaded: true,
  },
  {
    id: "caste",
    label: "जाति प्रमाणपत्र",
    labelEn: "Caste Certificate",
    uploaded: true,
  },
  {
    id: "bank",
    label: "बैंक पासबुक",
    labelEn: "Bank Passbook",
    uploaded: false,
  },
  {
    id: "photo",
    label: "पासपोर्ट फोटो",
    labelEn: "Passport Photo",
    uploaded: false,
  },
];

export default function ApplicationForm() {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  const { eligibilityResult, language } = useStore();
  const hi = language === "hi";

  const scheme = eligibilityResult?.eligibleSchemes.find(
    (s) => s.schemeId === schemeId,
  );
  const uploaded = documentChecklist.filter((d) => d.uploaded).length;
  const progress = (uploaded / documentChecklist.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      {/* Header */}
      <div className="bg-success px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-hindi font-bold text-lg text-white">
            {scheme
              ? hi
                ? scheme.schemeNameHindi
                : scheme.schemeName
              : hi
                ? "योजना में आवेदन"
                : "Apply for Scheme"}
          </h1>
          <p className="text-white/80 text-xs">
            {scheme
              ? hi
                ? scheme.schemeName
                : scheme.schemeNameHindi
              : hi
                ? "Application Form"
                : ""}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-hindi text-txt-secondary">
            {hi ? "प्रगति" : "Progress"}
          </p>
          <p className="text-xs font-display font-bold text-success">
            {Math.round(progress)}%
          </p>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Auto-filled form */}
      <div className="px-4 mt-5">
        <h2 className="font-hindi font-semibold text-sm mb-3">
          {hi
            ? "व्यक्तिगत विवरण (Auto-filled)"
            : "Personal Details (Auto-filled)"}
        </h2>
        <div className="bg-white rounded-2xl p-4 space-y-4">
          {[
            { label: "नाम / Name", value: "रमेश कुमार" },
            { label: "आयु / Age", value: "45" },
            { label: "लिंग / Gender", value: "पुरुष (Male)" },
            { label: "राज्य / State", value: "Uttar Pradesh" },
            { label: "जिला / District", value: "Lucknow" },
            { label: "वार्षिक आय / Annual Income", value: "₹ 72,000" },
            { label: "जाति / Caste", value: "OBC" },
            { label: "व्यवसाय / Occupation", value: "किसान (Farmer)" },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-[11px] font-hindi text-txt-muted mb-0.5">
                {label}
              </label>
              <div className="h-10 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-txt-primary font-hindi">
                {value}
                <CheckCircle size={14} className="ml-auto text-success" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document checklist */}
      <div className="px-4 mt-5">
        <h2 className="font-hindi font-semibold text-sm mb-3">
          {hi ? "दस्तावेज़ चेकलिस्ट" : "Document Checklist"}
        </h2>
        <div className="space-y-2">
          {documentChecklist.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3"
            >
              {doc.uploaded ? (
                <CheckCircle size={20} className="text-success flex-shrink-0" />
              ) : (
                <Circle size={20} className="text-gray-300 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-hindi text-sm font-medium text-txt-primary">
                  {hi ? doc.label : doc.labelEn}
                </p>
                <p className="text-[11px] text-txt-secondary">
                  {hi ? doc.labelEn : doc.label}
                </p>
              </div>
              {!doc.uploaded && (
                <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-trust/10 text-trust text-xs font-medium">
                  <Upload size={12} /> Upload
                </button>
              )}
              {doc.uploaded && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                  DigiLocker
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="px-4 mt-6">
        <button
          onClick={() => {
            alert(
              "आवेदन सफलतापूर्वक जमा किया गया! Application submitted successfully!",
            );
            navigate("/tracking");
          }}
          className="w-full h-14 rounded-xl bg-success text-white font-display font-semibold text-base active:scale-[0.98] transition-transform"
        >
          <span className="font-hindi">
            {hi ? "आवेदन जमा करें" : "Submit Application"}
          </span>
        </button>
        <p className="text-center text-[10px] text-txt-muted mt-2">
          {hi
            ? "जमा करने से पहले Shadow Mode में समीक्षा होगी"
            : "Will be reviewed in Shadow Mode before submission"}
        </p>
      </div>
    </motion.div>
  );
}
