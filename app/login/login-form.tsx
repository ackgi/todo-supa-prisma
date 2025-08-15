// app/login/login-form.tsx
//サーバーコンポーネント（RSC）
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { loginAction } from "./login-action";
import { SubmitButton } from "./SubmitButton";

export default function LoginForm() {
  return (
    <Card className="bg-blue-50 border-blue-100 shadow-md rounded-xl">
      <CardContent>
        <form action={loginAction} className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
