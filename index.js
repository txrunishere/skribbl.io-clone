const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id, io.sockets.sockets.size);

  socket.on("send-message", (data) => {
    console.log(data);
    socket.broadcast.emit("message", {
      message: data,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    console.log(io.sockets.sockets.size);
  });
});

app.get("/", (_, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT);
