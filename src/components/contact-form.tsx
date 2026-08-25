"use client";

import { useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Spam control #1: how long the form was on screen. Bots submit instantly.
  const openedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, elapsedMs: Date.now() - openedAt.current }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json.error ?? "Something went wrong.");
      }

      toast({
        variant: "success",
        title: "Message sent.",
        description: "I reply within one working day.",
      });
      form.reset();
      openedAt.current = Date.now();
    } catch (err) {
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
