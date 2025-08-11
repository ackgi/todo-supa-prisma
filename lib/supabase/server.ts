import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function serverSupabase() {
  const store = await cookies(); // ← await 必須

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // 一部環境で型がreadonlyに見えるため ts-ignore 可
          // @ts-ignore
          store.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // @ts-ignore
          store.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}
