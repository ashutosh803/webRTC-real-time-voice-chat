require("dotenv").config();
const express = require('express')
const crypto = require("crypto")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const ACTIONS = require("./actions")

const app = express();
const DBConnect = require("./database")

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cookieParser())

const router = require("./routes")

const corsOption = {
  credentials: true,
  origin: ['http://localhost:5173']
}
app.use(cors(corsOption))

const PORT = process.env.PORT || 5500

DBConnect();

app.use(express.json({limit: '8mb'}))

app.use(router)

app.use("/storage", express.static("storage"))

app.get("/", (req, res) => {
  res.json({id: crypto.randomBytes(32).toString('hex')})
})

// sockets
const socketUserMapping = {}

io.on("connection", (socket) => {
  console.log('New connection:', socket.id)

  socket.on(ACTIONS.JOIN, ({roomId, user}) => {
    socketUserMapping[socket.id] = user;
    // new Map
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user
      })

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId]
        })
    })

    socket.join(roomId)
  })


  // mute the mic
  socket.on(ACTIONS.MUTE, ({userId, roomId}) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.MUTE, {userId})
    })
  })

  // un-mute the mic
  socket.on(ACTIONS.UN_MUTE, ({roomId, userId}) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.UN_MUTE, {userId})
    })
  })

  // handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({peerId, icecandidate}) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate
    })
  });

  // handle relay SDP
  socket.on(ACTIONS.RELAY_SDP, ({peerId, sessionDescription}) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription
    })
  });

  socket.on(ACTIONS.ANSWER_SDP, ({peerId, sessionDescription}) => {
    io.to(peerId).emit(ACTIONS.ANSWER_SDP, {peerId: socket.id, sessionDescription})
  })

  socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
        if (clientId !== socket.id) {
            console.log('mute info');
            io.to(clientId).emit(ACTIONS.MUTE_INFO, {
                userId,
                isMute,
            });
        }
    });
});


  // leave the room
  const leaveRoom = ({roomId}) => {
    const { rooms } = socket;
    rooms.forEach(roomId => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach(clientId => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id
        })

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id
        })
      })

      socket.leave(roomId)
    })

    delete socketUserMapping[socket.id];
  }

  socket.on(ACTIONS.LEAVE, leaveRoom)
  socket.on("disconnecting", leaveRoom)
})

server.listen(PORT, () => {
  console.log("listening on port"+PORT)
})
