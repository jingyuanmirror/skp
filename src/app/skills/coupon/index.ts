import type { Skill } from "../../agent/types";
import type { CouponCard } from "../../types";

interface CouponDef {
  brand: string;
  discount: string;
  title: string;
  validUntil: string;
  scope: "mall" | "brand";
  triggers: string[];
}

const COUPON_DB: CouponDef[] = [
  { brand: "SKP", discount: "9折", title: "商场通用券", validUntil: "2026.07.31", scope: "mall", triggers: [] },
  { brand: "SKP", discount: "满2000减100", title: "全场满减券", validUntil: "2026.07.31", scope: "mall", triggers: [] },
  { brand: "Chanel", discount: "8.5折", title: "精品店专属券", validUntil: "2026.07.15", scope: "brand", triggers: ["chanel", "香奈儿"] },
  { brand: "Hermès", discount: "专属礼遇", title: "新品预览优先券", validUntil: "2026.08.31", scope: "brand", triggers: ["hermes", "爱马仕", "hermès"] },
  { brand: "Dior", discount: "满3000减300", title: "美妆与精品券", validUntil: "2026.07.31", scope: "brand", triggers: ["dior", "迪奥"] },
  { brand: "Gucci", discount: "9折", title: "当季精选券", validUntil: "2026.07.20", scope: "brand", triggers: ["gucci", "古驰"] },
  { brand: "Louis Vuitton", discount: "专属预览", title: "VIP新品预约券", validUntil: "2026.08.15", scope: "brand", triggers: ["louis vuitton", "lv", "路易威登"] },
  { brand: "Cartier", discount: "满5000减500", title: "高珠臻品券", validUntil: "2026.07.31", scope: "brand", triggers: ["cartier", "卡地亚"] },
  { brand: "La Mer", discount: "满1500减200", title: "护肤臻享券", validUntil: "2026.07.31", scope: "brand", triggers: ["la mer", "海蓝之谜"] },
];

const COUPON_QUERY = /优惠券|有没有券|优惠|折扣|打折|活动|促销|发券|领券/;

export const couponSkill: Skill = {
  name: "coupon",
  match: ({ text }) => {
    const lowerValue = text.toLowerCase();
    const matchedBrandCoupon = COUPON_DB.find(
      (coupon) =>
        coupon.scope === "brand"
        && coupon.triggers.some((trigger) => lowerValue.includes(trigger))
        && /优惠券|券|优惠|折扣|打折|活动|促销/.test(text),
    );

    return Boolean(matchedBrandCoupon) || COUPON_QUERY.test(text);
  },
  handle: ({ text }) => {
    const lowerValue = text.toLowerCase();
    const matchedBrandCoupon = COUPON_DB.find(
      (coupon) =>
        coupon.scope === "brand"
        && coupon.triggers.some((trigger) => lowerValue.includes(trigger))
        && /优惠券|券|优惠|折扣|打折|活动|促销/.test(text),
    );

    if (matchedBrandCoupon) {
      const mallCoupon = COUPON_DB.find((coupon) => coupon.scope === "mall" && coupon.discount === "9折");
      const coupons: CouponCard[] = [{ type: "coupon-card", ...matchedBrandCoupon }];
      if (mallCoupon) {
        coupons.push({ type: "coupon-card", ...mallCoupon });
      }

      return {
        text: `李先生，为您找到了${matchedBrandCoupon.brand}的专属优惠券，同时附上一张商场通用券供您使用。`,
        quickReplies: ["查看更多优惠", "联系专属SA", "查询停车状态"],
        coupons,
      };
    }

    const mallCoupons = COUPON_DB.filter((coupon) => coupon.scope === "mall");
    return {
      text: "李先生，目前以下商场通用优惠券可供领取，您可以直接使用：",
      quickReplies: ["Chanel有券吗", "Hermès有券吗", "查询停车状态"],
      coupons: mallCoupons.map((coupon) => ({ type: "coupon-card" as const, ...coupon })),
    };
  },
};
