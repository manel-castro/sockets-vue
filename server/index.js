const crypto = require("crypto");
const { InMemorySessionStore } = require("./sessionStore");
const { InMemoryMessageStore } = require("./messageStore");

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const randomId = () => crypto.randomBytes(8).toString("hex");

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log("sessionId: ", sessionID);
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    console.log("session: ", session);
    if (session) {
      socket.username = session.username;
      socket.userID = session.userID;
      socket.sessionID = sessionID;
      return next();
    }
  }
  // first time logging
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.username = username;
  socket.sessionID = randomId();
  socket.userID = randomId();

  next();
});

io.on("connection", async (socket) => {
  const session = {
    username: socket.username,
    userID: socket.userID,
    connected: true,
  };

  sessionStore.saveSession(socket.sessionID, session);
  socket.emit("session", {
    userID: socket.userID,
    sessionID: socket.sessionID,
  });

  const users = sessionStore.findAllSession();
  socket.emit("users", users);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
