// app/(app)/todos/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serverSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { deleteTodo } from "../actions";

// 追加（理由: 認証依存ページは静的化/キャッシュを禁止して“幽霊セッション”を防ぐ）
export const dynamic = "force-dynamic";

// 追加（任意だが推奨: 内部画面はnoindex）
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TODO 詳細",
  robots: { index: false, follow: false },
};

import { redirect, notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function TodoDetail({ params: { id } }: Props) {
  // ← 必ず await
  const supabase = await serverSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser(); // ← ここも await

  // 変更前: middlewareで弾いている想定だが、保険でnull返す
  // 変更後: URL を /login に確実にリダイレクト（ガードの正規挙動）
  if (!user) {
    redirect("/login");
  }

  const todo = await prisma.myTodo.findFirst({
    where: { id, userId: user.id },
  });

  // 変更前: <p>見つかりませんでした。</p> を表示（HTTP 200 になってしまう）
  //  変更後: notFound() で正しく 404 を返す（Next.js の標準エラーハンドリング）
  if (!todo) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <Card>
        <CardContent className="p-6 space-y-2">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">{todo.title}</h1>
            <Badge>{todo.status}</Badge>
          </div>
          {todo.content && <p>{todo.content}</p>}
          {todo.dueDate && (
            <p className="text-sm">
              期限: {todo.dueDate.toISOString().slice(0, 10)}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link href={`/todos/${id}/edit`}>
          <Button variant="secondary">編集</Button>
        </Link>

        {/* 削除は Server Action 経由
            変更前: 内部で "use server" の onDelete を定義
            変更後: 一覧ページと同じく bind で直接アクションを渡して簡潔に（責務が明確） */}
        <form action={deleteTodo.bind(null, id)}>
          <Button variant="destructive">削除</Button>
        </form>

        <Link href="/todos">
          <Button variant="outline">一覧へ</Button>
        </Link>
      </div>
    </div>
  );
}
