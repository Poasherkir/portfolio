"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, subscribeMute } from "@/components/keyboard/keyboard-audio";

/** Mutes the keyboard sounds. */
export default function SoundToggle() {
  const [mounted, setMounted] = useState(false);
  const [muted, setLocal] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocal(isMuted());
    return subscribeMute(setLocal);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-label={muted ? "Unmute keyboard sound" : "Mute keyboard sound"}
      aria-pressed={muted}
      className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-accent"
    >
      {mounted &&
        (muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />)}
    </button>
  );
}
