import type { Message } from "../types";

export const INITIAL_MESSAGES: Message[] = [
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
