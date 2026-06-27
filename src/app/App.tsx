import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bubble } from "./components/chat/Bubble";
import { INITIAL_MESSAGES } from "./data/initial-messages";
import { FEATURE_ENTRIES } from "./data/feature-entries";
import { route } from "./agent";
import { formatTime } from "./utils/time";
import { ParkingPage } from "./pages/ParkingPage";
import type { Message, QueueInfo, UserProfile } from "./types";

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [parkingInfo, setParkingInfo] = useState<{ location: string; floor: string; parkedAt: number } | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({ categories: [], brands: [], items: [] });
  const [currentPage, setCurrentPage] = useState<"home" | "parking">("home");

  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const queueNotifiedRef = useRef<{ almost: boolean; ready: boolean }>({ almost: false, ready: false });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!queueInfo || queueInfo.status === "ready") return;

    const interval = setInterval(() => {
      setQueueInfo((prev) => {
        if (!prev) return null;

        const newAhead = Math.max(0, prev.ahead - 1);
        const newEstMin = Math.max(0, newAhead * 8);
        const newStatus: QueueInfo["status"] = newAhead === 0 ? "ready" : newAhead <= 2 ? "almost" : "queuing";

        if (newStatus === "almost" && !queueNotifiedRef.current.almost) {
          queueNotifiedRef.current.almost = true;
          const now = formatTime();
          setMessages((p) => [
            ...p,
            {
              id: `queue-almost-${Date.now()}`,
              role: "agent",
              text: `李先生，您在${prev.brand}的排队即将到号，前方仅剩${newAhead}组，请准备前往${prev.floor}。`,
              time: now,
              quickReplies: ["导航到店铺", "查看菜单"],
              queueCard: {
                type: "queue-card",
                brand: prev.brand,
                floor: prev.floor,
                partySize: prev.partySize,
                queueNo: prev.queueNo,
                ahead: newAhead,
                estMin: newEstMin,
                status: "almost",
              },
            },
          ]);
        } else if (newStatus === "ready" && !queueNotifiedRef.current.ready) {
          queueNotifiedRef.current.ready = true;
          const now = formatTime();
          setMessages((p) => [
            ...p,
            {
              id: `queue-ready-${Date.now()}`,
              role: "agent",
              text: `李先生，您在${prev.brand}的排队已到号！请前往${prev.floor}入座，过号需重新排队哦。`,
              time: now,
              quickReplies: ["导航到店铺", "今日专属优惠"],
              queueCard: {
                type: "queue-card",
                brand: prev.brand,
                floor: prev.floor,
                partySize: prev.partySize,
                queueNo: prev.queueNo,
                ahead: 0,
                estMin: 0,
                status: "ready",
              },
            },
          ]);
        }

        return { ...prev, ahead: newAhead, estMin: newEstMin, status: newStatus };
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [queueInfo?.enrolledAt]);

  function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value) return;

    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", text: value, time: formatTime() }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const response = route({
        text: value,
        userProfile,
        parkingInfo,
        queueInfo,
      });

      if (response?.sideEffects?.setUserProfile) {
        setUserProfile(response.sideEffects.setUserProfile);
      }
      if (response?.sideEffects && "parkingInfo" in response.sideEffects) {
        setParkingInfo(response.sideEffects.parkingInfo ?? null);
      }
      if (response?.sideEffects && "queueInfo" in response.sideEffects) {
        setQueueInfo(response.sideEffects.queueInfo ?? null);
      }
      if (response?.sideEffects?.resetQueueNotified) {
        queueNotifiedRef.current = { almost: false, ready: false };
      }

      if (response) {
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: response.text,
            time: formatTime(),
            quickReplies: response.quickReplies,
            card: response.card,
            parkingCard: response.parkingCard,
            coupons: response.coupons,
            queueCard: response.queueCard,
          },
        ]);
        return;
      }

      setMessages((p) => [
        ...p,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          text: "已收到您的需求，正在为您安排，请稍候片刻。如有任何进一步需求，请随时告知。",
          time: formatTime(),
          quickReplies: ["查询停车状态", "今日专属优惠"],
        },
      ]);
    }, 1300);
  }

  function navigateTo(feature: string) {
    if (feature === "智能停车") {
      setCurrentPage("parking");
      return;
    }
    send(feature);
  }

  function handleParkingRedeem() {
    setCurrentPage("home");
    setTimeout(() => send("积分抵扣停车费"), 100);
  }

  return (
    <div className="size-full flex items-center justify-center" style={{ background: "#D8D2C8" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          background: "#F5F2ED",
          fontFamily: "'DM Sans', sans-serif",
          color: "#1A1713",
          borderRadius: 44,
          boxShadow: "0 40px 120px rgba(0,0,0,0.45), 0 0 0 1px rgba(184,146,74,0.18)",
        }}
      >
        {currentPage === "parking" ? (
          <ParkingPage
            parkingInfo={parkingInfo}
            onBack={() => setCurrentPage("home")}
            onRecordParking={(info) => setParkingInfo(info)}
            onRedeemPoints={handleParkingRedeem}
          />
        ) : (
        <>
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-3 relative z-20">
          <button className="w-8 h-8 flex items-center justify-center text-[#8C8278] text-lg">‹</button>
          <div className="flex items-center gap-2">
            <span className="text-[14px] tracking-[0.18em] text-[#1A1713]" style={{ fontFamily: "'Cormorant', serif" }}>
              SKP 私享管家
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center text-[#8C8278] text-sm">⊙</button>
            <button className="w-8 h-8 flex items-center justify-center text-[#8C8278] text-sm">···</button>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-center gap-1.5 pb-2 relative z-20">
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #B8924A30)" }} />
          <p className="text-[10px] tracking-[0.12em] text-[#8C8278]">下拉查看历史对话</p>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #B8924A30, transparent)" }} />
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div
            className="relative w-full flex items-stretch overflow-hidden"
            style={{
              height: 172,
              background: "linear-gradient(110deg, #F0EBE1 0%, #EDE5D6 55%, #E2D8C8 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #8C6A2F 0px, #8C6A2F 1px, transparent 1px, transparent 18px)" }} />

            <div className="relative z-10 flex flex-col justify-center pl-5 pr-2 flex-1">
              <p className="text-[10px] tracking-[0.22em] text-[#B8924A] uppercase mb-2" style={{ letterSpacing: "0.2em" }}>
                SKP · 私享管家
              </p>
              <p className="text-[26px] leading-tight text-[#1A1713] mb-2" style={{ fontFamily: "'Cormorant', serif", fontWeight: 400 }}>
                您好，<br />李先生
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BA888] animate-pulse" />
                <span className="text-[10px] tracking-widest text-[#B8924A]">◆ 黑钻会员</span>
              </div>

              <div className="mt-3 self-start px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,146,74,0.3)" }}>
                <span className="text-[9px] text-[#8C8278] tracking-wider mr-2">积分余额</span>
                <span className="text-[12px] text-[#B8924A]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  128,400
                </span>
              </div>
            </div>

            <div className="relative flex-shrink-0" style={{ width: 196 }}>
              <div className="absolute inset-y-0 left-0 w-16 z-10" style={{ background: "linear-gradient(to right, #EDE5D6, transparent)" }} />
              <img
                src="https://images.unsplash.com/photo-1774897795463-e6e4618a4997?w=300&h=400&fit=crop&crop=top&auto=format"
                alt="SKP专属顾问"
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(1.02)", objectPosition: "left 45% top" }}
              />
            </div>
          </div>

          <div className="px-4 pt-4 pb-5 grid grid-cols-3 gap-2.5">
            {FEATURE_ENTRIES.map((feature) => (
              <motion.button
                key={feature.title}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo(feature.title)}
                className="flex flex-col items-center gap-2 px-2 py-3.5 text-center w-full transition-all duration-200 rounded-[8px]"
                style={{
                  background: feature.accent ? "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)" : "#FFFFFF",
                  border: feature.accent ? "1px solid #B8924A40" : "1px solid rgba(184,146,74,0.14)",
                  boxShadow: "0 1px 4px rgba(26,23,19,0.05)",
                }}
              >
                <div>
                  <p className="text-[12px] text-[#1A1713] mb-0.5" style={{ fontWeight: 500 }}>
                    {feature.title}
                  </p>
                  <p className="text-[9px] text-[#8C8278] leading-tight">{feature.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-5 mb-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #B8924A20)" }} />
            <span className="text-[9px] tracking-[0.22em] text-[#B8924A]/50 uppercase">对话记录</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #B8924A20, transparent)" }} />
          </div>

          <div className="px-4 space-y-5 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <Bubble key={message.id} msg={message} onQuickReply={send} />
              ))}

              {isTyping && (
                <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1774897795463-e6e4618a4997?w=150&h=150&fit=facearea&facepad=2.2&auto=format"
                    alt="顾问头像"
                    className="flex-shrink-0 w-7 h-7 rounded-full object-cover"
                    style={{ border: "1px solid rgba(184,146,74,0.3)" }}
                  />
                  <div
                    className="px-3.5 py-3 flex items-center gap-[5px] rounded-[18px] rounded-tl-[4px]"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(184,146,74,0.12)", boxShadow: "0 1px 4px rgba(26,23,19,0.06)" }}
                  >
                    {[0, 0.18, 0.36].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-[5px] h-[5px] rounded-full"
                        style={{ background: "#B8924A60" }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
                        transition={{ duration: 1, delay, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <div className="h-24" />
        </div>

        <div className="absolute bottom-0 inset-x-0 z-30" style={{ background: "linear-gradient(to top, #F5F2ED 72%, rgba(245,242,237,0) 100%)", paddingTop: 20 }}>
          <div
            className="mx-4 mb-3 flex items-center gap-2.5 px-4 py-3 rounded-[24px]"
            style={{ background: "#FFFFFF", border: "1px solid rgba(184,146,74,0.2)", boxShadow: "0 2px 12px rgba(26,23,19,0.07)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="有什么需要问我的吗～"
              className="flex-1 bg-transparent outline-none text-[13px] text-[#1A1713] placeholder:text-[#C8BEAF]"
              style={{ fontWeight: 400 }}
            />
            {input.trim() ? (
              <button
                onClick={() => send()}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 active:scale-95 rounded-full"
                style={{ background: "#B8924A", color: "#FFFFFF" }}
              >
                ↑
              </button>
            ) : (
              <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#C8BEAF] transition-colors hover:text-[#B8924A]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
