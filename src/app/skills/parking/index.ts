import type { Skill } from "../../agent/types";
import { calcParkingDuration, calcParkingFee, parseParkingLocation } from "../../utils/parking";
import parkingBenefitsDoc from "../../data/membership-benefits.md?raw";

const PARKING_QUERY = /停车|车位|车停|车在|停车费|停车费多少|停了多久|停车时长/;
const PARKING_PRICING_QUERY = /怎么收费|收费标准|停车费|多少钱|价格|计费|收费规则/;

function getParkingBenefitMessageFromDoc(memberTier: "silver" | "diamond" | "black" | undefined): string | null {
  const tier = memberTier ?? "silver";
  const lines = parkingBenefitsDoc.split("\n");
  const targetPrefix = `- ${tier}:`;
  const line = lines.find((item) => item.trim().startsWith(targetPrefix));
  if (!line) return null;
  return line.replace(targetPrefix, "").trim();
}

export const parkingSkill: Skill = {
  name: "parking",
  match: ({ text }) => {
    const parkingLocation = parseParkingLocation(text);
    const isParkingRecord = Boolean(parkingLocation);
    const isParkingQuery = !isParkingRecord && PARKING_QUERY.test(text);
    return isParkingRecord || isParkingQuery;
  },
  handle: ({ text, parkingInfo, userProfile }) => {
    const parkingLocation = parseParkingLocation(text);
    const isParkingRecord = Boolean(parkingLocation);
    const isPricingQuery = PARKING_PRICING_QUERY.test(text);

    if (isParkingRecord) {
      const info = {
        location: parkingLocation!.location,
        floor: parkingLocation!.floor,
        parkedAt: Date.now(),
      };
      const floorLabel = `${info.floor}层`;

      return {
        text: `李先生，已为您记下停车位置：${floorLabel} ${info.location}。后续您随时询问停车信息，我会为您计算时长和费用。`,
        quickReplies: ["查询停车状态", "积分抵扣停车费", "今日专属优惠"],
        parkingCard: {
          type: "parking-card",
          location: `${floorLabel} · ${info.location}`,
          floor: info.floor,
          duration: "0分钟",
          fee: "0",
          feeRate: "15元/小时 · 前30分钟免费",
        },
        sideEffects: {
          parkingInfo: info,
        },
      };
    }

    if (parkingInfo) {
      const duration = calcParkingDuration(parkingInfo.parkedAt);
      const fee = calcParkingFee(parkingInfo.parkedAt);
      const floorLabel = `${parkingInfo.floor}层`;
      const parkingBenefitMessage = userProfile.isMember
        ? getParkingBenefitMessageFromDoc(userProfile.memberTier)
        : null;
      const hasMembershipBenefit = Boolean(parkingBenefitMessage);

      const textWithBenefit = hasMembershipBenefit
        ? `李先生，您的爱车目前停在${floorLabel} ${parkingInfo.location}，已停放${duration}。\n\n${parkingBenefitMessage}`
        : `李先生，您的爱车目前停在${floorLabel} ${parkingInfo.location}，已停放${duration}。\n\n您当前还不是会员，入会后可享停车减免与积分抵扣等停车权益，是否需要我现在为您办理入会？`;

      return {
        text: textWithBenefit,
        quickReplies: hasMembershipBenefit
          ? ["积分抵扣停车费", "导航到车位", "今日专属优惠"]
          : ["我想入会", "了解会员权益", "导航到车位"],
        parkingCard: {
          type: "parking-card",
          location: `${floorLabel} · ${parkingInfo.location}`,
          floor: parkingInfo.floor,
          duration,
          fee,
          feeRate: "15元/小时 · 前30分钟免费",
        },
      };
    }

    if (isPricingQuery) {
      const parkingBenefitMessage = userProfile.isMember
        ? getParkingBenefitMessageFromDoc(userProfile.memberTier)
        : null;

      const benefitText = parkingBenefitMessage
        ? `\n\n${parkingBenefitMessage}`
        : "\n\n您当前还不是会员，入会后可享停车减免与积分抵扣等权益。";

      return {
        text: `李先生，商场停车收费标准为：前30分钟免费，之后15元/小时，不足1小时按1小时计费。${benefitText}`,
        quickReplies: userProfile.isMember
          ? ["查询停车状态", "积分抵扣停车费", "我停在B2-D05"]
          : ["我想入会", "会员停车权益", "我停在B2-D05"],
      };
    }

    return {
      text: "李先生，目前还没有您的停车记录。您可以告诉我您的停车位置，例如\"我停在B2-D05\"，我会为您记录并计算费用。",
      quickReplies: ["我停在B3-A12", "我停在B1-C08", "今日专属优惠"],
    };
  },
};
