import type { Skill } from "../../agent/types";
import { buildPreferenceSummary, detectPreference } from "../../utils/preference";

const MEMBERSHIP_INTENT = /入会|办卡|注册会员|成为会员|办理会员|申请会员/;
const MEMBERSHIP_INQUIRY = /有会员|会员吗|会员制度|怎么办会员|如何入会|怎么注册|会员卡|加入会员/;
const BENEFIT_QUERY = /折扣|积分|权益|减免|免费/;

export const membershipSkill: Skill = {
  name: "membership",
  match: ({ text, userProfile }) => {
    const preference = detectPreference(text);
    const isCouponLike = /优惠券|领券|券/.test(text);

    return (
      MEMBERSHIP_INTENT.test(text)
      || MEMBERSHIP_INQUIRY.test(text)
      || (preference.hasPreference && Boolean(userProfile._justOnboarded))
      || (BENEFIT_QUERY.test(text) && !isCouponLike && !Boolean(userProfile._justOnboarded) && userProfile.categories.length === 0)
    );
  },
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
            _justOnboarded: false,
          }),
        },
      };
    }

    if (MEMBERSHIP_INTENT.test(text)) {
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
          setUserProfile: (prev) => ({ ...prev, _justOnboarded: true }),
        },
      };
    }

    if (MEMBERSHIP_INQUIRY.test(text)) {
      return {
        text: "李先生，SKP提供完善的会员体系，包含银卡、钻石、黑钻三个等级，会员可享受积分累计、专属停车优惠、生日礼遇等多项权益。\n\n目前入会还可享受当日停车费减免，是否需要为您办理入会？",
        quickReplies: ["我想入会", "了解会员权益", "稍后再说"],
      };
    }

    return {
      text: "李先生，目前入会即可享受当日停车费减免等多重会员权益。是否需要为您办理入会？",
      quickReplies: ["我想入会", "了解会员权益", "暂不需要"],
    };
  },
};
