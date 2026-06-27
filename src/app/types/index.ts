export interface MemberCard {
  type: "member-card";
  tier: string;
  tierIcon: string;
  name: string;
  cardNo: string;
  points: string;
  benefits: string[];
}

export interface ParkingCard {
  type: "parking-card";
  location: string;
  floor: string;
  duration: string;
  fee: string;
  feeRate: string;
}

export interface CouponCard {
  type: "coupon-card";
  brand: string;
  discount: string;
  title: string;
  validUntil: string;
  scope: string;
}

export interface QueueCard {
  type: "queue-card";
  brand: string;
  floor: string;
  partySize: number;
  queueNo: string;
  ahead: number;
  estMin: number;
  status: "queuing" | "almost" | "ready";
}

export interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
  card?: MemberCard;
  parkingCard?: ParkingCard;
  coupons?: CouponCard[];
  queueCard?: QueueCard;
  streaming?: boolean;
}

export interface ParkingInfo {
  location: string;
  floor: string;
  parkedAt: number;
}

export interface QueueInfo {
  brand: string;
  floor: string;
  partySize: number;
  queueNo: string;
  ahead: number;
  estMin: number;
  enrolledAt: number;
  status: "queuing" | "almost" | "ready";
}

export interface UserProfile {
  categories: string[];
  brands: string[];
  items: string[];
  isMember?: boolean;
  memberTier?: "silver" | "diamond" | "black";
  _justOnboarded?: boolean;
}

export interface FeatureEntry {
  icon: string;
  title: string;
  sub: string;
  accent: boolean;
}
