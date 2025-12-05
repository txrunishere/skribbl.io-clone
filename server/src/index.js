import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4444;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

io.on("connection", (socket) => {
  console.log(
    `🔥 New Client Connected ${socket.id} , ${io.sockets.sockets.size}`
  );

  socket.on("hello", (data) => {
    socket.emit("hello-response", `${data} sended!!`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client Disconnected ${socket.id}`);
    console.log(io.sockets.sockets.size);
  });
});

app.get("/", (_, res) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
