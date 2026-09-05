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
  /** Set when the server says it cannot deliver but tells us where to write. */
  const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);
  // Spam control #1: how long the form was on screen. Bots submit instantly.
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
      // A page rather than a toast: the submission gets a URL the visitor can
      // see and return to, and something a conversion can point at. Only the
      // success path changed — the request and every error branch above are
      // untouched.
      router.push("/thank-you");
    } catch (err) {
      // A failed send used to end here, with an apology and nowhere to go. If
      // the server handed back an address, offer it — the visitor came to say
      // something and should not have to go hunting for a second route.
      setFallbackEmail(typeof fallback === "string" ? fallback : null);
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
      {/* Spam control #2: honeypot. Hidden from people, irresistible to bots. */}
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

      {/* Only appears when the send actually failed. A toast is gone in a few
          seconds and takes the address with it; this stays until the message
          is on its way by some other route. */}
      {fallbackEmail && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
          <p className="font-medium text-foreground">That did not send.</p>
          <p className="mt-1 text-muted-foreground">
            Something on my end is not working. Send it straight to{" "}
            <a
              href={`mailto:${fallbackEmail}`}
              className="text-brand underline underline-offset-4"
            >
              {fallbackEmail}
            </a>{" "}
            and it will reach me just the same.
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
