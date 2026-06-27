import type { Skill } from "../../agent/types";
import { buildPreferenceSummary, detectPreference } from "../../utils/preference";

const MEMBERSHIP_INQUIRY = /有会员吗|会员吗|会员服务|会员制度|会员权益|会员中心|怎么入会|如何入会|怎么办会员/;
const MEMBERSHIP_ENROLL_INTENT = /我想入会|我要入会|办会员|办理会员|开会员|加入会员|申请会员|现在入会|给我入会/;

function getTierLabel(memberTier: "silver" | "diamond" | "black" | undefined): string {
  if (memberTier === "diamond") return "钻石会员";
  if (memberTier === "black") return "黑钻会员";
  return "银卡会员";
}

export const membershipSkill: Skill = {
  name: "membership",
  intentDescription: "处理入会办理、会员权益咨询、会员等级说明，以及入会后偏好补充与档案更新。",
  match: () => true,
  handle: ({ text, userProfile }) => {
    const preference = detectPreference(text);

    if (preference.hasPreference && userProfile._justOnboarded) {
      const newCategories =
        preference.matchedCategory && !userProfile.categories.includes(preference.matchedCategory)
          ? [...userProfile.categories, preference.matchedCategory]
          : userProfile.categories;
      const newBrands = [...new Set([...userProfile.brands, ...preference.matchedBrands])];
      const newItems = [...new Set([...userProfile.items, ...preference.matchedItems])];

      return {
        text: `好的，已记下您的偏好，包括${buildPreferenceSummary({ categories: newCategories, brands: newBrands, items: newItems })}。后续有相关新品或活动，我会第一时间为您留意。\n\n如有其他需要，请随时告诉我。`,
        quickReplies: ["今日专属优惠", "查询停车状态", "联系专属SA"],
        sideEffects: {
          setUserProfile: () => ({
            categories: newCategories,
            brands: newBrands,
            items: newItems,
            isMember: true,
            memberTier: userProfile.memberTier ?? "silver",
            _justOnboarded: false,
          }),
        },
      };
    }

    if (userProfile.isMember) {
      if (MEMBERSHIP_INQUIRY.test(text)) {
        const tierLabel = getTierLabel(userProfile.memberTier);

        return {
          text: `是的，商场提供会员服务。李先生，您已经是我们的${tierLabel}了，可享积分累计、专属停车礼遇和生日礼遇等权益。`,
          quickReplies: ["查看会员权益", "升级条件", "查询停车状态"],
        };
      }

      return {
        text: "李先生，您当前会员状态正常。SKP会员体系包含银卡、钻石、黑钻等级，可享积分累计、专属停车礼遇、生日礼遇等权益。若您需要，我也可以为您进一步说明各等级差异。",
        quickReplies: ["查看会员权益", "升级条件", "查询停车状态"],
      };
    }

    if (MEMBERSHIP_ENROLL_INTENT.test(text)) {
      return {
        text: "李先生，目前已经帮您办理完入会。您后续可以点击会员中心，进行会员信息查看，也可以随时问我会员信息。\n\n另外，为了更好地服务您，您可以把偏好告诉我，比如您喜欢的品类或近期关注的品牌，这样有相关信息时，我会第一时间为您推荐。",
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
        sideEffects: {
          setUserProfile: (prev) => ({ ...prev, isMember: true, memberTier: prev.memberTier ?? "silver", _justOnboarded: true }),
        },
      };
    }

    return {
      text: "是的，商场提供会员服务。当前会员可享积分累计、专属停车礼遇、生日礼遇等权益。李先生，如您愿意，我可以立即为您办理入会。",
      quickReplies: ["我想入会", "了解会员权益", "入会后做什么"],
    };
  },
};
