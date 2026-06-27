import type { AgentResponse, SkillContext } from "./types";
import { skills } from "../skills";
import { chat } from "../llm/chat";
import { chatCompletion } from "../llm/client";
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
  const skillResponse = await routeBySkills(ctx);
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
async function routeBySkills(ctx: SkillContext): Promise<AgentResponse | null> {
  const targetSkillName = await classifySkillIntent(ctx.text);
  if (!targetSkillName) {
    return null;
  }

  const targetSkill = skills.find((skill) => skill.name === targetSkillName);
  if (!targetSkill) {
    return null;
  }

  return await targetSkill.handle(ctx);
}

async function classifySkillIntent(text: string): Promise<string | null> {
  const skillOptions = skills
    .map((skill) => `- ${skill.name}: ${skill.intentDescription}`)
    .join("\n");

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "你是意图路由器。根据用户输入，从候选skill中选出最合适的一项。\n"
        + "若都不适合，输出 NONE。\n"
        + "仅允许输出 skill 名称原文或 NONE，不要输出其他内容。\n"
        + `候选skill：\n${skillOptions}`,
    },
    {
      role: "user",
      content: text,
    },
  ];

  try {
    const result = await chatCompletion(messages, [], { onToken: () => {} });
    const raw = result.choices[0]?.message?.content?.trim() ?? "";
    if (!raw) {
      return null;
    }

    if (/^none$/i.test(raw)) {
      return null;
    }

    const normalized = raw.toLowerCase();
    const matched = skills
      .map((skill) => skill.name)
      .find((name) => normalized.includes(name));
    return matched ?? null;
  } catch (error) {
    console.warn("Intent classification failed:", error);
    return null;
  }
}