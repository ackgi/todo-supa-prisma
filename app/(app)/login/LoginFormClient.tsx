"use client";

import { useActionState } from "react";         // ← ここを変更
import { useFormStatus } from "react-dom";      // useFormStatus はそのまま
import type { LoginFormState } from "./login-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  // (prevState, formData) => Promise<state> の2引数シグネチャを維持
  action: (prevState: LoginFormState, formData: FormData) => Promise<LoginFormState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
    >
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export default function LoginFormClient({ action }: Props) {
  // useFormState → useActionState に置換（返り値は同様に [state, formAction] で利用可）
  const [state, formAction] = useActionState<LoginFormState, FormData>(action, { ok: true });

  return (
    <form action={formAction} className="space-y-4">
      {state.ok === false && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div>
        <Label htmlFor="email" className="text-blue-800">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="border-blue-200 focus:ring-blue-400 rounded-lg"
          required
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-blue-800">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="border-blue-200 focus:ring-blue-400 rounded-lg"
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
}
