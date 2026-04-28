"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function EventRegistrationButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function registerForEvent() {
    setStatus("loading");

    const response = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("done");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Button disabled={status === "loading"} onClick={registerForEvent}>
        {status === "loading" ? "Registering..." : status === "done" ? "Registered" : "Register for Event"}
      </Button>
      {status === "error" && <p className="text-sm text-red-600">Please login first or try again.</p>}
    </div>
  );
}
