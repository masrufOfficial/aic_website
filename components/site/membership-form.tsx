"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { membershipSchema } from "@/lib/validators";

type MembershipValues = z.infer<typeof membershipSchema>;

export function MembershipForm({
  defaultValues,
}: {
  defaultValues?: Partial<MembershipValues>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MembershipValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues,
  });

  async function onSubmit(values: MembershipValues) {
    setError(null);
    setMessage(null);

    const response = await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Could not submit membership request.");
      return;
    }

    setMessage("Membership application submitted successfully.");
    reset(values);
    router.refresh();
  }

  return (
    <Card className="border-slate-200/80 bg-white/85">
      <CardHeader>
        <CardTitle>Membership Application</CardTitle>
        <CardDescription>
          Complete your membership details so the admin team can review and activate your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input placeholder="Your full name" {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input placeholder="name@bubt.edu" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">WhatsApp Number</label>
              <Input placeholder="+8801XXXXXXXXX" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Membership ID</label>
              <Input placeholder="AIC-2026-001" {...register("membershipId")} />
              {errors.membershipId && <p className="text-sm text-red-600">{errors.membershipId.message}</p>}
            </div>
          </div>

          {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
