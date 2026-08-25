import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-display-md font-semibold tracking-tighter">
        Off course.
      </h1>
      <p className="mt-5 max-w-md text-muted-foreground">
        No page at this heading. The work is one link away.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to the start
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">See the projects</Link>
        </Button>
      </div>
    </div>
  );
}
