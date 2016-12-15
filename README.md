# 概要
write権限の無いユーザがissue登録時にタイトル、概要以外の項目を代理入力するgithub hook bot

# how to work
issue登録時のコメント欄に以下のようなフォーマットで入力して作成すると、botがその内容を代理登録します
```
%% assignee=SomeOne
%% labels=some_label
%% milestone=1
```

基本的には手入力せずに、チケット作成用のショートカットリンクなどにより自動入力されることを想定しています。

# 対応している項目
parseMetaInfo 関数の実装をみてください

# environment variables
- ENTRY_POINT
  - githubのhookを受け取るエントリーポイント
- TARGET_REPOS
  - CSV形式でリポジトリを指定
  - ex `user/repo,org/repo`
- GITHUB_PERSONAL_TOKEN
  - github の パーソナルトークン
  - 必須スコープ
    - repos
