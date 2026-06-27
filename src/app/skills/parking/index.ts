import type { Skill } from "../../agent/types";
import { calcParkingDuration, calcParkingFee, parseParkingLocation } from "../../utils/parking";

const PARKING_QUERY = /停车|车位|车停|车在|停车费|停车费多少|停了多久|停车时长/;

export const parkingSkill: Skill = {
  name: "parking",
  match: ({ text }) => {
    const parkingLocation = parseParkingLocation(text);
    const isParkingRecord = Boolean(parkingLocation);
    const isParkingQuery = !isParkingRecord && PARKING_QUERY.test(text);
    return isParkingRecord || isParkingQuery;
  },
  handle: ({ text, parkingInfo }) => {
    const parkingLocation = parseParkingLocation(text);
    const isParkingRecord = Boolean(parkingLocation);

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

      return {
        text: `李先生，您的爱车目前停在${floorLabel} ${parkingInfo.location}，已停放${duration}。`,
        quickReplies: ["积分抵扣停车费", "导航到车位", "今日专属优惠"],
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

    return {
      text: "李先生，目前还没有您的停车记录。您可以告诉我您的停车位置，例如\"我停在B2-D05\"，我会为您记录并计算费用。",
      quickReplies: ["我停在B3-A12", "我停在B1-C08", "今日专属优惠"],
    };
  },
};
