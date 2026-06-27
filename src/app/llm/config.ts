export const llmConfig = {
  // In dev, use Vite proxy to avoid CORS; in prod, use direct URL
  baseUrl: import.meta.env.VITE_LLM_BASE_URL ?? "/api/llm/v1",
  apiKey:
    import.meta.env.VITE_LLM_API_KEY ??
    "sk-ff341648201645458af9571157c00eef",
  model: import.meta.env.VITE_LLM_MODEL ?? "Ling-2.6-flash",
  maxTokens: 1024,
  temperature: 0.7,
};