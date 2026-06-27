import type { ToolDefinition } from "../types";

/**
 * 5 tools — 1:1 对应 5 个 skill。
 * LLM 根据用户意图选择调用哪个 tool，tool 的参数直接传给 skill.handle()。
 */
export const toolDefinitions: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "parking",
      description:
        "处理停车相关事务。当用户提到停车位置（如'我停在B2-D05'）、查询停车状态/时长/费用、或需要停车帮助时调用。如果用户提供了停车位置则记录，如果只是询问则查询已记录的信息。",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "用户关于停车的原始表述，如'我停在B2-D05'或'停车费多少'",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "queue",
      description:
        "处理排队相关事务。当用户请求排队取号（如'帮我排新荣记3人位'、'帮我排Chanel'）或查询排队进度时调用。如果用户指定了店铺则排队取号，否则查询已有排队状态。",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "用户关于排队的原始表述，如'帮我排新荣记2人位'或'排队排到哪了'",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cross_sell",
      description:
        "查询品牌专柜排队等待时间并交叉推荐。当用户询问某个品牌排队要等多久时调用，如'Chanel排队多久'、'香奈儿排队长吗'。返回等待时长，较长时会附带推荐优惠券。",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "用户关于品牌排队的原始表述，如'Chanel排队多久'",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "coupon",
      description:
        "处理优惠券相关事务。当用户询问优惠、折扣、领券时调用。如果用户指定了品牌则返回品牌专属券，否则返回商场通用券。如'有券吗'、'Chanel有优惠吗'。",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "用户关于优惠的原始表述，如'有没有券'或'Chanel有券吗'",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "membership",
      description:
        "处理会员相关事务。当用户表达入会意愿（如'我想入会'）、询问会员信息（如'怎么办会员'）、查询会员权益、或入会后的偏好收集时调用。",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "用户关于会员的原始表述，如'我想入会'或'美妆护肤'",
          },
        },
        required: ["text"],
      },
    },
  },
];