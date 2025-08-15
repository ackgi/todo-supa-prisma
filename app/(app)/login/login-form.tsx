
// src/app/login/login-form.tsx
// Server Component（Pure View のラッパー）
import { Card, CardContent } from "@/components/ui/card";
import LoginFormClient from "./LoginFormClient";
import { loginActionStateful } from "./login-action";

export default function LoginForm() {
  return (
    <Card className="bg-blue-50 border-blue-100 shadow-md rounded-xl">
      <CardContent>
        <LoginFormClient action={loginActionStateful} />
      </CardContent>
    </Card>
  );
}
