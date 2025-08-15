// src/app/login/SubmitButton.tsx
// Client Component（動的UI最小限：Pure View）
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
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
