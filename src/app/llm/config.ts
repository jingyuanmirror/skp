export const llmConfig = {
  // Browser always calls same-origin proxy. Vite dev proxy / Vercel API route forward to upstream LLM.
  baseUrl: import.meta.env.VITE_LLM_BASE_URL ?? "/api/llm/v1",
  apiKey: import.meta.env.VITE_LLM_API_KEY ?? "",
  model: import.meta.env.VITE_LLM_MODEL ?? "Ling-2.6-flash",
  maxTokens: 1024,
  temperature: 0.7,
};