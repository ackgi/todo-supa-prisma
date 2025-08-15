// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // この res に cookies を書き戻す
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // クライアントから来た Cookie をすべて取得
        getAll() {
          return req.cookies.getAll();
        },
        // Supabase がセット/更新したい Cookie をレスポンスに反映
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ここで保護したいパスを判定
  if (!user && req.nextUrl.pathname.startsWith("/todos")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  // 対象を明示。静的ファイルを除外する正規表現より読みやすいです
  matcher: ["/todos/:path*"],
};
