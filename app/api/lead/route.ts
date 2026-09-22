import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json(
      { ok: false, errors: fieldErrors },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("[lead] Missing N8N_WEBHOOK_URL or N8N_WEBHOOK_SECRET");
    return NextResponse.json(
      { ok: false, error: "Server misconfiguration" },
      { status: 502 },
    );
  }

  const payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company ?? "",
    website: parsed.data.website ?? "",
    service: parsed.data.service,
    message: parsed.data.message,
    source: "website_form",
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": webhookSecret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        `[lead] Webhook responded with non-2xx status: ${response.status}`,
      );
      return NextResponse.json(
        { ok: false, error: "Unable to submit right now" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[lead] Webhook request failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to submit right now" },
      { status: 502 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
