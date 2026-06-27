import { motion } from "motion/react";
import type { Message } from "../../types";
import { MemberCardBubble } from "../cards/MemberCardBubble";
import { ParkingCardBubble } from "../cards/ParkingCardBubble";
import { QueueCardBubble } from "../cards/QueueCardBubble";
import { CouponCardBubble } from "../cards/CouponCardBubble";

export function Bubble({ msg, onQuickReply }: { msg: Message; onQuickReply: (text: string) => void }) {
  const isAgent = msg.role === "agent";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      <div className={`flex gap-2.5 ${isAgent ? "" : "flex-row-reverse"}`}>
        {isAgent && (
          <img
            src="https://images.unsplash.com/photo-1774897795463-e6e4618a4997?w=150&h=150&fit=facearea&facepad=2.2&auto=format"
            alt="顾问头像"
            className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full object-cover"
            style={{ border: "1px solid rgba(184,146,74,0.3)" }}
          />
        )}

        <div className={`${isAgent && msg.card ? "max-w-full" : "max-w-[80%]"} ${!isAgent ? "flex flex-col items-end" : ""}`}>
          <div
            className={`px-3.5 py-2.5 text-[13px] leading-[1.65] rounded-[18px] ${
              isAgent ? "rounded-tl-[4px]" : "rounded-tr-[4px]"
            } ${isAgent && msg.card ? "self-start" : ""}`}
            style={{
              background: isAgent ? "#FFFFFF" : "#B8924A",
              border: isAgent ? "1px solid rgba(184,146,74,0.12)" : "none",
              boxShadow: isAgent ? "0 1px 4px rgba(26,23,19,0.06)" : "0 2px 8px rgba(184,146,74,0.25)",
              color: isAgent ? "#1A1713" : "#FFFFFF",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              whiteSpace: "pre-line",
              maxWidth: isAgent && msg.card ? "80%" : undefined,
            }}
          >
            {msg.text}
          </div>

          {isAgent && msg.card && <MemberCardBubble card={msg.card} />}
          {isAgent && msg.parkingCard && <ParkingCardBubble card={msg.parkingCard} />}
          {isAgent && msg.queueCard && <QueueCardBubble card={msg.queueCard} />}
          {isAgent && msg.coupons && msg.coupons.map((coupon) => <CouponCardBubble key={`${coupon.brand}-${coupon.discount}`} coupon={coupon} />)}

          <p className="text-[9px] text-[#8C8278] mt-1 tracking-wider">{msg.time}</p>
        </div>
      </div>

      {isAgent && msg.quickReplies && (
        <div className="ml-9 mt-2.5 flex flex-wrap gap-1.5">
          {msg.quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => onQuickReply(reply)}
              className="text-[11px] px-2.5 py-1.5 tracking-wide transition-all duration-200 active:scale-95 rounded-full"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(184,146,74,0.28)",
                color: "#8C8278",
                boxShadow: "0 1px 3px rgba(26,23,19,0.05)",
              }}
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
