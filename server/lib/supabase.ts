// src/server/lib/supabase.ts
import { createServerClient } from "@supabase/ssr";

type CookieStore = {
  get: (name: string) => { name: string; value: string } | undefined;
  set: (name: string, value: string, options?: any) => void;
};

export function createSupabaseServerClient(cookieStore: CookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anon, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options?: any) =>
        cookieStore.set(name, value, options),
      remove: (name: string, options?: any) =>
        cookieStore.set(name, "", { ...(options ?? {}), maxAge: 0 }),
    },
  });
}
