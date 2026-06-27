import type { Skill } from "../agent/types";
import { queueSkill } from "./queue";
import { crossSellSkill } from "./cross-sell";
import { couponSkill } from "./coupon";
import { serviceQASkill } from "./service-qa";
import { membershipSkill } from "./membership";
import { parkingSkill } from "./parking";

export const skills: Skill[] = [
  queueSkill,
  crossSellSkill,
  couponSkill,
  membershipSkill,
  parkingSkill,
  serviceQASkill,
];
