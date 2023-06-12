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
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.username = session.username;
      socket.userID = session.userID;
      socket.sessionID = sessionID;
    }
  }
  // first time logging
  const username = socket.handshake.auth.sessionID;
  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.username = username;
  socket.sessionID = randomId();
  socket.userID = randomId();

  next();
});

io.on("connection", async (socket) => {});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
