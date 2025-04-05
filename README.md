# chatserver

chatserver for Deno2

## how to run

setup [Deno](https://deno.land/) ([Deno](https://deno.land/)をインストール)

clone this repository (このリポジトリをクローン)
```
git clone https://github.com/code4fukui/chatserver.git
```
or download (もしくは、ダウンロード)

```
cd chatserver
deno serve --port 7001 --host "[::]" -A chatserver.js
```

### simple chat

open http://localhost:7001/ by tow browser instances. (ブラウザで http://localhost:7001/ を2画面開く)

chat in each browsers. (お互いチャットできる！)


### screen share

open http://localhost:7001/ssshare.html by a browser instance. (ブラウザで http://localhost:7001/ssshare.html を開く)

open http://localhost:7001/ssrecv.html by a browser instance. (ブラウザで http://localhost:7001/ssrecv.html を開く)

you can share your screen. (画面を配信できる！)

## setting for nginx proxy

```
server {
  listen 80;
  server_name xxxx.xxxx.xxxx;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header Upgrade $http_upgrade; 
  proxy_set_header Connection $connection_upgrade;
  proxy_set_header X-Real-IP $remote_addr;
  location / {
    proxy_pass http://localhost:7001/;
  }
}
```
