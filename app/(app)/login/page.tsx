// app/login/page.tsx
import { CenterLayout } from "@/components/layouts/CenterLayout";
import { AuthCard } from "@/components/layouts/AuthCard";
import LoginForm from "./login-form";
import type { Metadata } from "next";

// ページ専用メタデータ（SEO制御 + noindex対策）
export const metadata: Metadata = {
  title: "ログイン",
  description: "アカウント情報を入力してください。",
  robots: {
    index: false, // noindex: 検索結果に載せない
    follow: false, // nofollow: ページ内リンクを辿らせない
  },
};
// 認証系ページはキャッシュ禁止
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <CenterLayout>
      <AuthCard title="ログイン" description="アカウント情報を入力してください。">
        <LoginForm />
      </AuthCard>
    </CenterLayout>
  );
}
