// src/server/services/auth.service.ts
import { LoginInput, LoginResult } from "@/server/dtos/auth.dto";
import { createSupabaseServerClient } from "@/server/lib/supabase";
import { AuthError } from "@/server/errors/domain-errors";

type Ctx = { cookieStore: any };

export const authService = {
  async login(raw: unknown, ctx: Ctx) {
    const input = LoginInput.parse(raw);

    const supabase = createSupabaseServerClient(ctx.cookieStore);
    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) throw new AuthError(error.message);

    const redirectTo =
      input.redirectedFrom?.startsWith("/") ? input.redirectedFrom : "/todos";

    return LoginResult.parse({ redirectTo });
  },
};
