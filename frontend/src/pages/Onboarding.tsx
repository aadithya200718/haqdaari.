import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Fingerprint } from "lucide-react";

const slides = [
  {
    title: "HaqDaari",
    titleHi: "हक़दारी",
    subtitle: "Your Rights, Simplified",
    subtitleHi: "आपके अधिकार, सरल बनाए",
    description:
      "AI-powered platform to discover and access government welfare schemes you deserve.",
    color: "from-brand to-amber-500",
  },
  {
    title: "Shadow Mode",
    titleHi: "शैडो मोड",
    subtitle: "Preview Before Action",
    subtitleHi: "कार्रवाई से पहले पूर्वावलोकन",
    description:
      "See exactly what will happen with your data before you consent. Full transparency.",
    color: "from-trust to-indigo-500",
  },
  {
    title: "15+ Schemes",
    titleHi: "15+ योजनाएं",
    subtitle: "One Check, All Schemes",
    subtitleHi: "एक जांच, सभी योजनाएं",
    description:
      "PM-KISAN, PMJAY, PMAY, MGNREGA and more — check eligibility in seconds.",
    color: "from-success to-emerald-600",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  if (step < slides.length) {
    const slide = slides[step];
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className={`min-h-screen bg-gradient-to-b ${slide.color} flex flex-col items-center justify-center px-6 text-center text-white`}
        >
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-md">
            {step === 0 && <Shield size={40} className="text-white" />}
            {step === 1 && <Fingerprint size={40} className="text-white" />}
            {step === 2 && <ArrowRight size={40} className="text-white" />}
          </div>

          <h1 className="font-display font-black text-4xl">{slide.title}</h1>
          <p className="font-hindi text-xl mt-1 opacity-90">{slide.titleHi}</p>
          <p className="font-display font-semibold text-lg mt-4">
            {slide.subtitle}
          </p>
          <p className="font-hindi text-base opacity-80">{slide.subtitleHi}</p>
          <p className="text-sm opacity-70 mt-3 max-w-xs leading-relaxed">
            {slide.description}
          </p>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStep(step + 1)}
            className="mt-8 px-8 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-white font-display font-semibold text-base active:scale-95 transition-transform"
          >
            {step < slides.length - 1 ? "Next →" : "Get Started"}
          </button>

          {step < slides.length - 1 && (
            <button
              onClick={() => setStep(slides.length)}
              className="mt-3 text-sm text-white/60"
            >
              Skip
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Auth / Enter screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-brand/5 to-white flex flex-col items-center justify-center px-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mb-6">
        <Shield size={32} className="text-brand" />
      </div>
      <h1 className="font-display font-black text-3xl text-txt-primary">
        HaqDaari
      </h1>
      <p className="font-hindi text-lg text-txt-secondary">हक़दारी</p>
      <p className="text-sm text-txt-muted mt-2 text-center max-w-xs">
        Enter your Aadhaar number to discover eligible government schemes
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 w-full max-w-xs h-14 rounded-xl bg-success text-white font-display font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Fingerprint size={20} />
        <span className="font-hindi">शुरू करें</span>
      </button>

      <p className="text-[10px] text-txt-muted mt-4 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </motion.div>
  );
}
