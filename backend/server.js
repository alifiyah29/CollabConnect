const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const http = require("http");
const socketIo = require("socket.io");
const Document = require("./models/Document");
const Chat = require("./models/Chat"); // Ensure you have a Chat model
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');


require("./config/passportConfig");

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS middleware must be set up before other middleware and routes
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
  credentials: true,                // Required for cookies, authorization headers with HTTPS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

const io = socketIo(server, { cors: { origin: "*" } });

// Middleware for parsing JSON and handling cookies
app.use(express.json());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET],
}));

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
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle document join
  socket.on("joinDocument", async (documentId) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return socket.emit("error", { message: "Invalid document ID format" });
    }

    socket.join(documentId);
    const document = await Document.findById(documentId);
    
    if (document) {
      socket.emit("documentData", document);
    } else {
      socket.emit("error", { message: "Document not found" });
    }
  });

  // Handle document editing
  socket.on("editDocument", async ({ documentId, content }) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return socket.emit("error", { message: "Invalid document ID format" });
    }

    const document = await Document.findById(documentId);
    if (document) {
      document.content = content;
      document.version += 1;
      document.lastEdited = new Date();
      await document.save();
      io.to(documentId).emit("documentUpdate", document);
    }
  });

  // Handle chat messages
  socket.on("chatMessage", async ({ documentId, user, message }) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return socket.emit("error", { message: "Invalid document ID format" });
    }

    const newChat = new Chat({ documentId, user, message });
    await newChat.save();
    io.to(documentId).emit("chatUpdate", newChat);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
