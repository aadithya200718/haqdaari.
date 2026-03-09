import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import EligibilityCheck from "./pages/EligibilityCheck";
import Results from "./pages/Results";
import SchemeComparison from "./pages/SchemeComparison";
import ApplicationForm from "./pages/ApplicationForm";
import Tracking from "./pages/Tracking";
import Notifications from "./pages/Notifications";
import CscDashboard from "./pages/CscDashboard";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import SchemeArbitrage from "./pages/SchemeArbitrage";
import WhatsAppDemo from "./pages/WhatsAppDemo";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/eligibility" element={<EligibilityCheck />} />
          <Route path="/results" element={<Results />} />
          <Route path="/compare" element={<SchemeComparison />} />
          <Route path="/apply/:schemeId" element={<ApplicationForm />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/csc" element={<CscDashboard />} />
          <Route path="/arbitrage" element={<SchemeArbitrage />} />
          <Route path="/whatsapp" element={<WhatsAppDemo />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
