import type { AppointmentCard, AppointmentInfo, BrandCard, CouponCard, MemberCard, ParkingCard, ParkingInfo, ParkingReservation, QueueCard, QueueInfo, ReservationCard, UserProfile } from "../types";

export interface SkillContext {
  text: string;
  userProfile: UserProfile;
  parkingInfo: ParkingInfo | null;
  parkingReservation: ParkingReservation | null;
  queueInfo: QueueInfo | null;
  appointmentInfo: AppointmentInfo | null;
}

export interface AgentSideEffects {
  setUserProfile?: (prev: UserProfile) => UserProfile;
  parkingInfo?: ParkingInfo | null;
  parkingReservation?: ParkingReservation | null;
  queueInfo?: QueueInfo | null;
  resetQueueNotified?: boolean;
  appointmentInfo?: AppointmentInfo | null;
}

export interface AgentResponse {
  text: string;
  quickReplies?: string[];
  card?: MemberCard;
  parkingCard?: ParkingCard;
  reservationCard?: ReservationCard;
  coupons?: CouponCard[];
  queueCard?: QueueCard;
  brandCards?: BrandCard[];
  appointmentCard?: AppointmentCard;
  sideEffects?: AgentSideEffects;
}

export interface Skill {
  name: string;
  intentDescription: string;
  match: (ctx: SkillContext) => boolean;
  handle: (ctx: SkillContext) => AgentResponse | null | Promise<AgentResponse | null>;
}
