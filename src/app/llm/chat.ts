import type { AgentResponse, SkillContext } from "../agent/types";
import type { ChatMessage, ToolCall } from "./types";
import { chatCompletion } from "./client";
import { buildSystemPrompt } from "./system-prompt";
import { toolDefinitions } from "./tools/definitions";
import { executeTool, ToolResult } from "./tools/executor";

/** Max turns of tool-calling loops before forcing stop */
const MAX_TOOL_ROUNDS = 5;

/** Convert app messages to OpenAI chat format (sliding window) */
export function buildChatHistory(
  appMessages: Array<{ role: "agent" | "user"; text: string; streaming?: boolean }>,
  windowSize = 20,
): ChatMessage[] {
  // Filter out streaming messages and take the most recent
  const recent = appMessages
    .filter((m) => !m.streaming)
    .slice(-windowSize);

  return recent.map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.text,
  }));
}

/** Extract QUICK_REPLIES from LLM response text, returning [cleaned text, replies] */
function extractQuickReplies(text: string): { text: string; quickReplies?: string[] } {
  const match = text.match(/QUICK_REPLIES:\s*\[(.+?)\](?:\s*\[(.+?)\])?(?:\s*\[(.+?)\])?(?:\s*\[(.+?)\])?/);
  if (!match) return { text };

  const replies = [match[1], match[2], match[3], match[4]]
    .filter(Boolean)
    .map((r) => r.trim());

  // Remove the QUICK_REPLIES line from displayed text
  const cleaned = text.replace(/\n?QUICK_REPLIES:.+$/, "").trim();
  return { text: cleaned, quickReplies: replies.length > 0 ? replies : undefined };
}

/**
 * Core orchestrator: send user message to LLM, handle tool calls,
 * loop until the LLM produces a final text response,
 * then compile into AgentResponse.
 */
export async function chat(
  userText: string,
  ctx: SkillContext,
  history: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<{ response: AgentResponse; newMessages: ChatMessage[] }> {
  const systemPrompt = buildSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userText },
  ];

  // Accumulate side effects and cards from all tool calls in this turn
  const collectedSideEffects: Partial<AgentSideEffects> = {};
  let collectedCard: AgentResponse["card"] = undefined;
  let collectedParkingCard: AgentResponse["parkingCard"] = undefined;
  let collectedCoupons: AgentResponse["coupons"] = undefined;
  let collectedQueueCard: AgentResponse["queueCard"] = undefined;

  const newMessages: ChatMessage[] = [{ role: "user", content: userText }];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const result = await chatCompletion(messages, toolDefinitions, { onToken }, signal);

    const choice = result.choices[0];
    console.log(`[LLM] round=${round} finish_reason=${choice.finish_reason} content=${choice.message.content} tool_calls=${JSON.stringify(choice.message.tool_calls)}`);
    const assistantMessage = choice.message;

    // Add assistant message to history
    const assistantChatMsg: ChatMessage = {
      role: "assistant",
      content: assistantMessage.content,
      tool_calls: assistantMessage.tool_calls,
    };
    messages.push(assistantChatMsg);
    newMessages.push(assistantChatMsg);

    // If no tool calls, we're done
    if (choice.finish_reason !== "tool_calls" || !assistantMessage.tool_calls?.length) {
      // Extract final text and quick replies
      const rawText = assistantMessage.content ?? "";
      const { text, quickReplies } = extractQuickReplies(rawText);

      const response: AgentResponse = {
        text: text || "已收到您的需求，正在为您安排。",
        quickReplies: quickReplies ?? ["查询停车状态", "今日专属优惠"],
        card: collectedCard,
        parkingCard: collectedParkingCard,
        coupons: collectedCoupons,
        queueCard: collectedQueueCard,
      };

      // Merge side effects
      if (Object.keys(collectedSideEffects).length > 0) {
        response.sideEffects = collectedSideEffects as AgentSideEffects;
      }

      return { response, newMessages };
    }

    // Process tool calls
    for (const toolCall of assistantMessage.tool_calls) {
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        args = {};
      }

      // Execute the tool
      console.log(`[TOOL] name=${toolCall.function.name} args=${JSON.stringify(args)}`);
      const toolResult: ToolResult = executeTool(toolCall.function.name, args, ctx);
      console.log(`[TOOL] result=${JSON.stringify(toolResult.data)}`, `parkingCard=${!!toolResult.parkingCard}`, `sideEffects=${JSON.stringify(Object.keys(toolResult.sideEffects ?? {}))}`);

      // Collect side effects
      if (toolResult.sideEffects) {
        if (toolResult.sideEffects.setUserProfile) {
          collectedSideEffects.setUserProfile = toolResult.sideEffects.setUserProfile;
        }
        if ("parkingInfo" in toolResult.sideEffects) {
          collectedSideEffects.parkingInfo = toolResult.sideEffects.parkingInfo;
        }
        if ("queueInfo" in toolResult.sideEffects) {
          collectedSideEffects.queueInfo = toolResult.sideEffects.queueInfo;
        }
        if (toolResult.sideEffects.resetQueueNotified) {
          collectedSideEffects.resetQueueNotified = true;
        }
      }

      // Collect cards
      if (toolResult.card) collectedCard = toolResult.card;
      if (toolResult.parkingCard) collectedParkingCard = toolResult.parkingCard;
      if (toolResult.coupons) collectedCoupons = toolResult.coupons;
      if (toolResult.queueCard) collectedQueueCard = toolResult.queueCard;

      // Add tool result to messages for the LLM
      const toolMessage: ChatMessage = {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult.data),
      };
      messages.push(toolMessage);
      newMessages.push(toolMessage);
    }

    // The loop continues — the LLM will see tool results and generate a final response
  }

  // Safety: exceeded max rounds
  return {
    response: {
      text: "已收到您的需求，处理步骤较多，正在为您安排。",
      quickReplies: ["查询停车状态", "今日专属优惠"],
      sideEffects: Object.keys(collectedSideEffects).length > 0
        ? (collectedSideEffects as AgentSideEffects)
        : undefined,
      card: collectedCard,
      parkingCard: collectedParkingCard,
      coupons: collectedCoupons,
      queueCard: collectedQueueCard,
    },
    newMessages,
  };
}