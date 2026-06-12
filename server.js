const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const count = wss ? wss.clients.size : 0;
    const data = JSON.stringify({ status: "ok", count, path: req.url });
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    res.end(data);
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
