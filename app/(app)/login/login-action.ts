// src/app/(app)/login/login-action.ts
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authService } from "@/server/services/auth.service";
import { DomainError } from "@/server/errors/domain-errors";

export type LoginFormState = { ok: true } | { ok: false; error: string };

function str(fd: FormData, name: string): string | undefined {
  const v = fd.get(name);
  return typeof v === "string" ? v : undefined; // null/File -> undefined
}

export async function loginActionStateful(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const cookieStore = cookies();

  // 成功時の結果を先に受け取る（この中で redirect は呼ばない）
  let redirectTo: string;
  try {
    const result = await authService.login(
      {
        email: str(formData, "email"),
        password: str(formData, "password"),
        redirectedFrom: str(formData, "redirectedFrom"),
      },
      { cookieStore }
    );
    redirectTo = result.redirectTo;
  } catch (e) {
    // ドメインエラーなら画面に表示、その他は再throw（＝ Next の仕組みに任せる）
    if (e instanceof DomainError) {
      return { ok: false, error: e.message };
    }
    throw e; // ← redirect の内部実装など“成功系の特殊例外”もここで潰さない
  }

  // ここでリダイレクト（throw されるが catch していないので成功遷移する）
  redirect(redirectTo);
}
