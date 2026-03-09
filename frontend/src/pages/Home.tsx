import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Mic,
  Search,
  Shield,
  FileText,
  MapPin,
  MessageCircle,
  ChevronRight,
  Fingerprint,
  TrendingUp,
} from "lucide-react";
import { useStore } from "../store";
import { formatRupees } from "../utils";

const quickActions = [
  {
    icon: Fingerprint,
    label: "पात्रता जांचें",
    labelEn: "Check Eligibility",
    to: "/eligibility",
    color: "bg-success/10 text-success",
  },
  {
    icon: FileText,
    label: "योजना में आवेदन",
    labelEn: "Apply",
    to: "/eligibility",
    color: "bg-trust/10 text-trust",
  },
  {
    icon: Search,
    label: "आवेदन ट्रैक करें",
    labelEn: "Track",
    to: "/tracking",
    color: "bg-brand/10 text-brand",
  },
  {
    icon: TrendingUp,
    label: "आर्बिट्राज",
    labelEn: "Arbitrage",
    to: "/arbitrage",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: MapPin,
    label: "CSC Co-Pilot",
    labelEn: "CSC Co-Pilot",
    to: "/csc",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Bot",
    labelEn: "WhatsApp",
    to: "/whatsapp",
    color: "bg-green-500/10 text-green-600",
  },
];

const activeSchemes = [
  {
    name: "आयुष्मान भारत (PMJAY)",
    nameEn: "Ayushman Bharat (PMJAY)",
    benefit: "Rs 5,00,000 कवर",
    benefitEn: "Rs 5,00,000 cover",
    status: "Active",
    color: "border-l-success",
  },
  {
    name: "पीएम-किसान",
    nameEn: "PM-KISAN",
    benefit: "Rs 6,000/वर्ष",
    benefitEn: "Rs 6,000/year",
    status: "Active",
    color: "border-l-success",
  },
  {
    name: "पीएम उज्ज्वला योजना",
    nameEn: "PM Ujjwala Yojana",
    benefit: "मुफ्त LPG",
    benefitEn: "Free LPG",
    status: "Expiring",
    color: "border-l-warning",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { language, setLanguage } = useStore();
  const hi = language === "hi";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-4 pb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-display font-bold text-lg">
            R
          </div>
          <div>
            <p className="font-hindi font-semibold text-txt-primary text-base">
              {hi ? "नमस्ते, रमेश" : "Hello, Ramesh"}
            </p>
            <p className="text-xs text-txt-secondary">
              {hi ? "Welcome back" : "Welcome back"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
            className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-display font-semibold text-txt-primary min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            {language === "hi" ? "EN" : "HI"}
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 flex items-center justify-center"
          >
            <Bell size={22} className="text-txt-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted"
        />
        <input
          readOnly
          placeholder={hi ? "योजना खोजें..." : "Search schemes..."}
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 text-sm font-hindi focus:outline-none"
        />
        <Mic
          size={18}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand"
        />
      </div>

      {/* Identity card */}
      <div className="bg-gradient-to-br from-trust to-indigo-600 rounded-2xl p-4 mb-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] uppercase tracking-wider opacity-80">
              Aadhaar Card
            </p>
            <p className="font-mono text-lg tracking-widest mt-1">
              XXXX-XXXX-1234
            </p>
            <p className="font-hindi font-semibold mt-2">
              {hi ? "रमेश कुमार" : "Ramesh Kumar"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-[11px] opacity-90">Verified</span>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="font-hindi font-semibold text-base mb-3">
        {hi ? "त्वरित कार्य" : "Quick Actions"}
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {quickActions.map(({ icon: Icon, label, labelEn, to, color }) => (
          <button
            key={labelEn}
            onClick={() => navigate(to)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white min-h-[48px] active:scale-95 transition-transform"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
            >
              <Icon size={20} />
            </div>
            <span className="text-[11px] font-hindi font-medium text-center leading-tight">
              {hi ? label : labelEn}
            </span>
          </button>
        ))}
      </div>

      {/* AI Advisor strip */}
      <div className="bg-gradient-to-r from-brand/10 to-amber-100 rounded-2xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-brand" />
          </div>
          <div className="flex-1">
            <p className="font-hindi font-semibold text-sm text-txt-primary">
              {hi
                ? `${formatRupees(3200)} PM-KISAN लाभ आपके लिए उपलब्ध`
                : `${formatRupees(3200)} PM-KISAN benefit available for you`}
            </p>
            <p className="text-xs text-txt-secondary mt-0.5">
              {hi
                ? "Based on your land records and Aadhaar profile"
                : "Based on your land records and Aadhaar profile"}
            </p>
            <button
              onClick={() => navigate("/eligibility")}
              className="mt-2 px-4 py-1.5 rounded-lg bg-success text-white text-xs font-display font-semibold active:scale-95 transition-transform"
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </div>

      {/* Active benefits */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-hindi font-semibold text-base">
          {hi ? "सक्रिय लाभ" : "Active Benefits"}
        </h2>
        <button className="text-xs text-trust font-medium flex items-center">
          {hi ? "सभी देखें" : "View all"} <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {activeSchemes.map((s) => (
          <div
            key={s.name}
            className={`flex-shrink-0 w-44 bg-white rounded-xl p-3 border-l-4 ${s.color} snap-start`}
          >
            <p className="font-hindi font-medium text-sm text-txt-primary leading-snug">
              {hi ? s.name : s.nameEn}
            </p>
            <p className="text-success font-display font-bold text-sm mt-1">
              {hi ? s.benefit : s.benefitEn}
            </p>
            <span
              className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                s.status === "Active"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-amber-700"
              }`}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <h2 className="font-hindi font-semibold text-base mt-5 mb-3">
        {hi ? "हाल की गतिविधि" : "Recent Activity"}
      </h2>
      <div className="space-y-2">
        {[
          {
            action: "स्वास्थ्य दावा जमा किया",
            actionEn: "Health claim submitted",
            amount: "Rs 12,500",
            status: "Under Review",
            statusColor: "bg-warning/10 text-amber-700",
          },
          {
            action: "PM-KISAN किस्त प्राप्त",
            actionEn: "PM-KISAN installment received",
            amount: "Rs 2,000",
            status: "Completed",
            statusColor: "bg-success/10 text-success",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white rounded-xl p-3"
          >
            <div>
              <p className="text-sm font-hindi font-medium text-txt-primary">
                {hi ? item.action : item.actionEn}
              </p>
              <p className="text-xs text-txt-secondary">{item.amount}</p>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.statusColor}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
