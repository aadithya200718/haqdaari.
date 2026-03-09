import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "../store";

const applications = [
  {
    id: "APP-2025-001",
    scheme: "PM-KISAN",
    schemeHi: "पीएम-किसान",
    status: "approved",
    statusLabel: "स्वीकृत",
    statusEn: "Approved",
    date: "15 Jan 2025",
    timeline: [
      { step: "आवेदन जमा", date: "10 Jan", done: true },
      { step: "दस्तावेज़ सत्यापन", date: "12 Jan", done: true },
      { step: "जिला अधिकारी अनुमोदन", date: "14 Jan", done: true },
      { step: "लाभ स्थानांतरित", date: "15 Jan", done: true },
    ],
  },
  {
    id: "APP-2025-002",
    scheme: "PMJAY",
    schemeHi: "आयुष्मान भारत",
    status: "in_review",
    statusLabel: "समीक्षा में",
    statusEn: "Under Review",
    date: "20 Jan 2025",
    timeline: [
      { step: "आवेदन जमा", date: "18 Jan", done: true },
      { step: "दस्तावेज़ सत्यापन", date: "19 Jan", done: true },
      { step: "जिला अधिकारी अनुमोदन", date: "Pending", done: false },
      { step: "कार्ड जारी", date: "Pending", done: false },
    ],
  },
  {
    id: "APP-2025-003",
    scheme: "PMAY",
    schemeHi: "पीएम आवास योजना",
    status: "pending",
    statusLabel: "लंबित",
    statusEn: "Pending",
    date: "22 Jan 2025",
    timeline: [
      { step: "आवेदन जमा", date: "22 Jan", done: true },
      { step: "दस्तावेज़ सत्यापन", date: "Pending", done: false },
      { step: "अनुमोदन", date: "Pending", done: false },
    ],
  },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  approved: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  in_review: { icon: Loader, color: "text-amber-600", bg: "bg-warning/10" },
  pending: { icon: Clock, color: "text-txt-muted", bg: "bg-gray-100" },
  rejected: {
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export default function Tracking() {
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
            {hi ? "आवेदन ट्रैकिंग" : "Application Tracking"}
          </h1>
          <p className="text-white/80 text-xs">
            {hi ? "Application Tracking" : ""}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {applications.map((app) => {
          const cfg = statusConfig[app.status];
          const StatusIcon = cfg.icon;

          return (
            <div key={app.id} className="bg-white rounded-2xl overflow-hidden">
              {/* Card header */}
              <div className="p-4 flex items-start justify-between">
                <div>
                  <p className="font-hindi font-semibold text-base">
                    {hi ? app.schemeHi : app.scheme}
                  </p>
                  <p className="text-xs text-txt-secondary">
                    {app.scheme} · {app.id}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${cfg.bg} ${cfg.color}`}
                >
                  <StatusIcon size={12} />
                  {hi ? app.statusLabel : app.statusEn}
                </span>
              </div>

              {/* Timeline */}
              <div className="px-4 pb-4">
                <div className="relative ml-2.5">
                  {app.timeline.map((step, i) => (
                    <div key={i} className="flex gap-3 pb-3 last:pb-0">
                      {/* Dot and line */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full border-2 z-10 ${
                            step.done
                              ? "bg-success border-success"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        {i < app.timeline.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 mt-0.5 ${step.done ? "bg-success" : "bg-gray-200"}`}
                          />
                        )}
                      </div>
                      <div className="pb-1">
                        <p
                          className={`font-hindi text-sm ${step.done ? "text-txt-primary font-medium" : "text-txt-muted"}`}
                        >
                          {step.step}
                        </p>
                        <p className="text-[10px] text-txt-secondary">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
