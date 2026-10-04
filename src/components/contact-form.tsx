"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const BUDGETS = [
  "Not sure yet",
  "Under $1k",
  "$1k – $3k",
  "$3k – $7k",
  "$7k+",
];

export default function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** Address returned by the server when it cannot deliver the message. */
  const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);
  /** The typed message, for the mailto fallback. */
  const [fallbackHref, setFallbackHref] = useState<string>("");
  // Time on screen, checked by the server to catch bots.
  const openedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setLoading(true);
    setErrors({});
    setFallbackEmail(null);
    let fallback: unknown = null;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, elapsedMs: Date.now() - openedAt.current }),
      });
      const json = await res.json();
      fallback = json.fallbackEmail;

      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json.error ?? "Something went wrong.");
      }

      form.reset();
      openedAt.current = Date.now();
      router.push("/thank-you");
    } catch (err) {
      // If the server returned an address, offer it as a fallback.
      const address = typeof fallback === "string" ? fallback : null;
      setFallbackEmail(address);
      if (address) {
        // Prefill the mailto link with the typed message.
        const lines = [
          data.company ? `Company: ${data.company}` : null,
          data.budget ? `Budget: ${data.budget}` : null,
          data.company || data.budget ? "" : null,
          String(data.message ?? ""),
        ].filter((l) => l !== null);
        setFallbackHref(
          `mailto:${address}` +
            `?subject=${encodeURIComponent(`Project enquiry — ${data.name ?? ""}`)}` +
            `&body=${encodeURIComponent(lines.join(String.fromCharCode(10)))}`
        );
      }
      toast({
        variant: "destructive",
        title: "Could not send that.",
        description:
          err instanceof Error ? err.message : "Please try again, or email me directly.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot field, hidden from people. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name}>
          <Input id="name" name="name" required placeholder="Jane Cooper" autoComplete="name" />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            autoComplete="email"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company (optional)" name="company" error={errors.company}>
          <Input id="company" name="company" placeholder="Company or team" autoComplete="organization" />
        </Field>
        <Field label="Budget range" name="budget" error={errors.budget}>
          <select
            id="budget"
            name="budget"
            defaultValue={BUDGETS[0]}
            className="flex h-11 w-full rounded-lg border border-input bg-background/82 px-3 text-sm shadow-sm transition-colors focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="What are you building?" name="message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="What breaks today, what it should do instead, and when you need it."
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Your details go to me and nowhere else. No list, no CRM, no forwarding.
        </p>
        <Button type="submit" size="lg" disabled={loading} className="sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send message
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Persistent fallback when sending failed. */}
      {fallbackEmail && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
          <p className="font-medium text-foreground">That did not send.</p>
          <p className="mt-1 text-muted-foreground">
            Something on my end is not working — nothing you did. Your message is
            still here.
          </p>
          <a
            href={fallbackHref || `mailto:${fallbackEmail}`}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open it in your email instead
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            That opens your mail app with everything already filled in, addressed
            to {fallbackEmail}.
          </p>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
