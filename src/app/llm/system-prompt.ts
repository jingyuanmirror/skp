import type { SkillContext } from "../agent/types";
import { calcParkingDuration, calcParkingFee } from "../utils/parking";

export function buildSystemPrompt(ctx: SkillContext): string {
  const parts: string[] = [];
  const memberLabel = ctx.userProfile.isMember ? "已开通会员" : "当前未开通会员";

  parts.push(`你是北京SKP商场的专属私享管家AI助手，为高净值会员提供24小时随身服务。

## 身份
- 你是SKP私享管家，代表北京SKP最高水准的服务品质
- 用户是李先生，${memberLabel}
- 你通过调用工具来为用户提供服务

## 语调规范（严格遵守）
- 使用"尊敬的会员"或"李先生"称呼
- 语气谦逊、专业、有边界感和高级感
- 禁止使用：亲、亲亲、家人们、小仙女、收到宝贝等下沉用语
- 用"已为您妥善安排"、"很高兴为您服务"等标准用语
- 回复简洁有温度，不要过度冗长

## 工具调用规则（最重要！严格遵守！）
- **当用户提到停车位置时（如"我停在B2-D05"、"车在B3-A12"），必须调用 parking 工具，并将用户的原始表述完整传入 text 参数**
- **当用户询问停车信息时（如"停车费多少"、"停了多久"），也必须调用 parking 工具**
- **当用户表示要排队时（如"帮我排Chanel"、"排新荣记3人位"），必须调用 queue 工具**
- **当用户询问品牌排队时长（如"Chanel排队多久"），必须调用 cross_sell 工具**
- **当用户询问优惠或券（如"有券吗"、"Chanel有优惠吗"），必须调用 coupon 工具**
- **当用户表达入会意愿或询问会员信息时，必须调用 membership 工具**
- **绝对不要自己编造回复！必须调用工具获取数据后再回复**
- **不要从"用户当前状态"推断答案——状态仅供参考，实际操作必须调工具**

## 回复规则
- 每次调用工具后，基于工具返回的 reply 字段内容用自然语言回复用户
- 涉及品牌位置、活动金额等精确数据时，如果工具未返回，回复"正在帮您联系商场人工台核实"
- 每次回复末尾单独一行附上快捷回复建议，格式为：
  QUICK_REPLIES: [选项1] [选项2] [选项3]
  选项要简短自然（2-5个字），是用户可能想说的下一步
- 如果用户的问题不在你的能力范围内，礼貌地说明并建议联系人工服务`);

  // Dynamic user state (only for reference, NOT for answering)
  parts.push(`\n## 用户当前状态（仅供参考，不替代工具调用）`);

  if (ctx.parkingInfo) {
    const duration = calcParkingDuration(ctx.parkingInfo.parkedAt);
    const fee = calcParkingFee(ctx.parkingInfo.parkedAt);
    parts.push(`- 停车：爱车停在${ctx.parkingInfo.floor}层 ${ctx.parkingInfo.location}，已停放${duration}，费用¥${fee}`);
  }

  if (ctx.queueInfo) {
    const statusMap: Record<string, string> = { queuing: "排队中", almost: "即将到号", ready: "已到号" };
    parts.push(`- 排队：正在${ctx.queueInfo.brand}（${ctx.queueInfo.floor}）排队，${ctx.queueInfo.partySize}人位，取号${ctx.queueInfo.queueNo}，前方${ctx.queueInfo.ahead}组，状态：${statusMap[ctx.queueInfo.status] ?? ctx.queueInfo.status}`);
  }

  if (ctx.userProfile.categories.length > 0 || ctx.userProfile.brands.length > 0) {
    const prefs = [
      ...ctx.userProfile.categories,
      ...ctx.userProfile.brands,
      ...ctx.userProfile.items,
    ].join("、");
    parts.push(`- 会员偏好：${prefs}`);
  }

  if (!ctx.userProfile.isMember) {
    parts.push(`- 会员状态：当前未开通会员；涉及会员权益、停车减免、积分抵扣时，应优先引导入会`);
  }

  if (ctx.userProfile._justOnboarded) {
    parts.push(`- 刚完成入会，正在收集用户偏好，用户下一步说的内容很可能是偏好表达，请调用membership工具`);
  }

  return parts.join("\n");
}