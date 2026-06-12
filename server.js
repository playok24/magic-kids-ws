const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/count") {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(JSON.stringify({ count: wss.clients.size }));
        return;
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Magic Kids WS Server");
});

const wss = new WebSocket.Server({ server });

function broadcast() {
    const count = wss.clients.size;
    const msg = JSON.stringify({ type: "presence", count });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

wss.on("connection", (ws, req) => {
    broadcast();
    ws.on("close", () => broadcast());
    ws.on("error", () => {});
});

server.listen(PORT, () => {
    console.log(`WS server on port ${PORT}`);
});
