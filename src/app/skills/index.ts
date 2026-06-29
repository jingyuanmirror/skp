import type { Skill } from "../agent/types";
import { appointmentSkill } from "./appointment";
import { queueSkill } from "./queue";
import { crossSellSkill } from "./cross-sell";
import { couponSkill } from "./coupon";
import { serviceQASkill } from "./service-qa";
import { membershipSkill } from "./membership";
import { parkingSkill } from "./parking";
import { activityRecommendSkill } from "./activity-recommend";
import { storeConsultSkill } from "./store-consult";

export const skills: Skill[] = [
  appointmentSkill,
  queueSkill,
  crossSellSkill,
  couponSkill,
  membershipSkill,
  parkingSkill,
  storeConsultSkill,
  serviceQASkill,
  activityRecommendSkill,
];
