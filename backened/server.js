require("dotenv").config();
const express = require('express');
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const ACTIONS = require("./actions");

const app = express();
const _dirname = path.resolve();

const DBConnect = require("./database");

const server = require('http').createServer(app);

// Socket.IO setup
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,  // Ensure CLIENT_URL is set correctly in .env
    methods: ['GET', 'POST'],
    credentials: true,  // Allow credentials to be shared (cookies, headers, etc.)
  }
});

app.use(cookieParser());

// CORS configuration for all requests
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from both local and production frontend URLs
    const allowedOrigins = [
      process.env.LOCAL_DEV_CLIENT_URL,  // Local dev URL
      process.env.CLIENT_URL  // Production URL
    ];

    if (allowedOrigins.includes(origin) || !origin) {  // Allow requests without origin (like curl or Postman)
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true,  // Allow credentials (cookies, headers, etc.)
  preflightContinue: false, // Express will handle OPTIONS preflight requests
  optionsSuccessStatus: 204,  // For legacy browsers (e.g., IE)
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Database connection
DBConnect();

// Express settings
app.use(express.json({ limit: '8mb' }));

// Routes setup
const router = require("./routes");
app.use(router);

// Static file serving for storage
app.use("/storage", express.static("storage"));

// Handle OPTIONS requests for preflight
app.options('*', cors(corsOptions));

// Socket.IO handling
const socketUserMapping = {};

io.on("connection", (socket) => {
  console.log('New connection:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId]
      });
    });

    socket.join(roomId);
  });

  // Mute the mic
  socket.on(ACTIONS.MUTE, ({ userId, roomId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.MUTE, { userId });
    });
  });

  // Un-mute the mic
  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.UN_MUTE, { userId });
    });
  });

  // Handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate
    });
  });

  // Handle relay SDP
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription
    });
  });

  socket.on(ACTIONS.ANSWER_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.ANSWER_SDP, { peerId: socket.id, sessionDescription });
  });

  socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      if (clientId !== socket.id) {
        io.to(clientId).emit(ACTIONS.MUTE_INFO, {
          userId,
          isMute,
        });
      }
    });
  });

  // Leave the room
  const leaveRoom = ({ roomId }) => {
    const { rooms } = socket;
    rooms.forEach(roomId => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach(clientId => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id
        });
      });

      socket.leave(roomId);
    });

    delete socketUserMapping[socket.id];
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);
});

// Server listening
const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
