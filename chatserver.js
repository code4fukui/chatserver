import { serve } from "https://deno.land/std@0.136.0/http/server.ts";
import { serveWeb } from "./serveWeb.js";

const defaultport = parseInt(Deno.args[0] || "8080");
const proxyhost = Deno.args[1] || "";

class ChatServer {
  constructor() {
    this.cons = [];
  }

  async checkFreePort(port) {
    try {
      await (await fetch("http://localhost:" + port + "/")).text();
      return false;
    } catch (e) {
    }
    return true;
  }
  async serve () {
    const handler = async (req, conn) => {
      try {
        if (req.method === "GET" && req.url.endsWith("/ws")) {
          const { socket, response } = Deno.upgradeWebSocket(req);
          socket.remoteAddr = conn.remoteAddr.hostname;
          if (socket.remoteAddr == proxyhost) {
            socket.remoteAddr = req.headers.get("x-real-ip");
          }
          socket.remotePort = conn.remoteAddr.port;
          await this.accept(socket)
          return response;
        } else {
          return serveWeb(req);
        }
      } catch (e) {
        console.log("in handler", e);
      }
    };
    let port = defaultport;
    for (;;) {
      if (await this.checkFreePort(port)) {
        const hostname = "[::]"; // for IPv6
        const addr = hostname + ":" + port;
        console.log(`http://${addr}/`, proxyhost);
        serve(handler, { hostname, port });
        break;
      }
      port++;
    }
  }

  async accept(ws) {
    this.cons.push(ws);
    const id = ws.remoteAddr + " " + ws.remotePort;
    console.log(id);
    ws.onmessage = (msg) => {
      const data = {
        id: id,
        data: msg.data,
      };
      this.send(data, ws);
      console.log("onmessage", data);
    };
  }

  async send(s, mysocket) {
    try {
      for (const ws of this.cons) {
        try {
          s.self = ws == mysocket;
          console.log("send " + s);
          await ws.send(JSON.stringify(s));
        } catch (e) {
          //this.cons.remove(ws);
        }
      }
    } catch (e) {
    }
  }
}

const server = new ChatServer();
server.serve();
