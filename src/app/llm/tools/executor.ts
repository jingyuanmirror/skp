import type { AgentSideEffects, SkillContext } from "../../agent/types";
import type { MemberCard, ParkingCard, CouponCard, QueueCard } from "../../types";
import { skills } from "../../skills";

export interface ToolResult {
  data: unknown;
  sideEffects?: AgentSideEffects;
  card?: MemberCard;
  parkingCard?: ParkingCard;
  coupons?: CouponCard[];
  queueCard?: QueueCard;
}

/**
 * Execute a tool call by finding the matching skill and calling handle().
 * Zero duplication — directly reuses existing skill logic.
 */
export function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  ctx: SkillContext,
): ToolResult {
  // Find the skill by name
  const skill = skills.find((s) => s.name === toolName);
  if (!skill) {
    return { data: { error: `Unknown tool: ${toolName}` } };
  }

  // Build a modified context where text comes from the tool argument
  const toolCtx: SkillContext = {
    ...ctx,
    text: String(args.text ?? ""),
  };

  // Execute the skill's handle() directly
  const response = skill.handle(toolCtx);

  return {
    data: {
      reply: response.text,
      quickReplies: response.quickReplies,
    },
    sideEffects: response.sideEffects,
    card: response.card,
    parkingCard: response.parkingCard,
    coupons: response.coupons,
    queueCard: response.queueCard,
  };
}