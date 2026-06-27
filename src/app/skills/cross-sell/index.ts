import type { Skill } from "../../agent/types";
import type { CouponCard } from "../../types";

const BRAND_QUEUE: Record<string, { name: string; floor: string; waitMin: number }> = {
  chanel: { name: "Chanel 精品店", floor: "1F-A12", waitMin: 60 },
  "香奈儿": { name: "Chanel 精品店", floor: "1F-A12", waitMin: 60 },
  hermes: { name: "Hermès", floor: "1F-B03", waitMin: 45 },
  "爱马仕": { name: "Hermès", floor: "1F-B03", waitMin: 45 },
  "hermès": { name: "Hermès", floor: "1F-B03", waitMin: 45 },
  lv: { name: "Louis Vuitton", floor: "1F-C01", waitMin: 30 },
  "louis vuitton": { name: "Louis Vuitton", floor: "1F-C01", waitMin: 30 },
  "路易威登": { name: "Louis Vuitton", floor: "1F-C01", waitMin: 30 },
  dior: { name: "Dior", floor: "1F-D05", waitMin: 25 },
  "迪奥": { name: "Dior", floor: "1F-D05", waitMin: 25 },
  gucci: { name: "Gucci", floor: "1F-E08", waitMin: 20 },
  "古驰": { name: "Gucci", floor: "1F-E08", waitMin: 20 },
};

const CROSS_SELL_COFFEE = {
  brand: "FLAIR 高端茶饮",
  discount: "8.5折",
  title: "会员专属咖啡券",
  validUntil: "2026.07.31",
  scope: "brand",
};

const QUEUE_ASK = /排队|等多|排多久|排队多久|人多人|要等多/;

export const crossSellSkill: Skill = {
  name: "cross-sell",
  match: ({ text }) => {
    const lowerValue = text.toLowerCase();
    return Object.keys(BRAND_QUEUE).some((keyword) => lowerValue.includes(keyword) && QUEUE_ASK.test(text));
  },
  handle: ({ text }) => {
    const lowerValue = text.toLowerCase();
    const matched = Object.entries(BRAND_QUEUE).find(([keyword]) => lowerValue.includes(keyword) && QUEUE_ASK.test(text));

    if (!matched) {
      return {
        text: "已收到您的需求，正在为您安排，请稍候片刻。如有任何进一步需求，请随时告知。",
        quickReplies: ["查询停车状态", "今日专属优惠"],
      };
    }

    const info = matched[1];
    const crossCoupon = info.waitMin >= 30 ? ({ type: "coupon-card", ...CROSS_SELL_COFFEE } as CouponCard) : null;

    let textReply = `李先生，${info.name}（${info.floor}）当前排队约 ${info.waitMin} 分钟。`;
    if (info.waitMin >= 30 && crossCoupon) {
      textReply += `\n\n排队时间较长，建议您先去4F「${crossCoupon.brand}」歇歇脚，我已为您申请了一张${crossCoupon.discount}${crossCoupon.title}，现在去刚刚好。`;
    } else if (info.waitMin >= 15) {
      textReply += "\n\n如果您需要，我可以帮您托管排队，到号前通知您。";
    }

    return {
      text: textReply,
      quickReplies: info.waitMin >= 30 ? ["帮我托管排队", "查看FLAIR菜单", "看看丝巾库存"] : ["帮我托管排队", "今日专属优惠"],
      coupons: crossCoupon ? [crossCoupon] : undefined,
    };
  },
};
