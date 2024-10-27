const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const http = require('http');
const socketIo = require('socket.io');
const Document = require('./models/Document');

require("./config/passportConfig");

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware for parsing JSON and handling cookies
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinDocument', async (documentId) => {
    socket.join(documentId);
    const document = await Document.findById(documentId);
    socket.emit('documentData', document);
  });

  socket.on('editDocument', async ({ documentId, content }) => {
    const document = await Document.findById(documentId);
    if (document) {
      document.content = content;
      document.version += 1;
      document.lastEdited = new Date();
      await document.save();
      io.to(documentId).emit('documentUpdate', document);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
