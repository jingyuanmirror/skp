import type { CouponCard, MemberCard, ParkingCard, ParkingInfo, QueueCard, QueueInfo, UserProfile } from "../types";

export interface SkillContext {
  text: string;
  userProfile: UserProfile;
  parkingInfo: ParkingInfo | null;
  queueInfo: QueueInfo | null;
}

export interface AgentSideEffects {
  setUserProfile?: (prev: UserProfile) => UserProfile;
  parkingInfo?: ParkingInfo | null;
  queueInfo?: QueueInfo | null;
  resetQueueNotified?: boolean;
}

export interface AgentResponse {
  text: string;
  quickReplies?: string[];
  card?: MemberCard;
  parkingCard?: ParkingCard;
  coupons?: CouponCard[];
  queueCard?: QueueCard;
  sideEffects?: AgentSideEffects;
}

export interface Skill {
  name: string;
  intentDescription: string;
  match: (ctx: SkillContext) => boolean;
  handle: (ctx: SkillContext) => AgentResponse | null | Promise<AgentResponse | null>;
}
