"use server";
import { prisma } from "@/lib/prisma";
import { serverSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTodo(fd: FormData) {
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.myTodo.create({
    data: {
      userId: user.id,
      title: String(fd.get("title") ?? ""),
      content: (fd.get("content") as string) || null,
      status: (fd.get("status") as any) || "TODO",
      dueDate: fd.get("dueDate") ? new Date(String(fd.get("dueDate"))) : null,
    },
  });

  revalidatePath("/todos");
}

export async function updateTodo(id: string, fd: FormData) {
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.myTodo.updateMany({
    where: { id, userId: user.id },
    data: {
      title: String(fd.get("title") ?? ""),
      content: (fd.get("content") as string) || null,
      status: (fd.get("status") as any) || "TODO",
      dueDate: fd.get("dueDate") ? new Date(String(fd.get("dueDate"))) : null,
    },
  });

  revalidatePath(`/todos/${id}`);
  revalidatePath("/todos");
}

export async function deleteTodo(id: string) {
  const supabase = await serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.myTodo.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/todos");
}

