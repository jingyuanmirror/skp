module.exports = async function handler(req, res) {
  try {
    const rawUpstreamBase = process.env.LLM_UPSTREAM_BASE_URL || "https://api.ant-ling.com";
    const upstreamBase = rawUpstreamBase.replace(/\/+$/, "").replace(/\/v1$/i, "");
    const incomingUrl = req.url || "/api/llm/v1/chat/completions";
    const upstreamPath = incomingUrl.replace(/^\/api\/llm/, "") || "/v1/chat/completions";
    const upstreamUrl = `${upstreamBase}${upstreamPath}`;

    const upstreamApiKey = process.env.LLM_API_KEY || process.env.ANT_LING_API_KEY;
    const incomingAuth = req.headers.authorization;
    const authorization = upstreamApiKey
      ? `Bearer ${upstreamApiKey}`
      : incomingAuth;

    const headers = {
      "content-type": "application/json",
    };

    if (authorization) {
      headers.authorization = authorization;
    }

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body),
    });

    const text = await upstream.text();

    res.status(upstream.status);
    const contentType = upstream.headers.get("content-type");
    if (contentType) {
      res.setHeader("content-type", contentType);
    }
    res.send(text);
  } catch (error) {
    res.status(500).json({
      error: "LLM proxy failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
