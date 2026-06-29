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

export interface BrandCard {
  type: "brand-card";
  brand: string;
  floor: string;
  categories: string[];
  highlight: string;
  tag?: string;
}

export interface AppointmentInfo {
  type: "appointment";
  brand: string;
  floor: string;
  timeSlot: string;
  appointmentTime: number;
  saName: string;
  reservationId: string;
  status: "confirmed" | "cancelled" | "completed";
  flowStatus?: "selecting_slot";
}

export interface AppointmentCard {
  type: "appointment-card";
  brand: string;
  floor: string;
  timeSlot: string;
  saName: string;
  reservationId: string;
  status: "confirmed" | "cancelled" | "completed";
  statusLabel: string;
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
  brandCards?: BrandCard[];
  reservationCard?: ReservationCard;
  appointmentCard?: AppointmentCard;
  streaming?: boolean;
}

export interface ParkingInfo {
  location: string;
  floor: string;
  parkedAt: number;
}

export interface ParkingReservation {
  floor: string;
  spotId: string;
  plateNumber?: string;
  reservationId?: string;
  reservedAt?: number;
  status: "collecting_plate" | "confirmed";
}

export interface ReservationCard {
  type: "reservation-card";
  spotId: string;
  floor: string;
  plateNumber: string;
  reservationId: string;
  status: "confirmed";
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

export interface EnrollmentForm {
  name?: string;
  gender?: string;
  idNumber?: string;
  city?: string;
  address?: string;
}

export interface UserProfile {
  categories: string[];
  brands: string[];
  items: string[];
  isMember?: boolean;
  memberTier?: "silver" | "diamond" | "black";
  _justOnboarded?: boolean;
  _enrollmentForm?: EnrollmentForm;
}

export interface FeatureEntry {
  icon: string;
  title: string;
  sub: string;
  accent: boolean;
}
