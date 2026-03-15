# chatserver

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A chat server built using Deno.

## Features
- Simple chat functionality
- Screen sharing capability

## Requirements
- [Deno](https://deno.land/) installed

## Usage

1. Clone the repository:
   ```
   git clone https://github.com/code4fukui/chatserver.git
   ```
   or download the files.

2. Run the server:
   ```
   cd chatserver
   deno serve --port 7001 --host "[::]" -A chatserver.js
   ```

### Simple Chat
1. Open two browser instances at `http://localhost:7001/`.
2. Chat in each browser.

### Screen Sharing
1. Open a browser at `http://localhost:7001/ssshare.html`.
2. Open another browser at `http://localhost:7001/`.
3. Share your screen.

## Nginx Proxy Configuration
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

## License
MIT License