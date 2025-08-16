// src/app/login/SubmitButton.tsx
// Client Component（動的UI最小限：Pure View）
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン",
  description: "アカウント情報を入力してください。",
  robots: {
    index: false,
    follow: false,
  },
};


export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"

    >
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}
