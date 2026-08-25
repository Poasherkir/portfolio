import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@/data/portfolio";

export const runtime = "nodejs";

const Payload = z.object({
  name: z.string().trim().min(2, "Please give me a name to reply to."),
  email: z.string().trim().email("That email address does not look right."),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(20, "A little more detail helps me answer usefully."),
  /** Honeypot — must stay empty. */
  company_website: z.string().max(0).optional().or(z.literal("")),
  /** Time the form was on screen before submit. */
  elapsedMs: z.number().optional(),
});

/** Minimum time a human plausibly takes to fill this in. */
const MIN_ELAPSED_MS = 2500;

/**
 * Very small in-memory rate limit: 3 messages per IP per 10 minutes.
 * Serverless instances are ephemeral, so this is a speed bump rather than a
 * guarantee — the honeypot and timing check do most of the work.
 */
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many messages from this connection. Try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = Payload.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
    );
    return Response.json({ error: "Please check the form.", fieldErrors }, { status: 400 });
  }

  const { name, email, company, budget, message, company_website, elapsedMs } = parsed.data;

  // Silently accept spam so bots get no signal to tune against.
  if (company_website || (elapsedMs !== undefined && elapsedMs < MIN_ELAPSED_MS)) {
    return Response.json({ ok: true });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  if (!to) {
    console.error("[contact] No destination address: set CONTACT_TO_EMAIL or profile.email.");
    return Response.json(
      { error: "The contact form is not connected yet. Please reach out on GitHub." },
      { status: 503 }
    );
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is missing.");
    return Response.json(
      { error: "The contact form is not connected yet. Please reach out on GitHub." },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 16px">New enquiry from the portfolio</h2>
      <table cellpadding="0" cellspacing="0" style="font-size:14px">
        <tr><td style="padding:2px 16px 2px 0;color:#64748b">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:2px 16px 2px 0;color:#64748b">Email</td><td>${escapeHtml(email)}</td></tr>
        ${company ? `<tr><td style="padding:2px 16px 2px 0;color:#64748b">Company</td><td>${escapeHtml(company)}</td></tr>` : ""}
        ${budget ? `<tr><td style="padding:2px 16px 2px 0;color:#64748b">Budget</td><td>${escapeHtml(budget)}</td></tr>` : ""}
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
      <p style="white-space:pre-wrap;font-size:14px;margin:0">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      // Replace with an address on your own verified domain once DNS is set up.
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      replyTo: email,
      subject: `Portfolio enquiry — ${name}${company ? ` (${company})` : ""}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return Response.json({ error: "Delivery failed. Please email me directly." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return Response.json({ error: "Delivery failed. Please email me directly." }, { status: 500 });
  }
}
