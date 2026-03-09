import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
  type?: "text" | "link" | "card";
}

const DEMO_CONVERSATION: ChatMessage[] = [
  {
    id: 1,
    from: "bot",
    text: "Namaste! Main HaqDaari hoon — aapka sarkari yojana assistant. Apna Aadhaar number batayein ya voice note bhejein 🎤",
    time: "14:00",
    type: "text",
  },
  { id: 2, from: "user", text: "9876 5432 1012", time: "14:02", type: "text" },
  {
    id: 3,
    from: "bot",
    text: "Dhanyavaad Ramesh ji! Aapki details verify ho gayi hain.\n\n✅ Aadhaar verified\n✅ 3 documents fetched",
    time: "14:03",
    type: "text",
  },
  {
    id: 4,
    from: "bot",
    text: "Aap 7 yojanaon ke eligible hain!\nEnrolled: 2 ✅ Missing: 5 ❌ Extra benefit: ₹36,000/yr",
    time: "14:03",
    type: "card",
  },
  {
    id: 5,
    from: "bot",
    text: "🔗 haqdaari.in/ramesh\nReview & Apply for missing 5 schemes to claim extra benefits.",
    time: "14:03",
    type: "link",
  },
  {
    id: 6,
    from: "user",
    text: "PM KISAN ke baare mein batao",
    time: "14:05",
    type: "text",
  },
  {
    id: 7,
    from: "bot",
    text: "PM-KISAN: Har saal ₹6,000 milte hain teen kisht mein (₹2,000 per 4 months). Aapke paas 2 hectare se kam zameen hai, toh aap eligible hain ✅\n\nDocuments chahiye:\n📄 Aadhaar Card ✅\n📄 Land Record ✅\n📄 Bank Account ❌\n\nKya aap apply karna chahte hain?",
    time: "14:06",
    type: "text",
  },
  { id: 8, from: "user", text: "Haan apply karo", time: "14:07", type: "text" },
  {
    id: 9,
    from: "bot",
    text: "🟡 Shadow Mode activated!\n\nMain yeh karunga:\n1. Aadhaar se details fetch karunga\n2. DigiLocker se documents lunga\n3. PM-KISAN form auto-fill karunga\n4. Aapki approval ke baad submit karunga\n\n✅ सहमति दें / ❌ रद्द करें",
    time: "14:07",
    type: "card",
  },
  {
    id: 10,
    from: "user",
    text: "✅ Review & Apply",
    time: "14:08",
    type: "text",
  },
];

export default function WhatsAppDemo() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIdx >= DEMO_CONVERSATION.length) return;
    const msg = DEMO_CONVERSATION[currentIdx];
    const delay = msg.from === "bot" ? 1200 : 800;
    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, msg]);
      setCurrentIdx((prev) => prev + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-[#ECE5DD]"
    >
      {/* WhatsApp header */}
      <div className="bg-[#075E54] px-3 py-2 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-sm">
          H
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">HaqDaari</p>
          <p className="text-white/70 text-[11px]">online</p>
        </div>
        <div className="flex items-center gap-4">
          <Video size={18} className="text-white/80" />
          <Phone size={18} className="text-white/80" />
          <MoreVertical size={18} className="text-white/80" />
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-2"
      >
        {/* Date chip */}
        <div className="flex justify-center mb-2">
          <span className="bg-white/90 text-[11px] text-txt-muted px-3 py-1 rounded-lg shadow-sm">
            TODAY
          </span>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                msg.from === "user"
                  ? "bg-[#DCF8C6] rounded-tr-none"
                  : "bg-white rounded-tl-none"
              }`}
            >
              {msg.type === "link" ? (
                <div>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {msg.text.split("\n")[0]}
                  </p>
                  <div className="mt-1 bg-gray-50 rounded p-2 border-l-4 border-[#25D366]">
                    <p className="text-xs text-txt-secondary">
                      {msg.text.split("\n").slice(1).join("\n")}
                    </p>
                  </div>
                </div>
              ) : msg.type === "card" ? (
                <div className="bg-gray-50 rounded p-2 border-l-4 border-brand">
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {msg.text}
                </p>
              )}
              <p className="text-[10px] text-txt-muted text-right mt-0.5">
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {currentIdx < DEMO_CONVERSATION.length &&
          DEMO_CONVERSATION[currentIdx]?.from === "bot" && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm rounded-tl-none">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Input bar */}
      <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
          <span className="text-sm text-gray-400">Message</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
          <Send size={18} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}
