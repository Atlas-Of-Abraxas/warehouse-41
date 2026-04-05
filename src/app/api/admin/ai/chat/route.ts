import { auth } from "@/lib/auth";
import { gateway, streamText } from "ai";
import type { GatewayModelId } from "ai";

export const maxDuration = 60;
export const runtime = "nodejs";

const DEFAULT_MODEL: GatewayModelId = "anthropic/claude-sonnet-4";
const MAX_PROMPT_LENGTH = 32_000;
const GATEWAY_MODEL_PATTERN = /^[a-z0-9][a-z0-9./+\-]{0,96}$/i;

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "AI Gateway is not configured. Set AI_GATEWAY_API_KEY in the environment.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { prompt?: unknown; model?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt =
    typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return new Response(JSON.stringify({ error: "Invalid prompt" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let modelId: GatewayModelId = DEFAULT_MODEL;
  if (typeof body.model === "string" && body.model.length > 0) {
    const raw = body.model.trim();
    if (!GATEWAY_MODEL_PATTERN.test(raw)) {
      return new Response(JSON.stringify({ error: "Invalid model id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    modelId = raw as GatewayModelId;
  }

  const result = streamText({
    model: gateway(modelId),
    prompt,
  });

  return result.toTextStreamResponse();
}
