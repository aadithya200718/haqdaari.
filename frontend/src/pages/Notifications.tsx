import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { useStore } from "../store";

const notifications = [
  {
    id: 1,
    type: "success",
    icon: CheckCircle,
    title: "PM-KISAN किस्त प्राप्त",
    body: "₹2,000 आपके खाते में जमा कर दिए गए हैं।",
    bodyEn: "₹2,000 has been credited to your account.",
    time: "2 घंटे पहले",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    icon: AlertTriangle,
    title: "PMJAY दस्तावेज़ लंबित",
    body: "कृपया अपना बैंक पासबुक अपलोड करें।",
    bodyEn: "Please upload your bank passbook.",
    time: "5 घंटे पहले",
    read: false,
  },
  {
    id: 3,
    type: "info",
    icon: Info,
    title: "नई योजना उपलब्ध",
    body: "पीएम विश्वकर्मा योजना आपके लिए उपलब्ध है। पात्रता जांचें।",
    bodyEn: "PM Vishwakarma scheme is available for you.",
    time: "1 दिन पहले",
    read: true,
  },
  {
    id: 4,
    type: "success",
    icon: Gift,
    title: "PMUY गैस कनेक्शन स्वीकृत",
    body: "आपका मुफ्त LPG कनेक्शन स्वीकृत हो गया है।",
    bodyEn: "Your free LPG connection has been approved.",
    time: "3 दिन पहले",
    read: true,
  },
  {
    id: 5,
    type: "info",
    icon: Bell,
    title: "प्रोफाइल अपडेट सफल",
    body: "आपकी आधार eKYC सत्यापन पूर्ण हुई।",
    bodyEn: "Your Aadhaar eKYC verification is complete.",
    time: "5 दिन पहले",
    read: true,
  },
];

const typeColors: Record<
  string,
  { bg: string; iconColor: string; dot: string }
> = {
  success: {
    bg: "bg-success/10",
    iconColor: "text-success",
    dot: "bg-success",
  },
  warning: {
    bg: "bg-warning/10",
    iconColor: "text-amber-600",
    dot: "bg-amber-500",
  },
  info: { bg: "bg-trust/10", iconColor: "text-trust", dot: "bg-trust" },
};

export default function Notifications() {
  const navigate = useNavigate();
  const { language } = useStore();
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
        <div>
          <h1 className="font-hindi font-bold text-lg text-white">
            {hi ? "सूचनाएं" : "Notifications"}
          </h1>
          <p className="text-white/80 text-xs">{hi ? "Notifications" : ""}</p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {notifications.map((n) => {
          const colors = typeColors[n.type];
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`bg-white rounded-xl p-3 flex gap-3 ${!n.read ? "ring-1 ring-brand/20" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${colors.bg}`}
              >
                <Icon size={18} className={colors.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-hindi font-semibold text-sm text-txt-primary leading-snug">
                    {n.title}
                  </p>
                  {!n.read && (
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${colors.dot}`}
                    />
                  )}
                </div>
                <p className="font-hindi text-xs text-txt-secondary mt-0.5 leading-relaxed">
                  {hi ? n.body : n.bodyEn}
                </p>
                <p className="text-[10px] text-txt-muted mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
