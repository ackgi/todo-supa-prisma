// src/app/api/auth/login/route.ts
// API Route（薄いブリッジ：API-Generic → Service）
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authService } from "@/server/services/auth.service";
import { DomainError } from "@/server/errors/domain-errors";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    email?: unknown;
    password?: unknown;
    redirectedFrom?: unknown;
  };

  try {
    const cookieStore = await cookies(); // ★ Next.js 15: cookies() は Promise → await 必須
    const result = await authService.login(
      {
        email: body.email,
        password: body.password,
        redirectedFrom: body.redirectedFrom,
      },
      { cookieStore } // ★ 解決済みの cookieStore を渡す
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    const message =
      e instanceof DomainError ? e.message : "Login failed unexpectedly";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
