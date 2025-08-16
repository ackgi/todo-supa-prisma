// app/page.tsx
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/server/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await getServerSupabase(); // ★ await が必要
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  redirect("/todos");
}
