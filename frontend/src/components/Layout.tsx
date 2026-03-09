import { Outlet, NavLink } from "react-router-dom";
import { Home, Search, TrendingUp, Shield, User } from "lucide-react";
import { useStore } from "../store";

const navItems = [
  { to: "/", icon: Home, label: "होम", labelEn: "Home" },
  { to: "/eligibility", icon: Search, label: "योजनाएं", labelEn: "Schemes" },
  {
    to: "/arbitrage",
    icon: TrendingUp,
    label: "आर्बिट्राज",
    labelEn: "Arbitrage",
  },
  { to: "/results", icon: Shield, label: "शैडो", labelEn: "Shadow" },
  { to: "/profile", icon: User, label: "प्रोफ़ाइल", labelEn: "Profile" },
];

export default function Layout() {
  const { language } = useStore();
  const hi = language === "hi";

  return (
    <div className="min-h-screen pb-16 bg-bg-light">
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
        {navItems.map(({ to, icon: Icon, label, labelEn }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-[48px] min-h-[48px] justify-center transition-colors ${
                isActive ? "text-brand" : "text-txt-secondary"
              }`
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            <span className="text-[11px] font-hindi font-medium">
              {hi ? label : labelEn}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
