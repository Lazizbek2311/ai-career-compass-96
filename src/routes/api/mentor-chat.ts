import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `You are CareerAI Mentor — a warm, expert career coach inside the CareerAI app.

You help students and professionals with:
- Career discovery and direction
- Learning roadmaps and study advice
- Interview preparation (HR, technical, behavioral)
- Resume and CV optimization
- Salary expectations across regions (Uzbekistan, USA, Germany, EU, remote)
- University and major selection
- Job search strategy and applications
- Coding help with clean, well-explained snippets

Style:
- Be concise, structured, and encouraging.
- Use markdown: headings, bullet lists, **bold** for key terms, and fenced code blocks with the correct language.
- When giving steps, number them.
- When relevant, end with a short "Next step" suggestion.
- Never invent facts about the user; ask a clarifying question if needed.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/mentor-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
