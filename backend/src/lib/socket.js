import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return;

  userSocketMap[userId] = socket.id;
  console.log(`User connected: ${userId} (socket: ${socket.id})`);

  emitOnlineUsers();

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId} (socket: ${socket.id})`);
    delete userSocketMap[userId];
    emitOnlineUsers();
  });
});

function emitOnlineUsers() {
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
}

export { io, app, server };
