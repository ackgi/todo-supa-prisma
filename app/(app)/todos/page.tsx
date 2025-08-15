import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serverSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { deleteTodo } from "./actions";

// --- 追加: クライアント側の小さなボタン ---
function DeleteButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
  "use client";
  return (
    <form
      action={async () => {
        if (!confirm("このTODOを削除します。よろしいですか？")) return;
        await onConfirm();
      }}
    >
      <button type="submit" className="border px-3 py-1 rounded-md text-sm">
        削除
      </button>
    </form>
  );
}

export default async function TodosPage() {
  // ← async コンポーネントにして await する
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // middlewareで弾いている想定だが、保険でnull返す
    return null;
  }

  const todos = await prisma.myTodo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My TODOs</h1>
        <div className="flex gap-2">
          <Link href="/todos/new"><Button>＋ New</Button></Link>
          <form action="/logout" method="post"><Button variant="outline">Logout</Button></form>
        </div>
      </div>

      <div className="space-y-3">
        {todos.map(t => (
          <Card key={t.id}>


          <CardContent className="p-4 flex justify-between">
            <div>
              <Link href={`/todos/${t.id}`} className="font-medium underline">{t.title}</Link>
              {t.content && <p className="text-sm text-gray-500">{t.content}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Badge>{t.status}</Badge>
              <form action={deleteTodo.bind(null, t.id)}>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                削除
              </Button>
              </form>
            </div>
          </CardContent>

          </Card>
        ))}
        {todos.length === 0 && <p className="text-sm text-gray-500">まだTODOがありません。</p>}
      </div>
    </div>
  );


}
