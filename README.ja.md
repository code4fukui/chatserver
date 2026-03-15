# chatserver

Denoを使用して構築されたチャットサーバーです。

## デモ
[デモページ](http://localhost:7001/)でチャット機能を試すことができます。また、[画面共有デモ](http://localhost:7001/ssshare.html)も利用できます。

## 機能
- ブラウザ上でのチャット
- 画面共有機能

## 必要環境
- [Deno](https://deno.land/)のインストール

## 使い方
Denoをインストールした後、以下のコマンドを実行してください:

```
git clone https://github.com/code4fukui/chatserver.git
cd chatserver
deno serve --port 7001 --host "[::]" -A chatserver.js
```

ブラウザで`http://localhost:7001/`にアクセスすると、チャットができます。`http://localhost:7001/ssshare.html`にアクセスすると、画面共有も試すことができます。

## ライセンス
このプロジェクトは MIT ライセンスの下で公開されています。