import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  FileText,
  Globe,
  ChevronRight,
  LogOut,
  Bell,
  Moon,
  HelpCircle,
} from "lucide-react";
import { useStore } from "../store";

const linkedAccounts = [
  { label: "Aadhaar eKYC", status: "Verified", color: "text-success" },
  { label: "DigiLocker", status: "Connected", color: "text-success" },
  { label: "Bank Account", status: "Not linked", color: "text-destructive" },
];

const settingsGroups = [
  {
    title: "खाता सेटिंग्स",
    titleEn: "Account Settings",
    items: [
      {
        icon: Bell,
        label: "सूचना प्राथमिकताएं",
        labelEn: "Notification Preferences",
      },
      { icon: Globe, label: "भाषा बदलें", labelEn: "Change Language" },
      { icon: Moon, label: "डार्क मोड", labelEn: "Dark Mode" },
    ],
  },
  {
    title: "सहायता",
    titleEn: "Support",
    items: [
      { icon: HelpCircle, label: "FAQ / मदद", labelEn: "FAQ / Help" },
      { icon: Shield, label: "गोपनीयता नीति", labelEn: "Privacy Policy" },
      {
        icon: FileText,
        label: "नियम और शर्तें",
        labelEn: "Terms & Conditions",
      },
    ],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { reset, language, setLanguage } = useStore();
  const hi = language === "hi";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      <div className="bg-brand px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <h1 className="font-hindi font-bold text-lg text-white">
          {hi ? "प्रोफ़ाइल" : "Profile"}
        </h1>
      </div>

      {/* Profile card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center text-brand font-display font-bold text-2xl">
            R
          </div>
          <div>
            <p className="font-hindi font-bold text-lg text-txt-primary">
              रमेश कुमार
            </p>
            <p className="text-xs text-txt-secondary">Ramesh Kumar</p>
            <p className="text-xs text-txt-muted mt-0.5 font-mono">
              AADHAAR: XXXX-XXXX-1234
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          {[
            { label: "योजनाएं", labelEn: "Schemes", value: "5" },
            { label: "आवेदन", labelEn: "Applications", value: "3" },
            { label: "सक्रिय", labelEn: "Active", value: "2" },
          ].map(({ label, labelEn, value }) => (
            <div key={label} className="text-center">
              <p className="font-display font-bold text-xl text-brand">
                {value}
              </p>
              <p className="font-hindi text-[11px] text-txt-secondary">
                {hi ? label : labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Linked accounts */}
      <div className="px-4 mt-5">
        <h2 className="font-hindi font-semibold text-sm mb-3">
          {hi ? "लिंक किए गए खाते" : "Linked Accounts"}
        </h2>
        <div className="bg-white rounded-2xl divide-y divide-gray-100">
          {linkedAccounts.map((a) => (
            <div
              key={a.label}
              className="flex items-center justify-between p-3.5"
            >
              <span className="text-sm text-txt-primary">{a.label}</span>
              <span className={`text-xs font-medium ${a.color}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      {settingsGroups.map((group) => (
        <div key={group.title} className="px-4 mt-5">
          <h2 className="font-hindi font-semibold text-sm mb-3">
            {hi ? group.title : group.titleEn}
          </h2>
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {group.items.map(({ icon: Icon, label, labelEn }) => (
              <button
                key={labelEn}
                onClick={
                  labelEn === "Change Language"
                    ? () => setLanguage(hi ? "en" : "hi")
                    : undefined
                }
                className="w-full flex items-center gap-3 p-3.5 text-left"
              >
                <Icon size={18} className="text-txt-secondary" />
                <div className="flex-1">
                  <p className="font-hindi text-sm text-txt-primary">
                    {hi ? label : labelEn}
                  </p>
                  <p className="text-[11px] text-txt-muted">
                    {hi ? labelEn : label}
                  </p>
                </div>
                {labelEn === "Change Language" && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                    {hi ? "हिंदी" : "English"}
                  </span>
                )}
                <ChevronRight size={16} className="text-txt-muted" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="px-4 mt-6">
        <button
          onClick={() => {
            reset();
            navigate("/onboarding");
          }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-destructive text-destructive font-display font-semibold active:scale-[0.98] transition-transform"
        >
          <LogOut size={18} />
          <span className="font-hindi">{hi ? "लॉग आउट" : "Log Out"}</span>
        </button>
      </div>
    </motion.div>
  );
}
