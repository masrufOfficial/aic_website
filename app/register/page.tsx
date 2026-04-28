import { AuthForm } from "@/components/site/auth-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-7xl bg-slate-950 px-4 py-10 md:px-8 md:py-16 lg:px-16">
      <AuthForm mode="register" />
    </div>
  );
}
