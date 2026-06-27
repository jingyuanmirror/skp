import type { Skill } from "../../agent/types";
import { parseQueueRequest, QUEUE_VENUES } from "../../utils/queue";
import type { QueueInfo } from "../../types";

const QUEUE_QUERY = /排队排到|排到了|排队进度|排队怎么样|排到哪|排队状态|我的排队|排队号/;

function createQueueNo() {
  return `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 90) + 10}`;
}

export const queueSkill: Skill = {
  name: "queue",
  match: ({ text }) => Boolean(parseQueueRequest(text)) || QUEUE_QUERY.test(text),
  handle: ({ text, queueInfo }) => {
    const queueRequest = parseQueueRequest(text);

    if (queueRequest) {
      const venue = QUEUE_VENUES[queueRequest.venueKey];
      const queueNo = createQueueNo();
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

      return {
        text: `李先生，已为您在${venue.name}（${venue.floor}）托管排队，${queueRequest.partySize}人位，取号${queueNo}。前方等候${ahead}组，预计约需${estMin}分钟。到号前我会提前提醒您，您可以在商场内自由逛逛。`,
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
        sideEffects: {
          queueInfo: info,
          resetQueueNotified: true,
        },
      };
    }

    if (queueInfo) {
      return {
        text:
          queueInfo.status === "ready"
            ? `李先生，您在${queueInfo.brand}的排队已到号！请前往${queueInfo.floor}入座。`
            : queueInfo.status === "almost"
              ? `李先生，您在${queueInfo.brand}的排队即将到号，前方仅剩${queueInfo.ahead}组，请准备前往。`
              : `李先生，您在${queueInfo.brand}的排队正在进行中，前方还有${queueInfo.ahead}组等候，预计约需${queueInfo.estMin}分钟。`,
        quickReplies: queueInfo.status === "ready" ? ["导航到店铺", "今日专属优惠"] : ["今日专属优惠", "查询停车状态"],
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
      };
    }

    return {
      text: "李先生，目前您还没有排队记录。您可以说\"帮我排一个新荣记3人位\"，我会为您托管排队并在到号时提醒您。",
      quickReplies: ["帮我排新荣记", "帮我排Chanel", "今日专属优惠"],
    };
  },
};
