import { prisma } from "@/lib/prisma";
import { serverSupabase } from "@/lib/supabase/server";
import { updateTodo } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: { id: string } };

export default async function EditTodoPage({ params: { id } }: Props) {
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const todo = await prisma.myTodo.findFirst({
    where: { id, userId: user.id },
  });
  if (!todo) return <p className="p-6">見つかりませんでした。</p>;

  async function action(fd: FormData) {
    "use server";
    await updateTodo(id, fd);
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">TODO 編集</h1>
          <form action={action} className="space-y-3">
            <div>
              <Label>タイトル</Label>
              <Input name="title" defaultValue={todo.title} required />
            </div>
            <div>
              <Label>詳細</Label>
              <Textarea name="content" defaultValue={todo.content ?? ""} />
            </div>
            <div>
              <Label>ステータス</Label>
              <select
                name="status"
                defaultValue={todo.status}
                className="mt-1 w-full border rounded p-2"
              >
                <option>TODO</option>
                <option>IN_PROGRESS</option>
                <option>DONE</option>
              </select>
            </div>
            <div>
              <Label>期限</Label>
              <Input
                type="date"
                name="dueDate"
                defaultValue={
                  todo.dueDate ? todo.dueDate.toISOString().slice(0, 10) : ""
                }
              />
            </div>
            <Button type="submit">更新</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
