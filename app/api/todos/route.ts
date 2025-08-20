// src/app/api/todos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ← Prisma Client の import パスはプロジェクトに合わせて

export async function GET() {
  try {
    const todos = await prisma.myTodo.findMany({
      orderBy: { createdAt: "desc" }, // 作成日時の新しい順
    });

    return NextResponse.json(todos, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    console.error("[GET /api/todos] Error:", e);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}
