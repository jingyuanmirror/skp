import type { UserProfile } from "../types";

/**
 * 模拟用户画像 —— 用于开发调试活动推荐等个性化功能。
 * 李先生：黑钻会员，偏好 Gucci、Hermès、Dior，关注彩妆和皮具。
 */
export const SIMULATED_USER_PROFILE: UserProfile = {
  categories: ["美妆护肤", "皮具"],
  brands: ["Gucci", "Hermès", "Dior", "Chanel"],
  items: ["彩妆", "手袋", "香水"],
  isMember: false,
};