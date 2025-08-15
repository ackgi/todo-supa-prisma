import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serverSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { deleteTodo } from "../actions";

type Props = { params: { id: string } };

export default async function TodoDetail({ params: { id } }: Props) {
  // ← 必ず await
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser(); // ← ここも await
  if (!user) return null;

  const todo = await prisma.myTodo.findFirst({
    where: { id, userId: user.id },
  });
  if (!todo) return <p className="p-6">見つかりませんでした。</p>;

  // 削除は Server Action 経由
  async function onDelete() {
    "use server";
    await deleteTodo(id);
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
            <p className="text-sm">期限: {todo.dueDate.toISOString().slice(0, 10)}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link href={`/todos/${id}/edit`}><Button variant="secondary">編集</Button></Link>
        <form action={onDelete}><Button variant="destructive">削除</Button></form>
        <Link href="/todos"><Button variant="outline">一覧へ</Button></Link>
      </div>
    </div>
  );
}
