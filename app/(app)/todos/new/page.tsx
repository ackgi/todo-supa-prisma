import { createTodo } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function NewTodo() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card><CardContent className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">新規作成</h1>
        <form action={createTodo} className="space-y-3">
          <div><Label>タイトル</Label><Input name="title" required /></div>
          <div><Label>詳細</Label><Textarea name="content" /></div>
          <div><Label>ステータス</Label>
            <select name="status" className="mt-1 w-full border rounded p-2">
              <option>TODO</option><option>IN_PROGRESS</option><option>DONE</option>
            </select>
          </div>
          <div><Label>期限</Label><Input type="date" name="dueDate" /></div>
          <Button type="submit">作成</Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
