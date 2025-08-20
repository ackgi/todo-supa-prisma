# ========= 設定 =========
$Base = "http://localhost:3000"
# $Base = "https://your-app.vercel.app"
# =======================

# セッション（Cookieコンテナ）
$s = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# 1) ログイン（生JSONでシンプル・安定）
$loginBody = '{"email":"ユーザーメールアドレス","password":"ユーザーパスワード","redirectedFrom":"/todos"}'
Invoke-RestMethod -Uri "$Base/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -WebSession $s | Out-Null

# 2) Todo一覧を取得
$todos = Invoke-RestMethod -Uri "$Base/api/todos" -Method GET -WebSession $s

# 3) (A) 主要カラムをテーブル表示（タイトル以外も）
$todos |
  Select-Object id, userId, title, content, status, dueDate, createdAt, updatedAt |
  Format-Table -AutoSize -Wrap

# 3) (B) 全フィールドをざっと確認したいとき（詳細）
$todos | Format-List * -Force

# 3) (C) 保存したいとき（任意）
# $todos | ConvertTo-Json -Depth 10 | Out-File todos.json -Encoding utf8
# $todos | Export-Csv todos.csv -NoTypeInformation -Encoding UTF8
