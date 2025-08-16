// src/server/lib/supabase.ts
// Next.js 15 対応：cookies() の「同期API使用禁止」対策として
// - 最初に cookies() を await し、全Cookieを Map にスナップショット
// - cookies: { get } では Map を参照（後段で cookies().get を呼ばない）
// - set/remove は cookieStore.set() を呼びつつ Map も更新

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieStoreLike = {
  get: (name: string) => { value?: string } | string | undefined;
  set?: (args: { name: string; value: string } & CookieOptions) => void;
};

/** 推奨：サーバ専用 Supabase クライアント */
export async function getServerSupabase() {
  const cookieStore = await cookies();

  // ★ ここが肝：後続の get() で cookies().get を呼ばないためのスナップショット
  const snap = new Map<string, string>();
  for (const c of cookieStore.getAll()) snap.set(c.name, c.value);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return snap.get(name);
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set?.({ name, value, ...options });
            snap.set(name, value); // Map も更新
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set?.({ name, value: "", ...options, maxAge: 0 });
            snap.delete(name); // Map からも削除
          } catch {}
        },
      },
    }
  );
}

/** 後方互換：旧 createSupabaseServerClient（async） */
export async function createSupabaseServerClient(cookieStoreArg?: CookieStoreLike) {
  const cookieStore = cookieStoreArg ?? (await cookies());

  // 引数で渡ってきた store でも Map スナップショットを作る
  const snap = new Map<string, string>();
  const getVal = (name: string) => {
    const v = (cookieStore as any).get?.(name);
    return typeof v === "string" ? v : v?.value;
  };

  // 可能なら全件取得・スナップショット（getAll が無い実装も想定）
  try {
    for (const c of (cookieStore as any).getAll?.() ?? []) snap.set(c.name, c.value);
  } catch {
    // getAll が無い環境は、必要に応じて get() で都度読む（初回時にMapへ格納）
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (!snap.has(name)) {
            const v = getVal(name);
            if (v) snap.set(name, v);
          }
          return snap.get(name);
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            (cookieStore as any).set?.({ name, value, ...options });
            snap.set(name, value);
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            (cookieStore as any).set?.({ name, value: "", ...options, maxAge: 0 });
            snap.delete(name);
          } catch {}
        },
      },
    }
  );
}
