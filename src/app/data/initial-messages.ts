import type { Message } from "../types";

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "a1",
    role: "agent",
    text: "尊敬的李先生，下午好。我是您专属的SKP管家助手，随时为您提供商场导览、智能停车、专属权益及私享顾问服务。\n\n今日 Hermès（1F-B03）已到本季新品，是否需要为您安排专属顾问试看？",
    time: "15:28",
    quickReplies: ["查询停车状态", "今日专属优惠", "推荐今日活动", "联系专属SA"],
  },
];
