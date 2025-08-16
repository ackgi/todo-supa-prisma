// app/(app)/todos/new/page.tsx

import { createTodo } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

// ✅ 追加：サーバー側での認証ガード用
import { redirect } from "next/navigation";
import type { Metadata } from "next";
// ※ 既存コードで使用しているラッパに合わせています（serverSupabase）
import { serverSupabase } from "@/lib/supabase/server";

// ✅ 追加：内部ページなので noindex（任意だが推奨）
export const metadata: Metadata = {
  title: "TODO新規作成",
  robots: { index: false, follow: false },
};

// ✅ 追加：認証依存ページはキャッシュ禁止（“幽霊セッション”対策）
export const dynamic = "force-dynamic";

export default async function NewTodo() {
  // ✅ 追加：サーバー側でセッション判定（未ログインは /login へ）
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // --- ここから下は Pure View（UI可視化専用） ---
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">新規作成</h1>

          {/* Server Action 経由（UI-Direct） */}
          <form action={createTodo} className="space-y-3">
            {/* ✅ A11y強化：Label と Input を id/htmlFor で紐付け */}
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input id="title" name="title" required />
            </div>

            <div>
              <Label htmlFor="content">詳細</Label>
              <Textarea id="content" name="content" />
            </div>

            <div>
              <Label htmlFor="status">ステータス</Label>
              <select
                id="status"
                name="status"
                defaultValue="TODO" // ✅ 初期値を明示
                className="mt-1 w-full border rounded p-2"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dueDate">期限</Label>
              <Input id="dueDate" type="date" name="dueDate" />
            </div>

            <Button type="submit">作成</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
