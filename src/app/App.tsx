import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemberCard {
  type: "member-card";
  tier: string;
  tierIcon: string;
  name: string;
  cardNo: string;
  points: string;
  benefits: string[];
}

interface ParkingCard {
  type: "parking-card";
  location: string;
  floor: string;
  duration: string;
  fee: string;
  feeRate: string;
}

interface CouponCard {
  type: "coupon-card";
  brand: string;
  discount: string;
  title: string;
  validUntil: string;
  scope: string;
}

interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
  card?: MemberCard;
  parkingCard?: ParkingCard;
  coupons?: CouponCard[];
  queueCard?: QueueCard;
}

interface ParkingInfo {
  location: string;
  floor: string;
  parkedAt: number; // timestamp
}

interface QueueInfo {
  brand: string;
  floor: string;
  partySize: number;
  queueNo: string;
  ahead: number;
  estMin: number;
  enrolledAt: number;
  status: "queuing" | "almost" | "ready";
}

interface QueueCard {
  type: "queue-card";
  brand: string;
  floor: string;
  partySize: number;
  queueNo: string;
  ahead: number;
  estMin: number;
  status: "queuing" | "almost" | "ready";
}

interface UserProfile {
  categories: string[];
  brands: string[];
  items: string[];
  _justOnboarded?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: "a1",
    role: "agent",
    text: "尊敬的李先生，下午好。我是您专属的SKP管家助手，随时为您提供商场导览、智能停车、专属权益及私享顾问服务。\n\n今日 Hermès（1F-B03）已到本季新品，是否需要为您安排专属顾问试看？",
    time: "15:28",
    quickReplies: ["查询停车状态", "今日专属优惠", "推荐今日活动", "联系专属SA"],
  },
  {
    id: "u1",
    role: "user",
    text: "香奈儿现在排队人多吗？",
    time: "15:31",
  },
  {
    id: "a2",
    role: "agent",
    text: "香奈儿精品店（1F-A12）当前排队约 22 分钟。\n\n趁这段空档，已为您在4F「FLAIR 高端茶饮」预留专属位次，并附上会员八五折专属券。",
    time: "15:31",
    quickReplies: ["帮我托管排队", "查看FLAIR菜单", "看看丝巾库存"],
  },
];


const FEATURE_ENTRIES = [
  {
    icon: "◇",
    title: "优惠中心",
    sub: "专属发券·动态权益",
    accent: true,
  },
  {
    icon: "◆",
    title: "会员中心",
    sub: "积分·等级·家庭卡",
    accent: false,
  },
  {
    icon: "◉",
    title: "智能停车",
    sub: "拍照记位·积分结算",
    accent: false,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function MemberCardBubble({ card }: { card: MemberCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2.5 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 16,
        background: "linear-gradient(135deg, #1A1713 0%, #2A2520 50%, #1A1713 100%)",
        boxShadow: "0 8px 32px rgba(184,146,74,0.18), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Gold border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 16,
          padding: 1.5,
          background: "linear-gradient(135deg, #C9A86C 0%, #B8924A 40%, #D4B978 60%, #B8924A 100%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Texture lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #C9A86C 0px, #C9A86C 0.5px, transparent 0.5px, transparent 20px)",
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 70%)",
        }}
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 1.6, delay: 0.5, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 px-5 pt-5 pb-4">
        {/* Top: SKP brand + tier */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] tracking-[0.25em] text-[#C9A86C] uppercase"
              style={{ fontFamily: "'Cormorant', serif", fontWeight: 400 }}
            >
              SKP
            </span>
            <span className="w-px h-3" style={{ background: "rgba(201,168,108,0.3)" }} />
            <span className="text-[9px] tracking-[0.18em] text-[#C9A86C]/70 uppercase">
              Member
            </span>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,108,0.2), rgba(201,168,108,0.08))",
              border: "1px solid rgba(201,168,108,0.25)",
            }}
          >
            <span className="text-[10px] text-[#C9A86C]">{card.tierIcon}</span>
            <span className="text-[9px] tracking-wider text-[#C9A86C]">{card.tier}</span>
          </div>
        </div>

        {/* Center: Name */}
        <p
          className="text-[22px] text-[#F5F2ED] mb-5 leading-tight"
          style={{ fontFamily: "'Cormorant', serif", fontWeight: 400, letterSpacing: "0.04em" }}
        >
          {card.name}
        </p>

        {/* Card number */}
        <p
          className="text-[11px] text-[#8C8278] mb-4 tracking-[0.15em]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {card.cardNo}
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1.5">
          {card.benefits.map((b) => (
            <span
              key={b}
              className="text-[9px] tracking-wide text-[#C9A86C]/80 px-2 py-1 rounded-full"
              style={{
                background: "rgba(201,168,108,0.1)",
                border: "1px solid rgba(201,168,108,0.18)",
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ParkingCardBubble({ card }: { card: ParkingCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2.5 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 16,
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.18)",
        boxShadow: "0 4px 20px rgba(26,23,19,0.08), 0 1px 4px rgba(26,23,19,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3"
        style={{
          background: "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)",
          borderBottom: "1px solid rgba(184,146,74,0.12)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-[14px]"
              style={{ color: "#B8924A" }}
            >
              ◎
            </span>
            <span
              className="text-[11px] tracking-wide text-[#1A1713]"
              style={{ fontWeight: 500 }}
            >
              智能停车
            </span>
          </div>
          <span
            className="text-[9px] tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(139,168,136,0.15)",
              color: "#6B8C6A",
              border: "1px solid rgba(139,168,136,0.25)",
            }}
          >
            已记录
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        {/* Location */}
        <div className="flex items-start gap-2.5 mb-3">
          <span className="text-[12px] mt-0.5" style={{ color: "#B8924A" }}>📍</span>
          <div>
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-0.5">停车位置</p>
            <p className="text-[13px] text-[#1A1713]" style={{ fontWeight: 500 }}>
              {card.location}
            </p>
          </div>
        </div>

        {/* Duration & Fee */}
        <div className="flex gap-3">
          <div
            className="flex-1 px-3 py-2.5 rounded-[10px]"
            style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}
          >
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">停车时长</p>
            <p
              className="text-[16px] text-[#1A1713]"
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}
            >
              {card.duration}
            </p>
          </div>
          <div
            className="flex-1 px-3 py-2.5 rounded-[10px]"
            style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}
          >
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">停车费用</p>
            <p
              className="text-[16px] text-[#B8924A]"
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}
            >
              ¥{card.fee}
            </p>
          </div>
        </div>

        {/* Fee rate note */}
        <p className="text-[9px] text-[#C8BEAF] mt-2.5 tracking-wide">
          {card.feeRate}
        </p>
      </div>
    </motion.div>
  );
}

function CouponCardBubble({ coupon }: { coupon: CouponCard }) {
  const isMallWide = coupon.scope === "mall";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 14,
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.15)",
        boxShadow: "0 2px 12px rgba(26,23,19,0.06)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px]"
        style={{
          background: isMallWide
            ? "linear-gradient(90deg, #B8924A, #D4B978, #B8924A)"
            : "linear-gradient(90deg, #C9A86C, #8BA888, #C9A86C)",
        }}
      />

      <div className="px-4 pt-3 pb-3.5">
        {/* Brand + scope badge */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] text-[#1A1713]" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
            {coupon.brand}
          </span>
          <span
            className="text-[8px] tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: isMallWide ? "rgba(184,146,74,0.1)" : "rgba(139,168,136,0.1)",
              color: isMallWide ? "#B8924A" : "#6B8C6A",
              border: isMallWide ? "1px solid rgba(184,146,74,0.2)" : "1px solid rgba(139,168,136,0.2)",
            }}
          >
            {isMallWide ? "商场通用" : "品牌专属"}
          </span>
        </div>

        {/* Discount + Title */}
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className="text-[22px] text-[#B8924A]"
            style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, lineHeight: 1 }}
          >
            {coupon.discount}
          </span>
          <span className="text-[12px] text-[#1A1713]" style={{ fontWeight: 500 }}>
            {coupon.title}
          </span>
        </div>

        {/* Valid until */}
        <p className="text-[9px] text-[#C8BEAF] tracking-wide">
          有效期至 {coupon.validUntil}
        </p>
      </div>

      {/* Left edge notch decoration */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-r-full"
        style={{ background: "#F5F2ED" }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-l-full"
        style={{ background: "#F5F2ED" }}
      />
    </motion.div>
  );
}

function QueueCardBubble({ card }: { card: QueueCard }) {
  const statusConfig = {
    queuing: { label: "排队中", bg: "rgba(139,168,136,0.12)", color: "#6B8C6A", border: "rgba(139,168,136,0.25)" },
    almost: { label: "即将到号", bg: "rgba(200,160,80,0.12)", color: "#9A7B3A", border: "rgba(200,160,80,0.25)" },
    ready:  { label: "已到号", bg: "rgba(184,146,74,0.15)", color: "#B8924A", border: "rgba(184,146,74,0.3)" },
  }[card.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2.5 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 16,
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.18)",
        boxShadow: "0 4px 20px rgba(26,23,19,0.08), 0 1px 4px rgba(26,23,19,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3"
        style={{
          background: "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)",
          borderBottom: "1px solid rgba(184,146,74,0.12)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[14px]" style={{ color: "#B8924A" }}>⏳</span>
            <span className="text-[11px] tracking-wide text-[#1A1713]" style={{ fontWeight: 500 }}>
              排队托管
            </span>
          </div>
          <span
            className="text-[9px] tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}` }}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        {/* Brand + Floor */}
        <div className="flex items-start gap-2.5 mb-3">
          <span className="text-[12px] mt-0.5" style={{ color: "#B8924A" }}>🏪</span>
          <div>
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-0.5">店铺</p>
            <p className="text-[13px] text-[#1A1713]" style={{ fontWeight: 500 }}>
              {card.brand}（{card.floor}）<span className="text-[10px] text-[#8C8278] ml-1">{card.partySize}人位</span>
            </p>
          </div>
        </div>

        {/* Queue No + Wait info */}
        <div className="flex gap-3">
          <div
            className="flex-1 px-3 py-2.5 rounded-[10px]"
            style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}
          >
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">排队号码</p>
            <p
              className="text-[18px] text-[#B8924A]"
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700 }}
            >
              {card.queueNo}
            </p>
          </div>
          <div
            className="flex-1 px-3 py-2.5 rounded-[10px]"
            style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}
          >
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">前方等待</p>
            <p
              className="text-[18px] text-[#1A1713]"
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700 }}
            >
              {card.ahead > 0 ? `${card.ahead}组` : "—"}
            </p>
          </div>
        </div>

        {/* Estimated time */}
        <p className="text-[9px] text-[#C8BEAF] mt-2.5 tracking-wide">
          {card.status === "ready"
            ? "请尽快前往店铺，过号需重新排队"
            : `预计还需约${card.estMin}分钟，到号前会提前提醒您`
          }
        </p>
      </div>
    </motion.div>
  );
}


function Bubble({ msg, onQuickReply }: { msg: Message; onQuickReply: (t: string) => void }) {
  const isAgent = msg.role === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
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

          {/* Member card */}
          {isAgent && msg.card && <MemberCardBubble card={msg.card} />}

          {/* Parking card */}
          {isAgent && msg.parkingCard && <ParkingCardBubble card={msg.parkingCard} />}

          {/* Queue card */}
          {isAgent && msg.queueCard && <QueueCardBubble card={msg.queueCard} />}

          {/* Coupon cards */}
          {isAgent && msg.coupons && msg.coupons.map((c) => (
            <CouponCardBubble key={`${c.brand}-${c.discount}`} coupon={c} />
          ))}

          <p className="text-[9px] text-[#8C8278] mt-1 tracking-wider">{msg.time}</p>
        </div>
      </div>

      {/* Quick replies */}
      {isAgent && msg.quickReplies && (
        <div className="ml-9 mt-2.5 flex flex-wrap gap-1.5">
          {msg.quickReplies.map((r) => (
            <button
              key={r}
              onClick={() => onQuickReply(r)}
              className="text-[11px] px-2.5 py-1.5 tracking-wide transition-all duration-200 active:scale-95 rounded-full"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(184,146,74,0.28)",
                color: "#8C8278",
                boxShadow: "0 1px 3px rgba(26,23,19,0.05)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

// ─── Coupon database ──────────────────────────────────────────────────────────

interface CouponDef {
  brand: string;
  discount: string;
  title: string;
  validUntil: string;
  scope: "mall" | "brand";
  triggers: string[];
}

const COUPON_DB: CouponDef[] = [
  // Mall-wide coupons
  {
    brand: "SKP",
    discount: "9折",
    title: "商场通用券",
    validUntil: "2026.07.31",
    scope: "mall",
    triggers: [],
  },
  {
    brand: "SKP",
    discount: "满2000减100",
    title: "全场满减券",
    validUntil: "2026.07.31",
    scope: "mall",
    triggers: [],
  },
  // Brand coupons
  {
    brand: "Chanel",
    discount: "8.5折",
    title: "精品店专属券",
    validUntil: "2026.07.15",
    scope: "brand",
    triggers: ["chanel", "香奈儿"],
  },
  {
    brand: "Hermès",
    discount: "专属礼遇",
    title: "新品预览优先券",
    validUntil: "2026.08.31",
    scope: "brand",
    triggers: ["hermes", "爱马仕", "hermès"],
  },
  {
    brand: "Dior",
    discount: "满3000减300",
    title: "美妆与精品券",
    validUntil: "2026.07.31",
    scope: "brand",
    triggers: ["dior", "迪奥"],
  },
  {
    brand: "Gucci",
    discount: "9折",
    title: "当季精选券",
    validUntil: "2026.07.20",
    scope: "brand",
    triggers: ["gucci", "古驰"],
  },
  {
    brand: "Louis Vuitton",
    discount: "专属预览",
    title: "VIP新品预约券",
    validUntil: "2026.08.15",
    scope: "brand",
    triggers: ["louis vuitton", "lv", "路易威登"],
  },
  {
    brand: "Cartier",
    discount: "满5000减500",
    title: "高珠臻品券",
    validUntil: "2026.07.31",
    scope: "brand",
    triggers: ["cartier", "卡地亚"],
  },
  {
    brand: "La Mer",
    discount: "满1500减200",
    title: "护肤臻享券",
    validUntil: "2026.07.31",
    scope: "brand",
    triggers: ["la mer", "海蓝之谜"],
  },
  // Cross-scene coupons (for queue/waiting scenarios)
  {
    brand: "FLAIR 高端茶饮",
    discount: "8.5折",
    title: "会员专属咖啡券",
    validUntil: "2026.07.31",
    scope: "brand",
    triggers: ["__queue_coffee__"],
  },
  {
    brand: "新荣记",
    discount: "优先入座",
    title: "黑钻专属座席券",
    validUntil: "2026.07.31",
    scope: "brand",
    triggers: ["__queue_dining__"],
  },
];

// Brand queue time database (demo data)
const BRAND_QUEUE: Record<string, { name: string; floor: string; waitMin: number }> = {
  "chanel": { name: "Chanel 精品店", floor: "1F-A12", waitMin: 60 },
  "香奈儿": { name: "Chanel 精品店", floor: "1F-A12", waitMin: 60 },
  "hermes": { name: "Hermès", floor: "1F-B03", waitMin: 45 },
  "爱马仕": { name: "Hermès", floor: "1F-B03", waitMin: 45 },
  "hermès": { name: "Hermès", floor: "1F-B03", waitMin: 45 },
  "lv": { name: "Louis Vuitton", floor: "1F-C01", waitMin: 30 },
  "louis vuitton": { name: "Louis Vuitton", floor: "1F-C01", waitMin: 30 },
  "路易威登": { name: "Louis Vuitton", floor: "1F-C01", waitMin: 30 },
  "dior": { name: "Dior", floor: "1F-D05", waitMin: 25 },
  "迪奥": { name: "Dior", floor: "1F-D05", waitMin: 25 },
  "gucci": { name: "Gucci", floor: "1F-E08", waitMin: 20 },
  "古驰": { name: "Gucci", floor: "1F-E08", waitMin: 20 },
};

// ─── Queue venues database ───────────────────────────────────────────────────

const QUEUE_VENUES: Record<string, { name: string; floor: string; type: "dining" | "brand" | "cafe" }> = {
  "新荣记": { name: "新荣记", floor: "5F", type: "dining" },
  "大董": { name: "大董烤鸭", floor: "4F", type: "dining" },
  "flair": { name: "FLAIR 高端茶饮", floor: "4F", type: "cafe" },
  "chanel": { name: "Chanel 精品店", floor: "1F-A12", type: "brand" },
  "香奈儿": { name: "Chanel 精品店", floor: "1F-A12", type: "brand" },
  "hermes": { name: "Hermès", floor: "1F-B03", type: "brand" },
  "爱马仕": { name: "Hermès", floor: "1F-B03", type: "brand" },
  "hermès": { name: "Hermès", floor: "1F-B03", type: "brand" },
  "lv": { name: "Louis Vuitton", floor: "1F-C01", type: "brand" },
  "路易威登": { name: "Louis Vuitton", floor: "1F-C01", type: "brand" },
  "dior": { name: "Dior", floor: "1F-D05", type: "brand" },
  "迪奥": { name: "Dior", floor: "1F-D05", type: "brand" },
  "gucci": { name: "Gucci", floor: "1F-E08", type: "brand" },
  "古驰": { name: "Gucci", floor: "1F-E08", type: "brand" },
};

function parseQueueRequest(text: string): { venueKey: string; partySize: number } | null {
  // Match "帮我排/排一个 + 店铺 + X人位"
  const match = text.match(/(?:帮我排|排一个|帮我排队|排号|取号)[\s]?(.{1,10}?)[\s]?(\d)\s*人位?/);
  if (match) {
    const venue = match[1].trim().toLowerCase();
    const partySize = parseInt(match[2], 10);
    const venueKey = Object.keys(QUEUE_VENUES).find((k) =>
      venue.includes(k) || k.includes(venue)
    );
    if (venueKey) return { venueKey, partySize };
  }
  // Match without party size: "帮我排新荣记"
  const simpleMatch = text.match(/(?:帮我排|排一个|帮我排队|排号|取号)[\s]?(.{1,10}?)(?:的|$)/);
  if (simpleMatch) {
    const venue = simpleMatch[1].trim().toLowerCase();
    const venueKey = Object.keys(QUEUE_VENUES).find((k) =>
      venue.includes(k) || k.includes(venue)
    );
    if (venueKey) return { venueKey, partySize: 2 };
  }
  return null;
}

// ─── Parking helpers ─────────────────────────────────────────────────────────

function parseParkingLocation(text: string): { location: string; floor: string } | null {
  // Match B1-B9 floor patterns with a column/spot identifier
  const match = text.match(/(B(\d))\s*[-—–]*\s*([A-Za-z]?\d{1,3})/i);
  if (match) {
    return { floor: `B${match[2]}`, location: `${match[1].toUpperCase()}` };
  }
  // Match "地下X层" + column
  const floorMatch = text.match(/地下(\d)\s*层/);
  if (floorMatch) {
    const colMatch = text.match(/([A-Za-z]\d{1,3}|\d{2,3}号?)/);
    const col = colMatch ? colMatch[1].toUpperCase() : "";
    return { floor: `B${floorMatch[1]}`, location: col ? `B${floorMatch[1]}-${col}` : `B${floorMatch[1]}` };
  }
  // Match "停在" or "车在" with a location
  const stopMatch = text.match(/(?:停在|车在|停的?|车位)\s*([A-Za-z]?\d{1,3})/);
  if (stopMatch) {
    return { floor: "B2", location: stopMatch[1].toUpperCase() };
  }
  return null;
}

function calcParkingDuration(parkedAt: number): string {
  const diffMs = Date.now() - parkedAt;
  const totalMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}分钟`;
  return `${hours}小时${mins}分钟`;
}

function calcParkingFee(parkedAt: number): string {
  const diffMs = Date.now() - parkedAt;
  const totalMin = Math.max(1, Math.floor(diffMs / 60000));
  // SKP parking rate: 15元/小时, first 30min free, then per-hour billing
  const freeMin = 30;
  if (totalMin <= freeMin) return "0";
  const billableMin = totalMin - freeMin;
  const fee = Math.ceil(billableMin / 60) * 15;
  return fee.toString();
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [parkingInfo, setParkingInfo] = useState<ParkingInfo | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({ categories: [], brands: [], items: [] });
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Simulate queue progression (Demo: every 12s, one group ahead clears)
  const queueNotifiedRef = useRef<{ almost: boolean; ready: boolean }>({ almost: false, ready: false });
  useEffect(() => {
    if (!queueInfo || queueInfo.status === "ready") return;
    const interval = setInterval(() => {
      setQueueInfo((prev) => {
        if (!prev) return null;
        const newAhead = Math.max(0, prev.ahead - 1);
        const newEstMin = Math.max(0, newAhead * 8);
        const newStatus: QueueInfo["status"] = newAhead === 0 ? "ready" : newAhead <= 2 ? "almost" : "queuing";

        // Send notification messages on status change
        if (newStatus === "almost" && !queueNotifiedRef.current.almost) {
          queueNotifiedRef.current.almost = true;
          const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
          setMessages((p) => [...p, {
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
          }]);
        } else if (newStatus === "ready" && !queueNotifiedRef.current.ready) {
          queueNotifiedRef.current.ready = true;
          const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
          setMessages((p) => [...p, {
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
          }]);
        }

        return { ...prev, ahead: newAhead, estMin: newEstMin, status: newStatus };
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [queueInfo?.enrolledAt]);

  function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value) return;
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });

    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", text: value, time: now }]);
    setInput("");
    setIsTyping(true);

    // ─── Intent detection ───
    const isMembershipIntent = /入会|办卡|注册会员|成为会员|办理会员|申请会员/.test(value);
    const isMembershipInquiry = /有会员|会员吗|会员制度|怎么办会员|如何入会|怎么注册|会员卡|加入会员/.test(value);
    const parkingLocation = parseParkingLocation(value);
    const isParkingRecord = !!parkingLocation;
    const isParkingQuery = !isParkingRecord && /停车|车位|车停|车在|停车费|停车费多少|停了多久|停车时长/.test(value);

    // ─── Preference detection (categories / brands / items) ───
    const categoryMap: Record<string, string[]> = {
      "高奢腕表": ["腕表", "手表", "钟表", "手表皮具", "腕表皮具"],
      "皮具": ["皮具", "包包", "手袋", "箱包"],
      "美妆护肤": ["美妆", "护肤", "化妆品", "彩妆", "香水"],
      "先锋设计师": ["设计师", "潮牌", "先锋", "买手"],
      "珠宝首饰": ["珠宝", "首饰", "黄金", "钻石", "饰品"],
      "高端餐饮": ["餐饮", "美食", "餐厅", "吃饭", "下午茶", "咖啡"],
    };
    const matchedCategory = Object.entries(categoryMap).find(([, keywords]) =>
      keywords.some((kw) => value.includes(kw))
    )?.[0];

    // Brand keywords — luxury brands available at SKP
    const brandKeywords: Record<string, string> = {
      "Hermès": ["hermes", "爱马仕", "hermès"],
      "Chanel": ["chanel", "香奈儿"],
      "Louis Vuitton": ["louis vuitton", "lv", "路易威登"],
      "Dior": ["dior", "迪奥"],
      "Gucci": ["gucci", "古驰"],
      "Prada": ["prada", "普拉达"],
      "Cartier": ["cartier", "卡地亚"],
      "Bulgari": ["bulgari", "宝格丽"],
      "Van Cleef": ["van cleef", "梵克雅宝"],
      "Celine": ["celine", "思琳"],
      "Fendi": ["fendi", "芬迪"],
      "Bottega Veneta": ["bottega veneta", "bv", "葆蝶家"],
      "Loewe": ["loewe", "罗意威"],
      "Givenchy": ["givenchy", "纪梵希"],
      "Valentino": ["valentino", "华伦天奴"],
      "Saint Laurent": ["saint laurent", "ysl", "圣罗兰"],
      "Rolex": ["rolex", "劳力士"],
      "Omega": ["omega", "欧米茄"],
      "Patek Philippe": ["patek", "百达翡丽"],
      "La Mer": ["la mer", "海蓝之谜"],
      "SK-II": ["sk-ii", "skii", "sk2"],
      "Tom Ford": ["tom ford", "tf"],
    };
    const matchedBrands = Object.entries(brandKeywords)
      .filter(([, keywords]) => keywords.some((kw) => value.toLowerCase().includes(kw)))
      .map(([brand]) => brand);

    // Item / product type keywords
    const itemKeywords: Record<string, string[]> = {
      "丝巾": ["丝巾", "围巾", "披肩"],
      "手袋": ["手袋", "包", "包包", "手提包", "斜挎包"],
      "腕表": ["腕表", "手表", "表"],
      "珠宝": ["珠宝", "项链", "戒指", "耳环", "手镯", "胸针"],
      "香水": ["香水", "香氛"],
      "彩妆": ["彩妆", "口红", "唇膏", "粉底", "眼影"],
      "护肤": ["护肤", "面霜", "精华", "面膜"],
      "鞋履": ["鞋", "高跟鞋", "皮鞋", "运动鞋"],
      "成衣": ["成衣", "大衣", "西装", "外套", "连衣裙", "裙"],
      "家居": ["家居", "家居用品", "摆件", "烛台"],
    };
    const matchedItems = Object.entries(itemKeywords)
      .filter(([, keywords]) => keywords.some((kw) => value.includes(kw)))
      .map(([item]) => item);

    const hasPreference = matchedCategory || matchedBrands.length > 0 || matchedItems.length > 0;

    // Benefit-related queries that should trigger membership nudge (when user is not yet a member)
    const isBenefitQuery = /停车|停车费|优惠|折扣|折扣券|积分|权益|减免|免费/.test(value) && !isMembershipIntent;

    setTimeout(() => {
      setIsTyping(false);
      const agentTime = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });

      // ── 1. Preference collection (after onboarding) ──
      if (hasPreference && userProfile._justOnboarded) {
        const newCategories = matchedCategory && !userProfile.categories.includes(matchedCategory)
          ? [...userProfile.categories, matchedCategory]
          : userProfile.categories;
        const newBrands = [...new Set([...userProfile.brands, ...matchedBrands])];
        const newItems = [...new Set([...userProfile.items, ...matchedItems])];
        setUserProfile({ categories: newCategories, brands: newBrands, items: newItems, _justOnboarded: false });

        // Build preference summary text
        const preferenceParts: string[] = [];
        if (newCategories.length > 0) {
          const catList = newCategories.length > 1
            ? newCategories.slice(0, -1).join("、") + "和" + newCategories[newCategories.length - 1]
            : newCategories[0];
          preferenceParts.push(catList);
        }
        if (newBrands.length > 0) {
          const brandList = newBrands.length > 1
            ? newBrands.slice(0, -1).join("、") + "和" + newBrands[newBrands.length - 1]
            : newBrands[0];
          preferenceParts.push(brandList);
        }
        if (newItems.length > 0) {
          const itemList = newItems.length > 1
            ? newItems.slice(0, -1).join("、") + "和" + newItems[newItems.length - 1]
            : newItems[0];
          preferenceParts.push(itemList);
        }
        const preferenceText = preferenceParts.join("、");

        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: `好的，已记下您的偏好，包括${preferenceText}。后续有相关新品或活动，我会第一时间为您留意。\n\n如有其他需要，请随时告诉我。`,
            time: agentTime,
            quickReplies: ["今日专属优惠", "查询停车状态", "联系专属SA"],
          },
        ]);
        return;
      }

      // ── 2. Membership registration intent ──
      if (isMembershipIntent) {
        setUserProfile((prev) => ({ ...prev, _justOnboarded: true }));
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: "李先生，目前已经帮您办理完入会。您后续可以点击会员中心，进行会员信息查看，也可以随时问我会员信息。\n\n另外，为了更好地服务您，您可以把偏好告诉我，比如您喜欢的品类或近期关注的品牌，这样有相关信息时，我会第一时间为您推荐。",
            time: agentTime,
            quickReplies: ["高奢腕表皮具", "美妆护肤", "Hermès", "Chanel"],
            card: {
              type: "member-card",
              tier: "银卡会员",
              tierIcon: "◇",
              name: "李先生",
              cardNo: "SKP 2026 **** 88",
              points: "0",
              benefits: ["积分累计享双倍", "专属停车优惠", "生日礼遇"],
            },
          },
        ]);
        return;
      }

      // ── 3. Membership inquiry (general questions about membership) ──
      if (isMembershipInquiry) {
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: "李先生，SKP提供完善的会员体系，包含银卡、钻石、黑钻三个等级，会员可享受积分累计、专属停车优惠、生日礼遇等多项权益。\n\n目前入会还可享受当日停车费减免，是否需要为您办理入会？",
            time: agentTime,
            quickReplies: ["我想入会", "了解会员权益", "稍后再说"],
          },
        ]);
        return;
      }

      // ── 4. Queue enrollment ──
      const queueRequest = parseQueueRequest(value);
      if (queueRequest) {
        const venue = QUEUE_VENUES[queueRequest.venueKey];
        const queueNo = `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 90) + 10}`;
        const ahead = Math.floor(Math.random() * 6) + 3;
        const estMin = ahead * 8;
        const info: QueueInfo = {
          brand: venue.name,
          floor: venue.floor,
          partySize: queueRequest.partySize,
          queueNo,
          ahead,
          estMin,
          enrolledAt: Date.now(),
          status: "queuing",
        };
        setQueueInfo(info);
        queueNotifiedRef.current = { almost: false, ready: false };

        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: `李先生，已为您在${venue.name}（${venue.floor}）托管排队，${queueRequest.partySize}人位，取号${queueNo}。前方等候${ahead}组，预计约需${estMin}分钟。到号前我会提前提醒您，您可以在商场内自由逛逛。`,
            time: agentTime,
            quickReplies: ["查询排队进度", "今日专属优惠", "查询停车状态"],
            queueCard: {
              type: "queue-card",
              brand: venue.name,
              floor: venue.floor,
              partySize: queueRequest.partySize,
              queueNo,
              ahead,
              estMin,
              status: "queuing",
            },
          },
        ]);
        return;
      }

      // ── 5. Queue status query ──
      const isQueueQuery = /排队排到|排到了|排队进度|排队怎么样|排到哪|排队状态|我的排队|排队号/.test(value);
      if (isQueueQuery && queueInfo) {
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: queueInfo.status === "ready"
              ? `李先生，您在${queueInfo.brand}的排队已到号！请前往${queueInfo.floor}入座。`
              : queueInfo.status === "almost"
              ? `李先生，您在${queueInfo.brand}的排队即将到号，前方仅剩${queueInfo.ahead}组，请准备前往。`
              : `李先生，您在${queueInfo.brand}的排队正在进行中，前方还有${queueInfo.ahead}组等候，预计约需${queueInfo.estMin}分钟。`,
            time: agentTime,
            quickReplies: queueInfo.status === "ready"
              ? ["导航到店铺", "今日专属优惠"]
              : ["今日专属优惠", "查询停车状态"],
            queueCard: {
              type: "queue-card",
              brand: queueInfo.brand,
              floor: queueInfo.floor,
              partySize: queueInfo.partySize,
              queueNo: queueInfo.queueNo,
              ahead: queueInfo.ahead,
              estMin: queueInfo.estMin,
              status: queueInfo.status,
            },
          },
        ]);
        return;
      } else if (isQueueQuery && !queueInfo) {
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: "李先生，目前您还没有排队记录。您可以说\"帮我排一个新荣记3人位\"，我会为您托管排队并在到号时提醒您。",
            time: agentTime,
            quickReplies: ["帮我排新荣记", "帮我排Chanel", "今日专属优惠"],
          },
        ]);
        return;
      }

      // ── 6. Coupon & queue scenarios ──
      const lowerValue = value.toLowerCase();

      // 4a. Brand-specific queue inquiry → show queue time + cross-scene coupon
      const matchedQueueBrand = Object.entries(BRAND_QUEUE).find(([kw]) =>
        lowerValue.includes(kw) && /排队|等多|排多久|排队多久|人多人|要等多/.test(value)
      );
      if (matchedQueueBrand) {
        const info = matchedQueueBrand[1];
        const crossCoupon = info.waitMin >= 30
          ? COUPON_DB.find((c) => c.triggers.includes("__queue_coffee__"))
          : null;

        let text = `李先生，${info.name}（${info.floor}）当前排队约 ${info.waitMin} 分钟。`;
        if (info.waitMin >= 30 && crossCoupon) {
          text += `\n\n排队时间较长，建议您先去4F「${crossCoupon.brand}」歇歇脚，我已为您申请了一张${crossCoupon.discount}${crossCoupon.title}，现在去刚刚好。`;
        } else if (info.waitMin >= 15) {
          text += `\n\n如果您需要，我可以帮您托管排队，到号前通知您。`;
        }

        // In queue scenario, only push the cross-scene coupon (e.g. coffee), not brand/mall coupons
        const coupons: CouponCard[] = crossCoupon
          ? [{ type: "coupon-card", ...crossCoupon }]
          : [];

        const quickReplies = info.waitMin >= 30
          ? ["帮我托管排队", "查看FLAIR菜单", "看看丝巾库存"]
          : ["帮我托管排队", "今日专属优惠"];

        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text,
            time: agentTime,
            quickReplies,
            coupons: coupons.length > 0 ? coupons : undefined,
          },
        ]);
        return;
      }

      // 4b. Brand-specific coupon inquiry
      const matchedBrandCoupon = COUPON_DB.find((c) =>
        c.scope === "brand" && c.triggers.some((t) => lowerValue.includes(t)) &&
        /优惠券|券|优惠|折扣|打折|活动|促销/.test(value)
      );
      if (matchedBrandCoupon) {
        const mallCoupon = COUPON_DB.find((c) => c.scope === "mall" && c.discount === "9折");
        const coupons: CouponCard[] = [{ type: "coupon-card", ...matchedBrandCoupon }];
        if (mallCoupon) coupons.push({ type: "coupon-card", ...mallCoupon });

        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: `李先生，为您找到了${matchedBrandCoupon.brand}的专属优惠券，同时附上一张商场通用券供您使用。`,
            time: agentTime,
            quickReplies: ["查看更多优惠", "联系专属SA", "查询停车状态"],
            coupons,
          },
        ]);
        return;
      }

      // 4c. General coupon inquiry (no brand specified)
      const isCouponInquiry = /优惠券|有没有券|优惠|折扣|打折|活动|促销|发券|领券/.test(value) && !isMembershipIntent;
      if (isCouponInquiry) {
        const mallCoupons = COUPON_DB.filter((c) => c.scope === "mall");
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: "李先生，目前以下商场通用优惠券可供领取，您可以直接使用：",
            time: agentTime,
            quickReplies: ["Chanel有券吗", "Hermès有券吗", "查询停车状态"],
            coupons: mallCoupons.map((c) => ({ type: "coupon-card" as const, ...c })),
          },
        ]);
        return;
      }

      // ── 7. Benefit-related query (when not yet onboarded) → nudge toward membership ──
      if (isBenefitQuery && !userProfile._justOnboarded && userProfile.categories.length === 0 && !isCouponInquiry) {
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: "李先生，目前入会即可享受当日停车费减免等多重会员权益。是否需要为您办理入会？",
            time: agentTime,
            quickReplies: ["我想入会", "了解会员权益", "暂不需要"],
          },
        ]);
        return;
      }

      // ── 8. Parking location record ──
      if (isParkingRecord) {
        const info: ParkingInfo = {
          location: parkingLocation!.location,
          floor: parkingLocation!.floor,
          parkedAt: Date.now(),
        };
        setParkingInfo(info);
        const floorLabel = `${info.floor}层`;
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: `李先生，已为您记下停车位置：${floorLabel} ${info.location}。后续您随时询问停车信息，我会为您计算时长和费用。`,
            time: agentTime,
            quickReplies: ["查询停车状态", "积分抵扣停车费", "今日专属优惠"],
            parkingCard: {
              type: "parking-card",
              location: `${floorLabel} · ${info.location}`,
              floor: info.floor,
              duration: "0分钟",
              fee: "0",
              feeRate: "15元/小时 · 前30分钟免费",
            },
          },
        ]);
        return;
      }

      // ── 9. Parking status query (with record) ──
      if (isParkingQuery && parkingInfo) {
        const duration = calcParkingDuration(parkingInfo.parkedAt);
        const fee = calcParkingFee(parkingInfo.parkedAt);
        const floorLabel = `${parkingInfo.floor}层`;
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: `李先生，您的爱车目前停在${floorLabel} ${parkingInfo.location}，已停放${duration}。`,
            time: agentTime,
            quickReplies: ["积分抵扣停车费", "导航到车位", "今日专属优惠"],
            parkingCard: {
              type: "parking-card",
              location: `${floorLabel} · ${parkingInfo.location}`,
              floor: parkingInfo.floor,
              duration,
              fee,
              feeRate: "15元/小时 · 前30分钟免费",
            },
          },
        ]);
        return;
      }

      // ── 10. Parking status query (no record) ──
      if (isParkingQuery && !parkingInfo) {
        setMessages((p) => [
          ...p,
          {
            id: `a-${Date.now()}`,
            role: "agent",
            text: "李先生，目前还没有您的停车记录。您可以告诉我您的停车位置，例如\"我停在B2-D05\"，我会为您记录并计算费用。",
            time: agentTime,
            quickReplies: ["我停在B3-A12", "我停在B1-C08", "今日专属优惠"],
          },
        ]);
        return;
      }

      // ── 11. Default reply ──
      setMessages((p) => [
        ...p,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          text: "已收到您的需求，正在为您安排，请稍候片刻。如有任何进一步需求，请随时告知。",
          time: agentTime,
          quickReplies: ["查询停车状态", "今日专属优惠"],
        },
      ]);
    }, 1300);
  }

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "#D8D2C8" }}
    >
      {/* Phone shell */}
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
        {/* ── Status bar ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 pt-[52px] pb-2 relative z-20">
          <span className="text-[13px] font-semibold text-[#1A1713]">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[2px] items-end h-3">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: i < 3 ? "#1A1713" : "#1A171340" }} />
              ))}
            </div>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 3C10.2 3 12.2 3.9 13.6 5.4L15.1 3.8C13.3 2 10.8 1 8 1C5.2 1 2.7 2 0.9 3.8L2.4 5.4C3.8 3.9 5.8 3 8 3Z" fill="#1A1713"/>
              <path d="M8 6C9.5 6 10.8 6.6 11.8 7.6L13.3 6C11.9 4.7 10.1 4 8 4C5.9 4 4.1 4.7 2.7 6L4.2 7.6C5.2 6.6 6.5 6 8 6Z" fill="#1A1713"/>
              <circle cx="8" cy="10.5" r="1.5" fill="#1A1713"/>
            </svg>
            <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
              <rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="#1A1713" strokeOpacity=".35"/>
              <rect x="2" y="2" width="17" height="9" rx="2" fill="#1A1713"/>
              <path d="M24 4.5v4a2 2 0 0 0 0-4z" fill="#1A1713" fillOpacity=".4"/>
            </svg>
          </div>
        </div>

        {/* ── Header bar ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 pb-3 relative z-20"
        >
          <button className="w-8 h-8 flex items-center justify-center text-[#8C8278] text-lg">‹</button>
          <div className="flex items-center gap-2">
            <span
              className="text-[14px] tracking-[0.18em] text-[#1A1713]"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              SKP 私享管家
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center text-[#8C8278] text-sm">⊙</button>
            <button className="w-8 h-8 flex items-center justify-center text-[#8C8278] text-sm">···</button>
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div className="flex-shrink-0 flex items-center justify-center gap-1.5 pb-2 relative z-20">
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #B8924A30)" }} />
          <p className="text-[10px] tracking-[0.12em] text-[#8C8278]">下拉查看历史对话</p>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #B8924A30, transparent)" }} />
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            SCROLLABLE BODY
        ───────────────────────────────────────────────────────────────── */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {/* ── Hero zone ── */}
          <div
            className="relative w-full flex items-stretch overflow-hidden"
            style={{
              height: 172,
              background: "linear-gradient(110deg, #F0EBE1 0%, #EDE5D6 55%, #E2D8C8 100%)",
            }}
          >
            {/* Subtle texture lines */}
            <div className="absolute inset-0 opacity-[0.035]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, #8C6A2F 0px, #8C6A2F 1px, transparent 1px, transparent 18px)" }}
            />

            {/* Left — greeting text */}
            <div className="relative z-10 flex flex-col justify-center pl-5 pr-2 flex-1">
              <p className="text-[10px] tracking-[0.22em] text-[#B8924A] uppercase mb-2" style={{ letterSpacing: "0.2em" }}>
                SKP · 私享管家
              </p>
              <p
                className="text-[26px] leading-tight text-[#1A1713] mb-2"
                style={{ fontFamily: "'Cormorant', serif", fontWeight: 400 }}
              >
                您好，<br />李先生
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BA888] animate-pulse" />
                <span className="text-[10px] tracking-widest text-[#B8924A]">◆ 黑钻会员</span>
              </div>

              {/* Points inline */}
              <div
                className="mt-3 self-start px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,146,74,0.3)" }}
              >
                <span className="text-[9px] text-[#8C8278] tracking-wider mr-2">积分余额</span>
                <span className="text-[12px] text-[#B8924A]" style={{ fontFamily: "'DM Mono', monospace" }}>128,400</span>
              </div>
            </div>

            {/* Right — advisor photo, cropped to upper body */}
            <div className="relative flex-shrink-0" style={{ width: 196 }}>
              {/* Fade left edge into background */}
              <div className="absolute inset-y-0 left-0 w-16 z-10"
                style={{ background: "linear-gradient(to right, #EDE5D6, transparent)" }}
              />
              <img
                src="https://images.unsplash.com/photo-1774897795463-e6e4618a4997?w=300&h=400&fit=crop&crop=top&auto=format"
                alt="SKP专属顾问"
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(1.02)", objectPosition: "left 45% top" }}
              />
            </div>
          </div>

          {/* ── Feature entries (2-col grid) ── */}
          <div className="px-4 pt-4 pb-5 grid grid-cols-3 gap-2.5">
            {FEATURE_ENTRIES.map((f) => (
              <motion.button
                key={f.title}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2 px-2 py-3.5 text-center w-full transition-all duration-200 rounded-[8px]"
                style={{
                  background: f.accent
                    ? "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)"
                    : "#FFFFFF",
                  border: f.accent ? "1px solid #B8924A40" : "1px solid rgba(184,146,74,0.14)",
                  boxShadow: "0 1px 4px rgba(26,23,19,0.05)",
                }}
              >
                <div>
                  <p className="text-[12px] text-[#1A1713] mb-0.5" style={{ fontWeight: 500 }}>
                    {f.title}
                  </p>
                  <p className="text-[9px] text-[#8C8278] leading-tight">{f.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 px-5 mb-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #B8924A20)" }} />
            <span className="text-[9px] tracking-[0.22em] text-[#B8924A]/50 uppercase">对话记录</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #B8924A20, transparent)" }} />
          </div>

          {/* ── Chat messages ── */}
          <div className="px-4 space-y-5 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} onQuickReply={send} />
              ))}

              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5"
                >
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
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.div
                        key={i}
                        className="w-[5px] h-[5px] rounded-full"
                        style={{ background: "#B8924A60" }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
                        transition={{ duration: 1, delay: d, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* bottom padding for input bar */}
          <div className="h-24" />
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            FIXED BOTTOM INPUT BAR
        ───────────────────────────────────────────────────────────────── */}
        <div
          className="absolute bottom-0 inset-x-0 z-30"
          style={{
            background: "linear-gradient(to top, #F5F2ED 72%, rgba(245,242,237,0) 100%)",
            paddingTop: 20,
          }}
        >
          <div
            className="mx-4 mb-3 flex items-center gap-2.5 px-4 py-3 rounded-[24px]"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.2)",
              boxShadow: "0 2px 12px rgba(26,23,19,0.07)",
            }}
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

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-32 h-1 rounded-full" style={{ background: "rgba(26,23,19,0.15)" }} />
          </div>
        </div>

        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[37px] rounded-b-[20px] pointer-events-none z-30"
          style={{ background: "#D8D2C8" }}
        />
      </div>
    </div>
  );
}
