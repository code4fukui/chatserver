# chatserver

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple chat and screen sharing server built with Deno and WebSockets.

## Features

-   **Room-based Chat:** Create chat rooms for real-time text communication.
-   **Screen Sharing:** Broadcast a user's screen to others in the same room.
-   **Lightweight:** Minimalist server and client-side implementation.
-   **Audio Cues:** Plays sound alerts for specific messages like "待って！" (Wait!) and "質問！" (Question!).

## Requirements

-   [Deno](https://deno.land/) (v1.32 or later recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/code4fukui/chatserver.git
cd chatserver
```

### 2. Run the Server

Start the server on port 7001. The `--host "[::]"` flag binds to all available network interfaces (IPv4 and IPv6).

```bash
deno serve --port 7001 --host "[::]" -A chatserver.js
```

The server is now running and ready to accept connections.

## How to Use

### Text Chat

1.  Open two separate browser tabs or windows and navigate to `http://localhost:7001/`.
2.  In both tabs, enter the same room name (e.g., "my-room") and click **enter**.
3.  You can now send messages between the two clients.

### Screen Sharing

This requires one "Sharer" and at least one "Viewer".

1.  **Sharer:**
    -   Open a browser and navigate to `http://localhost:7001/ssshare.html`.
    -   Enter a room name and click **enter**.
    -   Click the **start to share screen** button and select the screen or window you wish to broadcast.

2.  **Viewer(s):**
    -   Open another browser tab and navigate to `http://localhost:7001/`.
    -   Enter the **same room name** used by the Sharer and click **enter**.
    -   The shared screen will appear in the browser window. Viewers can also send text messages and use the "待って！" and "質問！" buttons.

## Nginx Proxy Configuration

To run this server behind an Nginx proxy with WebSocket support, use a configuration similar to the following:

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

## License

MIT License