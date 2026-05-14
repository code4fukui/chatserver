# chatserver

DenoとWebSocketで構築された、シンプルなチャットおよび画面共有サーバーです。

## 機能

- **ルームベースのチャット:** リアルタイムのテキスト通信を行うためのチャットルームを作成できます。
- **画面共有:** 同じルーム内の他のユーザーに自分の画面を配信できます。
- **軽量:** サーバーおよびクライアント側の実装が最小限に抑えられています。
- **音声通知:** 「待って！」や「質問！」などの特定のメッセージに対してサウンドアラートを再生します。

## 要件

- [Deno](https://deno.land/) (v1.32以降を推奨)

## はじめに

### 1. リポジトリのクローン

```bash
git clone https://github.com/code4fukui/chatserver.git
cd chatserver
```

### 2. サーバーの起動

ポート7001でサーバーを起動します。`--host "[::]"` フラグにより、利用可能なすべてのネットワークインターフェース（IPv4およびIPv6）にバインドします。

```bash
deno serve --port 7001 --host "[::]" -A chatserver.js
```

これでサーバーが起動し、接続を受け付ける準備が整いました。

## 使い方

### テキストチャット

1. 2つのブラウザタブまたはウィンドウを開き、`http://localhost:7001/` にアクセスします。
2. 両方のタブで同じルーム名（例: "my-room"）を入力し、**enter** をクリックします。
3. これで、2つのクライアント間でメッセージを送受信できるようになります。

### 画面共有

これには1人の「共有者」と、少なくとも1人の「閲覧者」が必要です。

1. **共有者:**
    - ブラウザを開き、`http://localhost:7001/ssshare.html` にアクセスします。
    - ルーム名を入力し、**enter** をクリックします。
    - **start to share screen** ボタンをクリックし、配信したい画面またはウィンドウを選択します。

2. **閲覧者:**
    - 別のブラウザタブを開き、`http://localhost:7001/` にアクセスします。
    - 共有者が使用したのと同じ**ルーム名**を入力し、**enter** をクリックします。
    - 共有された画面がブラウザウィンドウに表示されます。閲覧者はテキストメッセージを送信したり、「待って！」や「質問！」ボタンを使用したりすることもできます。

## Nginxプロキシの設定

WebSocketをサポートするNginxプロキシの背後でこのサーバーを実行するには、以下のような設定を使用します。

```nginx
server {
  listen 80;
  server_name your.domain.com;

  location / {
    proxy_pass http://localhost:7001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## ライセンス

MIT License
