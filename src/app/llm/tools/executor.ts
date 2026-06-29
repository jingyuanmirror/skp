import type { AgentSideEffects, SkillContext } from "../../agent/types";
import type { AppointmentCard, BrandCard, MemberCard, ParkingCard, CouponCard, QueueCard, ReservationCard } from "../../types";
import { skills } from "../../skills";

export interface ToolResult {
  data: unknown;
  sideEffects?: AgentSideEffects;
  card?: MemberCard;
  parkingCard?: ParkingCard;
  reservationCard?: ReservationCard;
  coupons?: CouponCard[];
  queueCard?: QueueCard;
  brandCards?: BrandCard[];
  appointmentCard?: AppointmentCard;
}

/**
 * Execute a tool call by finding the matching skill and calling handle().
 * Zero duplication — directly reuses existing skill logic.
 */
export function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  ctx: SkillContext,
): Promise<ToolResult> {
  // Find the skill by name
  const skill = skills.find((s) => s.name === toolName);
  if (!skill) {
    return Promise.resolve({ data: { error: `Unknown tool: ${toolName}` } });
  }

  // Build a modified context where text comes from the tool argument
  const toolCtx: SkillContext = {
    ...ctx,
    text: String(args.text ?? ""),
  };

  // Execute the skill's handle() directly
  return Promise.resolve(skill.handle(toolCtx)).then((response) => {
    if (!response) {
      return {
        data: { error: `Skill returned no result: ${toolName}` },
      };
    }

    return {
      data: {
        reply: response.text,
        quickReplies: response.quickReplies,
      },
      sideEffects: response.sideEffects,
      card: response.card,
      parkingCard: response.parkingCard,
      reservationCard: response.reservationCard,
      coupons: response.coupons,
      queueCard: response.queueCard,
      brandCards: response.brandCards,
      appointmentCard: response.appointmentCard,
    };
  });
}