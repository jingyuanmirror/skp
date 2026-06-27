import type { AgentResponse, SkillContext } from "./types";
import { skills } from "../skills";
import { chat } from "../llm/chat";
import type { ChatMessage } from "../llm/types";

/** Shared conversation history across turns */
let llmHistory: ChatMessage[] = [];

/** Reset LLM conversation history (e.g. on app re-mount) */
export function resetLLMHistory() {
  llmHistory = [];
}

/**
 * Main routing function — skill first, LLM fallback.
 * If any skill matches, return skill result directly.
 * Only when no skill matches will it call LLM.
 */
export async function route(
  ctx: SkillContext,
  onToken?: (token: string) => void,
): Promise<AgentResponse> {
  const skillResponse = routeBySkills(ctx);
  if (skillResponse) {
    return skillResponse;
  }

  try {
    const { response, newMessages } = await chat(
      ctx.text,
      ctx,
      llmHistory,
      onToken ?? (() => {}),
    );

    // Append new messages to persistent history
    llmHistory = [...llmHistory, ...newMessages].slice(-30);

    return response;
  } catch (error) {
    console.warn("LLM unavailable, falling back to default reply:", error);
    return {
      text: "已收到您的需求，正在为您安排，请稍候片刻。如有任何进一步需求，请随时告知。",
      quickReplies: ["查询停车状态", "今日专属优惠"],
    };
  }
}

/**
 * Skill router — first-match-wins over registered skills.
 */
function routeBySkills(ctx: SkillContext): AgentResponse | null {
  for (const skill of skills) {
    if (skill.match(ctx)) {
      return skill.handle(ctx);
    }
  }
  return null;
}