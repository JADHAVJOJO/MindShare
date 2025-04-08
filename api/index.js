import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import multer from "multer";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

// Multer file upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

// File upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store rooms with users and their socket IDs
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a room
  socket.on("join_room", ({ room, username }) => {
    // Create room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = {};
    }

    // Check if username is already in the room
    const existingUser = Object.values(rooms[room]).find(user => user.username === username);

    if (existingUser) {
      // If username exists, emit an error
      socket.emit("join_error", "Username already exists in this room");
      return;
    }

    // Add user to the room with their socket ID
    rooms[room][socket.id] = {
      username: username,
      socketId: socket.id
    };

    // Join the socket room
    socket.join(room);

    // Get current usernames in the room
    const roomUsers = Object.values(rooms[room]).map(user => user.username);

    // Notify users in the room about new participant
    io.to(room).emit("room_participants", roomUsers);

    console.log(`${username} joined room ${room}`);
    console.log("Current room users:", roomUsers);
  });

  // Handle messages
  socket.on("send_message", (data) => {
    // Broadcast message to other users in the room
    socket.to(data.room).emit("receive_message", data);
  });

  // User leaves room
  socket.on("leave_room", ({ room, username }) => {
    if (rooms[room] && rooms[room][socket.id]) {
      // Remove user from the room
      delete rooms[room][socket.id];

      // Leave the socket room
      socket.leave(room);

      // Get updated list of usernames
      const roomUsers = Object.values(rooms[room]).map(user => user.username);

      // Notify remaining users
      io.to(room).emit("room_participants", roomUsers);

      console.log(`${username} left room ${room}`);
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    // Find and remove user from all rooms
    for (const room in rooms) {
      if (rooms[room][socket.id]) {
        const username = rooms[room][socket.id].username;
        delete rooms[room][socket.id];

        // Get updated list of usernames
        const roomUsers = Object.values(rooms[room]).map(user => user.username);

        // Notify remaining users
        io.to(room).emit("room_participants", roomUsers);

        console.log(`${username} disconnected from room ${room}`);
      }
    }

    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
