"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function Signup() {
  const supabase = clientSupabase();
  const router = useRouter();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    router.push("/todos");
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <Card><CardContent className="pt-6 space-y-3">
        <div><Label>Email</Label><Input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <Button onClick={onSubmit} disabled={loading}>{loading ? "Signing up..." : "Sign up"}</Button>
      </CardContent></Card>
    </div>
  );
}
