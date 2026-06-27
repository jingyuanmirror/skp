import { llmConfig } from "./config";
import type { ChatMessage, StreamCallbacks, ToolDefinition, ToolCall, ChatCompletionResponse } from "./types";

/**
 * Call the OpenAI-compatible chat completions API with streaming.
 * Returns the final accumulated response after streaming completes.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  tools: ToolDefinition[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<ChatCompletionResponse> {
  const url = `${llmConfig.baseUrl}/chat/completions`;

  const body = JSON.stringify({
    model: llmConfig.model,
    messages,
    tools: tools.length > 0 ? tools : undefined,
    max_tokens: llmConfig.maxTokens,
    temperature: llmConfig.temperature,
    stream: true,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${llmConfig.apiKey}`,
    },
    body,
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`LLM API error ${response.status}: ${errorText}`);
  }

  return parseStreamResponse(response, callbacks);
}

/**
 * Parse SSE stream from OpenAI-compatible API.
 * Accumulates text tokens and tool calls, firing callbacks along the way.
 */
async function parseStreamResponse(
  response: Response,
  callbacks: StreamCallbacks,
): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  let content = "";
  const toolCalls: Map<number, ToolCall> = new Map();
  let finishReason: "stop" | "tool_calls" | null = null;
  let responseId = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") break;

        try {
          const chunk = JSON.parse(data);
          responseId = chunk.id ?? responseId;

          const choice = chunk.choices?.[0];
          if (!choice) continue;

          // Text content
          const delta = choice.delta;
          if (delta?.content) {
            content += delta.content;
            callbacks.onToken(delta.content);
          }

          // Tool calls
          if (delta?.tool_calls) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              if (!toolCalls.has(idx)) {
                toolCalls.set(idx, {
                  id: tc.id ?? "",
                  type: "function",
                  function: { name: tc.function?.name ?? "", arguments: tc.function?.arguments ?? "" },
                });
              } else {
                const existing = toolCalls.get(idx)!;
                if (tc.id) existing.id = tc.id;
                if (tc.function?.name) existing.function.name = tc.function.name;
                if (tc.function?.arguments) existing.function.arguments += tc.function.arguments;
              }
            }
          }

          // Finish reason
          if (choice.finish_reason) {
            finishReason = choice.finish_reason as "stop" | "tool_calls";
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Ensure finish_reason is set
  if (!finishReason) {
    finishReason = toolCalls.size > 0 ? "tool_calls" : "stop";
  }

  return {
    id: responseId,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: content || null,
          tool_calls: toolCalls.size > 0 ? Array.from(toolCalls.values()) : undefined,
        },
        finish_reason: finishReason,
      },
    ],
  };
}