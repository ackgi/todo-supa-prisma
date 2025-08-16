// src/server/services/auth.service.ts
// Service-Centric：UI からは Server Action 経由でこのサービスだけを呼ぶ

import { LoginInput, LoginResult } from "@/server/dtos/auth.dto";
import { createSupabaseServerClient } from "@/server/lib/supabase";
import { AuthError } from "@/server/errors/domain-errors";

// （任意）CookieStore 風の型。渡されないケースもあるため optional にしておく。
type CookieStoreLike = {
  get: (name: string) => { value?: string } | string | undefined;
  set?: (args: { name: string; value: string }) => void;
};
type Ctx = { cookieStore?: CookieStoreLike };

/** ← 追加: オープンリダイレクト/ループ防止のため、パスをサニタイズ */
function safeRedirectPath(path?: string) {
  if (!path || !path.startsWith("/")) return "/todos";      // 外部URLや空は拒否
  if (path.startsWith("//")) return "/todos";                // スキーム相対を拒否
  if (path === "/login" || path === "/logout") return "/todos"; // ループしやすい場所は避ける
  return path;
}

export const authService = {
  async login(raw: unknown, ctx: Ctx = {}) {
    const input = LoginInput.parse(raw);

    // ★ 修正1: async 工場関数は必ず await する（以前の TypeError の原因）
    const supabase = await createSupabaseServerClient(ctx.cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    // ★ 既存方針維持: ドメインエラーでラップして上位に伝播
    if (error) throw new AuthError(error.message);

    // ★ 修正2: リダイレクト先を安全に確定
    const redirectTo = safeRedirectPath(input.redirectedFrom);

    // 既存DTOに合わせて返す
    return LoginResult.parse({ redirectTo });
  },
};
