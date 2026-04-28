"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerSchema, loginSchema } from "@/lib/validators";

type RegisterValues = z.infer<typeof registerSchema>;
type LoginValues = z.infer<typeof loginSchema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/profile";
  const [serverError, setServerError] = useState<string | null>(null);
  const schema = mode === "register" ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: RegisterValues | LoginValues) {
    setServerError(null);

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      setServerError(data.error ?? "Something went wrong.");
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-lg border-white/10 bg-white/85">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Login to access your profile, events, and membership status."
            : "Register as a community member and start applying for events and membership."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input placeholder="Your full name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600">{String(errors.name.message)}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <Input placeholder="name@bubt.edu" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{String(errors.email.message)}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input placeholder="Enter your password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-600">{String(errors.password.message)}</p>}
          </div>

          {serverError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
