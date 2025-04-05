import { serve } from "https://deno.land/std@0.136.0/http/server.ts";
import { serveWeb } from "./serveWeb.js";
import { CBOR } from "https://js.sabae.cc/CBOR.js";

const defaultport = parseInt(Deno.args[0] || "7001");
const proxyhost = Deno.args[1] || "";
const isLocalHost = (host) => host == "::ffff:127.0.0.1" || host == "::1";

class ChatServer {
  constructor() {
    this.cons = {}; // array by roomname
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
          const s = req.url.substring(0, req.url.length - 3);
          const roomname = s.substring(s.lastIndexOf("/") + 1);
          let room = this.cons[roomname];
          if (!room) {
            room = this.cons[roomname] = [];
          }
          console.log(roomname, s, req.url, room)
          const { socket, response } = Deno.upgradeWebSocket(req);
          socket.remoteAddr = conn.remoteAddr.hostname;
          if (socket.remoteAddr == proxyhost || isLocalHost(socket.remoteAddr)) {
            if (req.headers.get("x-real-ip")) {
              socket.remoteAddr = req.headers.get("x-real-ip");
            }
          }
          socket.remotePort = conn.remoteAddr.port;
          await this.accept(socket, room)
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
        //console.log(`http://${addr}/`, proxyhost);
        serve(handler, { hostname, port });
        break;
      }
      port++;
    }
  }

  async accept(ws, room) {
    room.push(ws);
    //console.log("open", room)
    const id = ws.remoteAddr + " " + ws.remotePort;
    //console.log(id);
    ws.onmessage = (msg) => {
      const data = typeof msg.data == "string" ? msg.data : new Uint8Array(msg.data);
      const packet = { id, data };
      this.send(packet, ws, room);
      //console.log("onmessage", data);
    };
    ws.onclose = () => {
      const idx = room.indexOf(ws);
      if (idx >= 0) {
        room.splice(idx, 1);
        //console.log("close", room)
      }
    };
  }

  async send(s, mysocket, room) {
    try {
      for (const ws of room) {
        try {
          s.self = ws == mysocket;
          //console.log("send " + s);
          await ws.send(CBOR.encode(s));
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
