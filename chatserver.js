import { serveDir } from "jsr:@std/http/file-server";
import { parseURL } from "https://js.sabae.cc/parseURL.js";
import { CBOR } from "https://js.sabae.cc/CBOR.js";

const proxyhost = Deno.args[1] || "";
const isLocalHost = (host) => host == "::ffff:127.0.0.1" || host == "::1";

const cons = {}; // array by roomname

let err = null; // callback if err
let log = null; // callback to log

const handle = async (req, conn) => {
  try {
    if (req.method === "GET" && req.url.endsWith("/ws")) {
      const s = req.url.substring(0, req.url.length - 3);
      const roomname = s.substring(s.lastIndexOf("/") + 1);
      let room = cons[roomname];
      if (!room) {
        room = cons[roomname] = [];
      }
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.remoteAddr = conn.remoteAddr.hostname;
      if (socket.remoteAddr == proxyhost || isLocalHost(socket.remoteAddr)) {
        if (req.headers.get("x-real-ip")) {
          socket.remoteAddr = req.headers.get("x-real-ip");
        }
      }
      socket.remotePort = conn.remoteAddr.port;
      await accept(socket, room)
      return response;
    } else {
      return serveDir(req, { fsRoot: "static", urlRoot: "" });
    }
  } catch (e) {
    console.log("in handler", e);
  }
};

const accept = async (ws, room) => {
  room.push(ws);
  //console.log("open", room)
  const id = ws.remoteAddr + " " + ws.remotePort;
  //console.log(id);
  ws.onmessage = (msg) => {
    const data = typeof msg.data == "string" ? msg.data : new Uint8Array(msg.data);
    const packet = { id, data };
    send(packet, ws, room);
    //console.log("onmessage", data);
  };
  ws.onclose = () => {
    const idx = room.indexOf(ws);
    if (idx >= 0) {
      room.splice(idx, 1);
      //console.log("close", room)
    }
  };
};

const send = async (s, mysocket, room) => {
  try {
    for (const ws of room) {
      try {
        s.self = ws == mysocket;
        //console.log("send " + s);
        await ws.send(CBOR.encode(s));
      } catch (e) {
        //cons.remove(ws);
      }
    }
  } catch (e) {
  }
};

const service = async (req, conn) => {
  const remoteAddr = conn.remoteAddr.hostname;
  //console.log("remoteAddr", remoteAddr);
  try {
    const url = req.url;
    const purl = parseURL(url);
    //console.log({purl})
    req.path = purl.path;
    req.query = purl.query;
    req.host = purl.host;
    req.port = purl.port;
    req.remoteAddr = remoteAddr;        
    //console.log("REQ", req);
    if (log) await log(req);
    const resd = await handle(req, conn);
    //console.log(purl.path, resd);
    //res.respondWith(resd);
    return resd;
  } catch (e) {
    console.log(e);
    if (err) {
      err(e);
    }
  }
};

export default { fetch: service };
