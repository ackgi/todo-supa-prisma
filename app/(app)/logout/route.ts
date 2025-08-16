// app/(app)/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers"; // ← 追加: NextのCookie APIを使う

export async function POST(req: NextRequest) {
  const cookieStore = await cookies(); // ← 修正: あなたの環境では Promise なので await が必要

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // ← 修正: cookieStore から実際の値を取得
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // ← 修正: レスポンスに Set-Cookie を乗せる（route handlerではこれでOK）
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options: CookieOptions) {
          // ← 修正: maxAge:0 で確実に削除
          try { cookieStore.set({ name, value: "", ...options, maxAge: 0 }); } catch {}
        },
      },
    }
  );

  await supabase.auth.signOut(); // ← サーバ側セッション破棄（HttpOnly Cookie も削除される）

  // 元のホストに対して /login へ
  const url = new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? req.url);
  return NextResponse.redirect(url);
}
